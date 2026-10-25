import { describe, it, expect } from 'vitest';
import { classifyRepository, buildCategorySummaries } from '../crawler/categories/classify-repository';
import { Repository } from '../types/repository';

describe('Category Classification', () => {
  it('classifies AI repositories correctly based on topics and keywords', () => {
    const aiRepo: Partial<Repository> = {
      name: 'ollama-runner',
      fullName: 'org/ollama-runner',
      description: 'Run large language models locally with quantization',
      topics: ['llm', 'transformers'],
    };

    const categories = classifyRepository(aiRepo);
    expect(categories).toContain('ai');
  });

  it('classifies DevOps repositories correctly', () => {
    const devopsRepo: Partial<Repository> = {
      name: 'gitea-act-runner',
      fullName: 'gitea/runner',
      description: 'Official runner for Gitea Actions continuous integration',
      topics: ['gitea-actions', 'ci-cd', 'docker'],
    };

    const categories = classifyRepository(devopsRepo);
    expect(categories).toContain('devops');
  });

  it('falls back to "other" for uncategorized repositories', () => {
    const unkRepo: Partial<Repository> = {
      name: 'random-project-xyz',
      fullName: 'user/random-project-xyz',
      description: 'Some personal project with no matching keywords',
      topics: [],
    };

    const categories = classifyRepository(unkRepo);
    expect(categories).toEqual(['other']);
  });

  it('builds category summaries correctly', () => {
    const repos: Repository[] = [
      {
        id: 1,
        name: 'tea',
        fullName: 'gitea/tea',
        description: 'CLI for Gitea',
        url: 'https://gitea.com/gitea/tea',
        owner: { username: 'gitea', avatarUrl: '' },
        topics: ['cli'],
        stars: 200,
        forks: 50,
        archived: false,
        fork: false,
        private: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        categories: ['cli', 'developer-tools'],
      },
    ];

    const summaries = buildCategorySummaries(repos);
    const cliCat = summaries.find(s => s.id === 'cli');

    expect(cliCat).toBeDefined();
    expect(cliCat?.count).toBe(1);
    expect(cliCat?.totalStars).toBe(200);
    expect(cliCat?.topRepositories).toContain('gitea/tea');
  });
});
