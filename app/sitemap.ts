import { MetadataRoute } from 'next';
import { getAllRepositories, getCategories, getLanguages } from '../lib/repositories';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gitea-radar.vercel.app';
  const now = new Date();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/trending',
    '/newest',
    '/rising',
    '/popular',
    '/categories',
    '/languages',
    '/topics',
    '/search',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Categories
  const categories = getCategories();
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/categories/${c.id}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  // Languages
  const languages = getLanguages();
  const languageRoutes: MetadataRoute.Sitemap = languages.map((l) => ({
    url: `${baseUrl}/languages/${encodeURIComponent(l.name)}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  // Top Repositories (up to 200 for initial sitemap)
  const repos = getAllRepositories().slice(0, 200);
  const repoRoutes: MetadataRoute.Sitemap = repos.map((r) => ({
    url: `${baseUrl}/repository/${r.owner.username}/${r.name}`,
    lastModified: new Date(r.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...languageRoutes, ...repoRoutes];
}
