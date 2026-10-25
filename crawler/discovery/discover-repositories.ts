import { GiteaClient, RawGiteaRepo } from '../api/gitea-client';
import { filterRepository } from '../filtering/repository-filter';

export interface DiscoveryStats {
  totalDiscovered: number;
  filteredOut: number;
  uniqueRepositories: number;
}

/**
 * Runs multi-pass discovery across Gitea's public REST API to find popular,
 * recently active, emerging, and topic-specific repositories.
 */
export async function discoverRepositories(
  client: GiteaClient,
  options?: {
    pageSize?: number;
    pagesPerPass?: number;
  }
): Promise<{ repositories: RawGiteaRepo[]; stats: DiscoveryStats }> {
  const pageSize = options?.pageSize || 30;
  const pagesPerPass = options?.pagesPerPass || 3;

  const repoMap = new Map<number, RawGiteaRepo>();
  let filteredOutCount = 0;
  let totalDiscoveredCount = 0;

  const processBatch = (rawBatch: RawGiteaRepo[], passName: string) => {
    totalDiscoveredCount += rawBatch.length;
    for (const repo of rawBatch) {
      const filterResult = filterRepository(repo);
      if (!filterResult.allowed) {
        filteredOutCount++;
        continue;
      }

      if (!repoMap.has(repo.id)) {
        repoMap.set(repo.id, repo);
      }
    }
  };

  console.log(`[INFO] Starting discovery passes (pageSize=${pageSize}, pagesPerPass=${pagesPerPass})...`);

  // Pass 1: Most Starred
  console.log('[INFO] Pass 1: Discovering most starred repositories...');
  for (let page = 1; page <= pagesPerPass; page++) {
    try {
      const res = await client.searchRepositories({
        sort: 'stars',
        order: 'desc',
        page,
        limit: pageSize,
      });
      if (res.data && res.data.length > 0) {
        processBatch(res.data, 'Most Starred');
      } else {
        break;
      }
    } catch (err) {
      console.warn(`[WARN] Pass 1 (stars, page ${page}) failed:`, (err as Error)?.message);
    }
  }

  // Pass 2: Recently Updated
  console.log('[INFO] Pass 2: Discovering recently updated repositories...');
  for (let page = 1; page <= pagesPerPass; page++) {
    try {
      const res = await client.searchRepositories({
        sort: 'updated',
        order: 'desc',
        page,
        limit: pageSize,
      });
      if (res.data && res.data.length > 0) {
        processBatch(res.data, 'Recently Updated');
      } else {
        break;
      }
    } catch (err) {
      console.warn(`[WARN] Pass 2 (updated, page ${page}) failed:`, (err as Error)?.message);
    }
  }

  // Pass 3: Recently Created
  console.log('[INFO] Pass 3: Discovering recently created repositories...');
  for (let page = 1; page <= pagesPerPass; page++) {
    try {
      const res = await client.searchRepositories({
        sort: 'created',
        order: 'desc',
        page,
        limit: pageSize,
      });
      if (res.data && res.data.length > 0) {
        processBatch(res.data, 'Recently Created');
      } else {
        break;
      }
    } catch (err) {
      console.warn(`[WARN] Pass 3 (created, page ${page}) failed:`, (err as Error)?.message);
    }
  }

  // Pass 4: Most Forked
  console.log('[INFO] Pass 4: Discovering most forked repositories...');
  for (let page = 1; page <= 2; page++) {
    try {
      const res = await client.searchRepositories({
        sort: 'forks',
        order: 'desc',
        page,
        limit: pageSize,
      });
      if (res.data && res.data.length > 0) {
        processBatch(res.data, 'Most Forked');
      } else {
        break;
      }
    } catch (err) {
      console.warn(`[WARN] Pass 4 (forks, page ${page}) failed:`, (err as Error)?.message);
    }
  }

  // Pass 5: Targeted Keyword & Topic discovery for ecosystem richness
  const keywordQueries = [
    'gitea',
    'tools',
    'server',
    'bot',
    'security',
    'api',
    'cyber',
    'burp',
    'burpsuite',
    'cve',
    'exploit',
    'pentest',
    'scanner',
    'payload',
    'infosec',
    'osint',
    'reverse-engineering',
    'fuzzing',
  ];
  console.log(`[INFO] Pass 5: Discovering topic & keyword repositories (${keywordQueries.join(', ')})...`);

  for (const q of keywordQueries) {
    try {
      const res = await client.searchRepositories({
        q,
        sort: 'stars',
        order: 'desc',
        page: 1,
        limit: 15,
      });
      if (res.data && res.data.length > 0) {
        processBatch(res.data, `Keyword "${q}"`);
      }
    } catch (err) {
      console.warn(`[WARN] Pass 5 (query "${q}") failed:`, (err as Error)?.message);
    }
  }

  const repositories = Array.from(repoMap.values());
  console.log(`[INFO] Discovery completed. Raw discovered: ${totalDiscoveredCount}, Filtered out: ${filteredOutCount}, Unique valid repos: ${repositories.length}`);

  return {
    repositories,
    stats: {
      totalDiscovered: totalDiscoveredCount,
      filteredOut: filteredOutCount,
      uniqueRepositories: repositories.length,
    },
  };
}
