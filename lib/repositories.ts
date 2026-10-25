import {
  Repository,
  CategorySummary,
  LanguageSummary,
  TopicSummary,
  PlatformStats,
} from '../types/repository';

import repositoriesJson from '../data/repositories.json';
import trendingJson from '../data/trending.json';
import newestJson from '../data/newest.json';
import risingJson from '../data/rising.json';
import popularJson from '../data/popular.json';
import categoriesJson from '../data/categories.json';
import languagesJson from '../data/languages.json';
import topicsJson from '../data/topics.json';
import statsJson from '../data/stats.json';

const allRepositories: Repository[] = repositoriesJson as Repository[];
const trendingRepositories: Repository[] = trendingJson as Repository[];
const newestRepositories: Repository[] = newestJson as Repository[];
const risingRepositories: Repository[] = risingJson as Repository[];
const popularRepositories: Repository[] = popularJson as Repository[];
const categoriesList: CategorySummary[] = categoriesJson as CategorySummary[];
const languagesList: LanguageSummary[] = languagesJson as LanguageSummary[];
const topicsList: TopicSummary[] = topicsJson as TopicSummary[];
const statsRecord: PlatformStats = statsJson as PlatformStats;

export function getAllRepositories(): Repository[] {
  return allRepositories;
}

export function getTrendingRepositories(): Repository[] {
  return trendingRepositories;
}

export function getNewestRepositories(): Repository[] {
  return newestRepositories;
}

export function getRisingRepositories(): Repository[] {
  return risingRepositories;
}

export function getPopularRepositories(): Repository[] {
  return popularRepositories;
}

export function getCategories(): CategorySummary[] {
  return categoriesList;
}

export function getCategory(id: string): { summary: CategorySummary | null; repositories: Repository[] } {
  const summary = categoriesList.find(c => c.id.toLowerCase() === id.toLowerCase()) || null;
  const repositories = allRepositories.filter(r => 
    r.categories && r.categories.some(cat => cat.toLowerCase() === id.toLowerCase())
  );
  return { summary, repositories };
}

export function getLanguages(): LanguageSummary[] {
  return languagesList;
}

export function getLanguage(name: string): { summary: LanguageSummary | null; repositories: Repository[] } {
  const decoded = decodeURIComponent(name).toLowerCase();
  const summary = languagesList.find(l => l.name.toLowerCase() === decoded) || null;
  const repositories = allRepositories.filter(r => 
    r.language && r.language.toLowerCase() === decoded
  );
  return { summary, repositories };
}

export function getTopics(): TopicSummary[] {
  return topicsList;
}

export function getTopic(name: string): { summary: TopicSummary | null; repositories: Repository[] } {
  const decoded = decodeURIComponent(name).toLowerCase();
  const summary = topicsList.find(t => t.name.toLowerCase() === decoded) || null;
  const repositories = allRepositories.filter(r => 
    r.topics && r.topics.some(top => top.toLowerCase() === decoded)
  );
  return { summary, repositories };
}

export function getRepository(owner: string, name: string): Repository | null {
  const target = `${owner}/${name}`.toLowerCase();
  return allRepositories.find(r => r.fullName.toLowerCase() === target) || null;
}

export function getPlatformStats(): PlatformStats {
  return statsRecord;
}
