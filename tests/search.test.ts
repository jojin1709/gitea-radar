import { describe, it, expect } from 'vitest';
import { searchRepositories } from '../lib/search';
import { Repository } from '../types/repository';

function createMockRepo(overrides: Partial<Repository> = {}): Repository {
  return {
    id: 1,
    name: 'security-scanner',
    fullName: 'jojin/security-scanner',
    description: 'An advanced vulnerability scanner and penetration testing tool',
    url: 'https://gitea.com/jojin/security-scanner',
    stars: 100,
    forks: 20,
    watchers: 15,
    openIssues: 3,
    size: 4096,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-20T00:00:00Z',
    archived: false,
    fork: false,
    private: false,
    defaultBranch: 'main',
    owner: {
      username: 'jojin',
      avatarUrl: 'https://seccdn.libravatar.org/avatar/jojin',
      htmlUrl: 'https://gitea.com/jojin',
    },
    language: 'Go',
    topics: ['pentest', 'scanner', 'vulnerability', 'cybersecurity'],
    categories: ['cybersecurity', 'cli'],
    trendScore: 85,
    starGrowth24h: 5,
    ...overrides,
  };
}

describe('Faceted Search Engine', () => {
  const repo1 = createMockRepo({ id: 1, name: 'scanner', fullName: 'sec/scanner', description: 'Network scanner tool', language: 'Go', stars: 100, categories: ['cybersecurity'], topics: ['pentest', 'scanner'] });
  const repo2 = createMockRepo({ id: 2, name: 'web-dashboard', fullName: 'team/web-dashboard', description: 'Next.js admin UI', language: 'TypeScript', stars: 50, categories: ['web'], topics: ['react', 'dashboard'] });
  const repo3 = createMockRepo({ id: 3, name: 'devops-runner', fullName: 'ops/devops-runner', description: 'Automated workflow engine', language: 'Rust', stars: 250, categories: ['devops'], topics: ['ci-cd', 'runner'] });

  const dataset = [repo1, repo2, repo3];

  it('filters by keyword match in name or description', () => {
    const results = searchRepositories(dataset, { query: 'scanner' });
    expect(results.length).toBe(1);
    expect(results[0].id).toBe(1);
  });

  it('filters by language', () => {
    const results = searchRepositories(dataset, { language: 'TypeScript' });
    expect(results.length).toBe(1);
    expect(results[0].id).toBe(2);
  });

  it('filters by category', () => {
    const results = searchRepositories(dataset, { category: 'devops' });
    expect(results.length).toBe(1);
    expect(results[0].id).toBe(3);
  });

  it('filters by minimum stars', () => {
    const results = searchRepositories(dataset, { minStars: 80 });
    expect(results.length).toBe(2);
    expect(results.map(r => r.id)).toContain(1);
    expect(results.map(r => r.id)).toContain(3);
  });

  it('sorts by stars descending', () => {
    const results = searchRepositories(dataset, { sortBy: 'stars' });
    expect(results[0].id).toBe(3); // 250 stars
    expect(results[1].id).toBe(1); // 100 stars
    expect(results[2].id).toBe(2); // 50 stars
  });

  it('returns empty array when no repositories match criteria', () => {
    const results = searchRepositories(dataset, { query: 'nonexistent-crypto-token-xyz' });
    expect(results.length).toBe(0);
  });
});
