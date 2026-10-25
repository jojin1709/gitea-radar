/**
 * Strongly typed normalized repository schema for Gitea Radar.
 * Adapted to real Gitea REST API response structures and historical tracking.
 */

export interface RepositoryOwner {
  username: string;
  avatarUrl: string;
  htmlUrl?: string;
  fullName?: string;
}

export interface RepositoryRelease {
  tag: string;
  name?: string;
  publishedAt?: string;
  url?: string;
}

export interface Repository {
  id: number;
  owner: RepositoryOwner;
  name: string;
  fullName: string;
  description: string;
  url: string;
  cloneUrl?: string;
  sshUrl?: string;
  website?: string;
  language?: string;
  topics: string[];
  stars: number;
  forks: number;
  watchers?: number;
  openIssues?: number;
  size?: number;
  createdAt: string;
  updatedAt: string;
  pushedAt?: string;
  archived: boolean;
  fork: boolean;
  private: boolean;
  defaultBranch?: string;
  license?: string;
  lastCommitAt?: string;
  latestRelease?: RepositoryRelease | null;
  
  // Scoring & Trend calculations
  trendScore?: number;
  trendReason?: string;
  activityScore?: number;
  freshnessScore?: number;

  // Real historical growth (null when historical snapshot unavailable)
  starGrowth24h?: number | null;
  starGrowth7d?: number | null;
  forkGrowth24h?: number | null;
  forkGrowth7d?: number | null;
  growthPercentage24h?: number | null;

  // Classification
  categories: string[];
}

export interface RepositorySnapshotMetric {
  id: number;
  fullName: string;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  updatedAt: string;
  timestamp: string;
}

export interface HistoricalSnapshot {
  timestamp: string; // ISO 8601
  totalTracked: number;
  repositories: Record<number, RepositorySnapshotMetric>;
}

export interface CategorySummary {
  id: string;
  name: string;
  description: string;
  count: number;
  totalStars: number;
  iconName: string;
  topRepositories: string[]; // fullNames
}

export interface LanguageSummary {
  name: string;
  count: number;
  totalStars: number;
  color: string;
  topRepositories: string[]; // fullNames
}

export interface TopicSummary {
  name: string;
  count: number;
  totalStars: number;
  topRepositories: string[]; // fullNames
}

export interface PlatformStats {
  totalRepositories: number;
  totalStars: number;
  totalForks: number;
  languagesCount: number;
  categoriesCount: number;
  topicsCount: number;
  lastCrawledAt: string;
  snapshotCount: number;
}
