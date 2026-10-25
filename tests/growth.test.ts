import { describe, it, expect } from 'vitest';
import { calculateGrowth } from '../crawler/scoring/growth-score';
import { Repository, HistoricalSnapshot } from '../types/repository';

function createMockRepo(id: number, stars: number, forks: number): Repository {
  return {
    id,
    name: 'test-growth',
    fullName: `owner/test-growth-${id}`,
    description: 'Test growth',
    url: 'https://gitea.com/owner/test-growth',
    owner: { username: 'owner', avatarUrl: 'https://gitea.com/avatar.png' },
    topics: [],
    stars,
    forks,
    archived: false,
    fork: false,
    private: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    categories: ['web'],
  };
}

describe('Growth Calculations Engine', () => {
  it('calculates exact star and fork deltas when historical snapshot exists', () => {
    const repo = createMockRepo(101, 150, 45);

    const snapshot24h: HistoricalSnapshot = {
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      totalTracked: 1,
      repositories: {
        101: {
          id: 101,
          fullName: 'owner/test-growth-101',
          stars: 108,
          forks: 40,
          watchers: 12,
          openIssues: 5,
          updatedAt: new Date().toISOString(),
          timestamp: new Date().toISOString(),
        },
      },
    };

    const growth = calculateGrowth(repo, snapshot24h, null);

    expect(growth.starGrowth24h).toBe(42); // 150 - 108
    expect(growth.forkGrowth24h).toBe(5);  // 45 - 40
    expect(growth.growthPercentage24h).toBeCloseTo(38.9, 1);
    expect(growth.starGrowth7d).toBeNull();
  });

  it('returns null when historical snapshot does not exist or repo is untracked', () => {
    const repo = createMockRepo(999, 50, 10);
    const growth = calculateGrowth(repo, null, null);

    expect(growth.starGrowth24h).toBeNull();
    expect(growth.forkGrowth24h).toBeNull();
    expect(growth.growthPercentage24h).toBeNull();
    expect(growth.starGrowth7d).toBeNull();
  });

  it('handles repo starting from 0 stars without NaN percentage', () => {
    const repo = createMockRepo(202, 10, 2);

    const snapshot24h: HistoricalSnapshot = {
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      totalTracked: 1,
      repositories: {
        202: {
          id: 202,
          fullName: 'owner/test-growth-202',
          stars: 0,
          forks: 0,
          watchers: 0,
          openIssues: 0,
          updatedAt: new Date().toISOString(),
          timestamp: new Date().toISOString(),
        },
      },
    };

    const growth = calculateGrowth(repo, snapshot24h, null);

    expect(growth.starGrowth24h).toBe(10);
    expect(growth.growthPercentage24h).toBe(100.0);
    expect(isNaN(growth.growthPercentage24h!)).toBe(false);
  });
});
