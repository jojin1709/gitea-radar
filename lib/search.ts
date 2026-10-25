import { Repository } from '../types/repository';

export interface SearchFilters {
  query?: string;
  language?: string;
  category?: string;
  topic?: string;
  minStars?: number;
  minForks?: number;
  updatedWithinDays?: number;
  sortBy?: 'relevance' | 'stars' | 'updated' | 'created' | 'trend' | 'growth';
}

export function searchRepositories(repos: Repository[], filters: SearchFilters): Repository[] {
  const queryTokens = (filters.query || '')
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const selectedLang = filters.language?.toLowerCase();
  const selectedCat = filters.category?.toLowerCase();
  const selectedTopic = filters.topic?.toLowerCase();
  const minStars = filters.minStars || 0;
  const minForks = filters.minForks || 0;

  let cutoffTime = 0;
  if (filters.updatedWithinDays) {
    cutoffTime = Date.now() - filters.updatedWithinDays * 24 * 60 * 60 * 1000;
  }

  const scored: { repo: Repository; score: number }[] = [];

  for (const repo of repos) {
    // Check filters first
    if (repo.stars < minStars) continue;
    if (repo.forks < minForks) continue;

    if (selectedLang && (!repo.language || repo.language.toLowerCase() !== selectedLang)) {
      continue;
    }

    if (selectedCat && (!repo.categories || !repo.categories.some(c => c.toLowerCase() === selectedCat))) {
      continue;
    }

    if (selectedTopic && (!repo.topics || !repo.topics.some(t => t.toLowerCase() === selectedTopic))) {
      continue;
    }

    if (cutoffTime > 0) {
      const updatedTime = new Date(repo.updatedAt).getTime();
      if (updatedTime < cutoffTime) continue;
    }

    // Text search relevance score
    let relevanceScore = 1;

    if (queryTokens.length > 0) {
      const name = repo.name.toLowerCase();
      const fullName = repo.fullName.toLowerCase();
      const desc = (repo.description || '').toLowerCase();
      const topics = repo.topics.map(t => t.toLowerCase());

      let allMatched = true;

      for (const token of queryTokens) {
        let tokenMatched = false;

        if (name === token) {
          relevanceScore += 100;
          tokenMatched = true;
        } else if (name.includes(token)) {
          relevanceScore += 50;
          tokenMatched = true;
        } else if (fullName.includes(token)) {
          relevanceScore += 30;
          tokenMatched = true;
        }

        if (topics.includes(token)) {
          relevanceScore += 40;
          tokenMatched = true;
        } else if (topics.some(t => t.includes(token))) {
          relevanceScore += 20;
          tokenMatched = true;
        }

        if (desc.includes(token)) {
          relevanceScore += 15;
          tokenMatched = true;
        }

        const owner = repo.owner?.username?.toLowerCase() || '';
        if (owner.includes(token)) {
          relevanceScore += 25;
          tokenMatched = true;
        }

        if (repo.categories && repo.categories.some(c => c.toLowerCase().includes(token))) {
          relevanceScore += 35;
          tokenMatched = true;
        }

        if (repo.language && repo.language.toLowerCase().includes(token)) {
          relevanceScore += 25;
          tokenMatched = true;
        }

        if (!tokenMatched) {
          allMatched = false;
          break;
        }
      }

      if (!allMatched) {
        continue;
      }
    }

    scored.push({ repo, score: relevanceScore });
  }

  // Sort
  const sortBy = filters.sortBy || (queryTokens.length > 0 ? 'relevance' : 'stars');

  scored.sort((a, b) => {
    if (sortBy === 'relevance') {
      if (b.score !== a.score) return b.score - a.score;
      return b.repo.stars - a.repo.stars;
    }
    if (sortBy === 'stars') {
      return b.repo.stars - a.repo.stars;
    }
    if (sortBy === 'updated') {
      return new Date(b.repo.updatedAt).getTime() - new Date(a.repo.updatedAt).getTime();
    }
    if (sortBy === 'created') {
      return new Date(b.repo.createdAt).getTime() - new Date(a.repo.createdAt).getTime();
    }
    if (sortBy === 'trend') {
      return (b.repo.trendScore || 0) - (a.repo.trendScore || 0);
    }
    if (sortBy === 'growth') {
      return (b.repo.starGrowth24h || 0) - (a.repo.starGrowth24h || 0);
    }
    return 0;
  });

  return scored.map(s => s.repo);
}
