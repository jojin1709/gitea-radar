import { Repository } from '../../types/repository';

export interface TrendCalculationResult {
  trendScore: number;
  activityScore: number;
  freshnessScore: number;
  trendReason: string;
}

export interface TrendScoringWeights {
  starGrowthWeight: number;
  forkGrowthWeight: number;
  activityWeight: number;
  freshnessWeight: number;
  basePopularityWeight: number;
}

export const DEFAULT_TREND_WEIGHTS: TrendScoringWeights = {
  starGrowthWeight: 5.0,
  forkGrowthWeight: 3.0,
  activityWeight: 2.0,
  freshnessWeight: 1.0,
  basePopularityWeight: 1.5,
};

/**
 * Calculates repository activity score based on recent updates, releases, and issue activity.
 * Returns a value typically between 0 and 100.
 */
export function calculateActivityScore(repo: Repository, now: Date = new Date()): number {
  let score = 0;

  // 1. Recency of update (up to 40 points)
  const updatedAt = new Date(repo.updatedAt).getTime();
  const hoursSinceUpdate = Math.max(0, (now.getTime() - updatedAt) / (1000 * 60 * 60));
  if (hoursSinceUpdate <= 24) {
    score += 40;
  } else if (hoursSinceUpdate <= 72) {
    score += 30;
  } else if (hoursSinceUpdate <= 168) { // 7 days
    score += 20;
  } else if (hoursSinceUpdate <= 720) { // 30 days
    score += 10;
  }

  // 2. Recent release presence (up to 30 points)
  if (repo.latestRelease?.publishedAt) {
    const releaseTime = new Date(repo.latestRelease.publishedAt).getTime();
    const daysSinceRelease = Math.max(0, (now.getTime() - releaseTime) / (1000 * 60 * 60 * 24));
    if (daysSinceRelease <= 7) {
      score += 30;
    } else if (daysSinceRelease <= 30) {
      score += 20;
    } else if (daysSinceRelease <= 90) {
      score += 10;
    }
  }

  // 3. Issue and PR health (up to 30 points)
  const openIssues = repo.openIssues || 0;
  if (openIssues > 0 && openIssues < 500) {
    score += Math.min(20, Math.round(Math.log2(openIssues + 1) * 3));
  }

  if (repo.watchers && repo.watchers > 0) {
    score += Math.min(10, repo.watchers);
  }

  return Math.min(100, score);
}

/**
 * Calculates freshness score giving a discovery boost to newer repositories.
 * Newer repos get up to 100 points, linearly decayed over 180 days.
 */
export function calculateFreshnessScore(repo: Repository, now: Date = new Date()): number {
  const createdAt = new Date(repo.createdAt).getTime();
  const daysSinceCreation = Math.max(0, (now.getTime() - createdAt) / (1000 * 60 * 60 * 24));
  return Math.max(0, Math.round(100 - daysSinceCreation * 0.5));
}

/**
 * Computes the multi-factor trend score and natural language explanation.
 */
export function calculateTrendScore(
  repo: Repository,
  weights: TrendScoringWeights = DEFAULT_TREND_WEIGHTS,
  now: Date = new Date()
): TrendCalculationResult {
  const activityScore = calculateActivityScore(repo, now);
  const freshnessScore = calculateFreshnessScore(repo, now);

  const starGrowth = repo.starGrowth24h ?? 0;
  const forkGrowth = repo.forkGrowth24h ?? 0;

  // Base popularity damping via log10 so massive repos don't crowd out emerging ones
  const basePopularity = Math.log10(repo.stars + 1) * 10;

  // If repo is archived, apply a penalty
  const archivedMultiplier = repo.archived ? 0.3 : 1.0;

  const rawScore = (
    starGrowth * weights.starGrowthWeight +
    forkGrowth * weights.forkGrowthWeight +
    (activityScore / 10) * weights.activityWeight +
    (freshnessScore / 10) * weights.freshnessWeight +
    basePopularity * weights.basePopularityWeight
  ) * archivedMultiplier;

  const trendScore = Math.round(rawScore * 10) / 10;

  // Determine human-readable reason for trending
  let trendReason = 'Solid community interest and healthy activity';

  if (starGrowth > 10) {
    trendReason = `Rapid 24h star surge (+${starGrowth} stars)`;
  } else if (starGrowth > 0) {
    trendReason = `Consistent star growth (+${starGrowth} in 24h)`;
  } else if (freshnessScore > 75 && repo.stars >= 5) {
    trendReason = 'Breakout new repository with fast adoption';
  } else if (repo.latestRelease && activityScore >= 70) {
    trendReason = `Recent major release (${repo.latestRelease.tag}) & active commits`;
  } else if (activityScore >= 60) {
    trendReason = 'High commit, issue, and contributor velocity';
  } else if (repo.stars >= 100) {
    trendReason = 'Established ecosystem staple in Gitea';
  }

  return {
    trendScore,
    activityScore,
    freshnessScore,
    trendReason,
  };
}
