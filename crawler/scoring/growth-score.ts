import { Repository, HistoricalSnapshot } from '../../types/repository';

export interface GrowthMetrics {
  starGrowth24h: number | null;
  forkGrowth24h: number | null;
  growthPercentage24h: number | null;
  starGrowth7d: number | null;
  forkGrowth7d: number | null;
}

/**
 * Calculates historical growth metrics for a repository against prior snapshots.
 * Returns null for growth fields if no relevant historical snapshot exists.
 */
export function calculateGrowth(
  repo: Repository,
  snapshot24h: HistoricalSnapshot | null,
  snapshot7d: HistoricalSnapshot | null
): GrowthMetrics {
  let starGrowth24h: number | null = null;
  let forkGrowth24h: number | null = null;
  let growthPercentage24h: number | null = null;

  if (snapshot24h && snapshot24h.repositories[repo.id]) {
    const past = snapshot24h.repositories[repo.id];
    starGrowth24h = Math.max(0, repo.stars - past.stars);
    forkGrowth24h = Math.max(0, repo.forks - past.forks);

    if (past.stars > 0) {
      growthPercentage24h = Math.round(((repo.stars - past.stars) / past.stars) * 1000) / 10;
    } else if (repo.stars > 0) {
      growthPercentage24h = 100.0;
    } else {
      growthPercentage24h = 0;
    }
  }

  let starGrowth7d: number | null = null;
  let forkGrowth7d: number | null = null;

  if (snapshot7d && snapshot7d.repositories[repo.id]) {
    const past = snapshot7d.repositories[repo.id];
    starGrowth7d = Math.max(0, repo.stars - past.stars);
    forkGrowth7d = Math.max(0, repo.forks - past.forks);
  }

  return {
    starGrowth24h,
    forkGrowth24h,
    growthPercentage24h,
    starGrowth7d,
    forkGrowth7d,
  };
}
