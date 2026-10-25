import { describe, it, expect } from 'vitest';
import { calculateTrendScore, calculateActivityScore, calculateFreshnessScore } from '../crawler/scoring/trend-score';
import { Repository } from '../types/repository';

function createMockRepo(overrides: Partial<Repository> = {}): Repository {
  return {
    id: 1,
    name: 'test-repo',
    fullName: 'owner/test-repo',
    description: 'A test repo',
    url: 'https://gitea.com/owner/test-repo',
    owner: { username: 'owner', avatarUrl: 'https://gitea.com/avatar.png' },
    topics: [],
    stars: 10,
    forks: 2,
    archived: false,
    fork: false,
    private: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    categories: ['developer-tools'],
    ...overrides,
  };
}

describe('Trend Scoring Algorithm', () => {
  it('calculates higher trend score for repositories with rapid 24h star growth', () => {
    const stagnantRepo = createMockRepo({ stars: 1000, starGrowth24h: 0 });
    const fastGrowingRepo = createMockRepo({ stars: 200, starGrowth24h: 50 });

    const stagnantScore = calculateTrendScore(stagnantRepo);
    const fastGrowingScore = calculateTrendScore(fastGrowingRepo);

    expect(fastGrowingScore.trendScore).toBeGreaterThan(stagnantScore.trendScore);
    expect(fastGrowingScore.trendReason).toContain('Rapid 24h star surge');
  });

  it('handles edge case: 0 stars, 0 forks', () => {
    const zeroRepo = createMockRepo({ stars: 0, forks: 0, starGrowth24h: null, forkGrowth24h: null });
    const result = calculateTrendScore(zeroRepo);

    expect(result.trendScore).toBeGreaterThanOrEqual(0);
    expect(isNaN(result.trendScore)).toBe(false);
  });

  it('handles edge case: huge star count without overflow', () => {
    const hugeRepo = createMockRepo({ stars: 100000, forks: 20000 });
    const result = calculateTrendScore(hugeRepo);

    expect(result.trendScore).toBeGreaterThan(0);
    expect(Number.isFinite(result.trendScore)).toBe(true);
  });

  it('penalizes archived repositories', () => {
    const activeRepo = createMockRepo({ stars: 100, archived: false });
    const archivedRepo = createMockRepo({ stars: 100, archived: true });

    const activeScore = calculateTrendScore(activeRepo);
    const archivedScore = calculateTrendScore(archivedRepo);

    expect(archivedScore.trendScore).toBeLessThan(activeScore.trendScore);
  });

  it('gives freshness boost to recently created repositories', () => {
    const newRepo = createMockRepo({
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    });
    const oldRepo = createMockRepo({
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const newFreshness = calculateFreshnessScore(newRepo);
    const oldFreshness = calculateFreshnessScore(oldRepo);

    expect(newFreshness).toBeGreaterThan(oldFreshness);
  });

  it('gives high activity score to repositories with recent releases', () => {
    const repoWithRelease = createMockRepo({
      latestRelease: {
        tag: 'v1.0.0',
        name: 'v1.0.0 Initial Release',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    });

    const repoWithoutRelease = createMockRepo({ latestRelease: undefined });

    const scoreWith = calculateActivityScore(repoWithRelease);
    const scoreWithout = calculateActivityScore(repoWithoutRelease);

    expect(scoreWith).toBeGreaterThan(scoreWithout);
  });
});
