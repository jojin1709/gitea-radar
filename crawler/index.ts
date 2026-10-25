import fs from 'fs';
import path from 'path';
import { GiteaClient } from './api/gitea-client';
import { discoverRepositories } from './discovery/discover-repositories';
import { normalizeRepository } from './normalization/normalize-repository';
import { SnapshotManager } from './snapshots/snapshot-manager';
import { calculateGrowth } from './scoring/growth-score';
import { calculateTrendScore } from './scoring/trend-score';
import { classifyRepository, buildCategorySummaries } from './categories/classify-repository';
import { Repository, LanguageSummary, TopicSummary, PlatformStats } from '../types/repository';

export interface CrawlerRunOptions {
  pageSize?: number;
  pagesPerPass?: number;
  fetchReleasesLimit?: number;
  dataDir?: string;
}

export async function runCrawler(options: CrawlerRunOptions = {}): Promise<{
  success: boolean;
  totalRepositories: number;
  savedFiles: string[];
}> {
  console.log('[INFO] ==========================================');
  console.log('[INFO] Starting Gitea Radar Data Engine & Crawler');
  console.log('[INFO] ==========================================');

  const client = new GiteaClient();
  const dataDir = options.dataDir || path.join(process.cwd(), 'data');
  const snapshotsDir = path.join(dataDir, 'snapshots');
  const snapshotManager = new SnapshotManager(snapshotsDir);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 1. Discovery
  const { repositories: rawRepos } = await discoverRepositories(client, {
    pageSize: options.pageSize || 30,
    pagesPerPass: options.pagesPerPass || 3,
  });

  if (rawRepos.length === 0) {
    throw new Error('Crawler discovered 0 valid repositories. Aborting to protect existing datasets.');
  }

  // 2. Fetch releases for top repos (up to fetchReleasesLimit)
  const maxReleases = options.fetchReleasesLimit ?? 40;
  console.log(`[INFO] Fetching latest release metadata for up to ${maxReleases} active repositories...`);

  // Sort raw repos by stars or releases to prioritize
  const candidatesForReleases = [...rawRepos]
    .filter(r => (r.release_counter || 0) > 0 || r.stars_count > 5)
    .slice(0, maxReleases);

  const releaseMap = new Map<string, any>();
  for (const r of candidatesForReleases) {
    const owner = r.owner?.login || r.owner?.username || 'unknown';
    try {
      const rel = await client.getLatestRelease(owner, r.name);
      if (rel) {
        releaseMap.set(`${owner}/${r.name}`, rel);
      }
    } catch {
      // Ignored for release fetch
    }
  }

  // 3. Normalization & Classification
  console.log('[INFO] Normalizing repository records and running classification...');
  const normalizedRepos: Repository[] = rawRepos.map(raw => {
    const owner = raw.owner?.login || raw.owner?.username || 'unknown';
    const release = releaseMap.get(`${owner}/${raw.name}`) || null;
    const repo = normalizeRepository(raw, release);
    repo.categories = classifyRepository(repo);
    return repo;
  });

  // 4. Historical Snapshots & Growth
  console.log('[INFO] Loading historical snapshots for growth analytics...');
  const allSnapshots = snapshotManager.loadAllSnapshots();
  const now = new Date();

  // Snapshot for ~24h ago
  const target24h = now.getTime() - 24 * 60 * 60 * 1000;
  const snapshot24h = snapshotManager.findClosestSnapshot(allSnapshots, target24h);

  // Snapshot for ~7d ago
  const target7d = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const snapshot7d = snapshotManager.findClosestSnapshot(allSnapshots, target7d);

  console.log(`[INFO] Snapshots matched: 24h=${snapshot24h?.timestamp || 'None'}, 7d=${snapshot7d?.timestamp || 'None'}`);

  // 5. Calculate growth and trend scores
  console.log('[INFO] Calculating growth rates and multi-factor trend rankings...');
  for (const repo of normalizedRepos) {
    const growth = calculateGrowth(repo, snapshot24h, snapshot7d);
    repo.starGrowth24h = growth.starGrowth24h;
    repo.forkGrowth24h = growth.forkGrowth24h;
    repo.growthPercentage24h = growth.growthPercentage24h;
    repo.starGrowth7d = growth.starGrowth7d;
    repo.forkGrowth7d = growth.forkGrowth7d;

    const trend = calculateTrendScore(repo, undefined, now);
    repo.trendScore = trend.trendScore;
    repo.activityScore = trend.activityScore;
    repo.freshnessScore = trend.freshnessScore;
    repo.trendReason = trend.trendReason;
  }

  // 6. Save current snapshot
  console.log('[INFO] Saving current snapshot to data/snapshots/...');
  snapshotManager.saveSnapshot(normalizedRepos, now);

  // 7. Aggregate feeds
  console.log('[INFO] Generating discovery feeds and aggregation indexes...');

  // Trending: sorted by trendScore descending
  const trendingRepos = [...normalizedRepos].sort((a, b) => (b.trendScore || 0) - (a.trendScore || 0));

  // Newest: sorted by createdAt descending
  const newestRepos = [...normalizedRepos].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Rising: repos with positive starGrowth24h or high growthPercentage, then falling back to high freshness + activity
  const risingRepos = [...normalizedRepos].sort((a, b) => {
    const growthA = a.starGrowth24h ?? ((a.freshnessScore || 0) > 70 ? (a.activityScore || 0) / 5 : 0);
    const growthB = b.starGrowth24h ?? ((b.freshnessScore || 0) > 70 ? (b.activityScore || 0) / 5 : 0);
    return growthB - growthA;
  });

  // Popular: sorted by stars descending, secondary forks
  const popularRepos = [...normalizedRepos].sort((a, b) => {
    if (b.stars !== a.stars) return b.stars - a.stars;
    return b.forks - a.forks;
  });

  // Categories
  const categoriesData = buildCategorySummaries(normalizedRepos);

  // Languages aggregation
  const langMap: Record<string, { count: number; totalStars: number; repos: string[] }> = {};
  const topicMap: Record<string, { count: number; totalStars: number; repos: string[] }> = {};

  const LANGUAGE_COLORS: Record<string, string> = {
    Go: '#00ADD8',
    Rust: '#DEA584',
    Python: '#3572A5',
    TypeScript: '#3178C6',
    JavaScript: '#F1E05A',
    Java: '#B07219',
    'C++': '#F34B7D',
    C: '#555555',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Shell: '#89E051',
    Vue: '#41B883',
    HTML: '#E34C26',
    CSS: '#563D7C',
    Kotlin: '#A97BFF',
    Swift: '#F05138',
    Dart: '#00B4AB',
    Elixir: '#6E4A7E',
    Haskell: '#5E5086',
    Lua: '#000080',
    Zig: '#EC915C',
    Nix: '#7E7EFF',
  };

  for (const repo of normalizedRepos) {
    if (repo.language) {
      if (!langMap[repo.language]) {
        langMap[repo.language] = { count: 0, totalStars: 0, repos: [] };
      }
      langMap[repo.language].count++;
      langMap[repo.language].totalStars += repo.stars;
      if (langMap[repo.language].repos.length < 5) {
        langMap[repo.language].repos.push(repo.fullName);
      }
    }

    for (const topic of repo.topics) {
      if (!topicMap[topic]) {
        topicMap[topic] = { count: 0, totalStars: 0, repos: [] };
      }
      topicMap[topic].count++;
      topicMap[topic].totalStars += repo.stars;
      if (topicMap[topic].repos.length < 5) {
        topicMap[topic].repos.push(repo.fullName);
      }
    }
  }

  const languagesData: LanguageSummary[] = Object.entries(langMap)
    .map(([name, data]) => ({
      name,
      count: data.count,
      totalStars: data.totalStars,
      color: LANGUAGE_COLORS[name] || '#64748B',
      topRepositories: data.repos,
    }))
    .sort((a, b) => b.totalStars - a.totalStars || b.count - a.count);

  const topicsData: TopicSummary[] = Object.entries(topicMap)
    .map(([name, data]) => ({
      name,
      count: data.count,
      totalStars: data.totalStars,
      topRepositories: data.repos,
    }))
    .sort((a, b) => b.count - a.count || b.totalStars - a.totalStars);

  const totalStars = normalizedRepos.reduce((acc, r) => acc + r.stars, 0);
  const totalForks = normalizedRepos.reduce((acc, r) => acc + r.forks, 0);

  const statsData: PlatformStats = {
    totalRepositories: normalizedRepos.length,
    totalStars,
    totalForks,
    languagesCount: languagesData.length,
    categoriesCount: categoriesData.length,
    topicsCount: topicsData.length,
    lastCrawledAt: now.toISOString(),
    snapshotCount: allSnapshots.length + 1,
  };

  // 8. Write static datasets
  const filesToWrite: Record<string, any> = {
    'repositories.json': normalizedRepos,
    'trending.json': trendingRepos,
    'newest.json': newestRepos,
    'rising.json': risingRepos,
    'popular.json': popularRepos,
    'categories.json': categoriesData,
    'languages.json': languagesData,
    'topics.json': topicsData,
    'stats.json': statsData,
  };

  const writtenPaths: string[] = [];
  for (const [filename, content] of Object.entries(filesToWrite)) {
    const dest = path.join(dataDir, filename);
    fs.writeFileSync(dest, JSON.stringify(content, null, 2), 'utf-8');
    writtenPaths.push(dest);
  }

  console.log(`[INFO] Successfully written ${writtenPaths.length} dataset files to data/`);
  console.log('[INFO] ==========================================');
  console.log(`[INFO] Crawler execution complete. Total repos: ${normalizedRepos.length}`);
  console.log('[INFO] ==========================================');

  return {
    success: true,
    totalRepositories: normalizedRepos.length,
    savedFiles: writtenPaths,
  };
}
