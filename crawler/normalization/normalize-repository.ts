import { RawGiteaRepo, RawGiteaRelease } from '../api/gitea-client';
import { Repository } from '../../types/repository';

/**
 * Strips dangerous HTML tags and script injections from text.
 */
export function sanitizeText(input?: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, '') // remove HTML tags
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Normalizes topics into clean, lower-case, unique alphanumeric kebab-case tokens.
 */
export function normalizeTopics(rawTopics?: string[]): string[] {
  if (!Array.isArray(rawTopics)) return [];
  const set = new Set<string>();
  for (const topic of rawTopics) {
    if (typeof topic === 'string') {
      const cleaned = topic.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '');
      if (cleaned.length >= 2 && cleaned.length <= 40) {
        set.add(cleaned);
      }
    }
  }
  return Array.from(set);
}

/**
 * Ensures valid avatar URL or falls back to an identicon.
 */
export function normalizeAvatar(rawAvatar?: string, username?: string): string {
  if (rawAvatar && rawAvatar.startsWith('http')) {
    return rawAvatar;
  }
  const cleanUser = encodeURIComponent(username || 'anonymous');
  return `https://seccdn.libravatar.org/avatar/${cleanUser}?d=identicon`;
}

/**
 * Adapts RawGiteaRepo into a strongly typed Repository entity.
 */
export function normalizeRepository(raw: RawGiteaRepo, latestRelease?: RawGiteaRelease | null): Repository {
  const username = raw.owner?.username || raw.owner?.login || 'unknown';
  const name = raw.name || 'untitled';
  const fullName = raw.full_name || `${username}/${name}`;
  const sanitizedDesc = sanitizeText(raw.description);

  // Extract license string
  let license: string | undefined;
  if (Array.isArray(raw.licenses) && raw.licenses.length > 0) {
    license = raw.licenses[0];
  }

  // Language normalization
  const language = raw.language && raw.language.trim().length > 0 && raw.language.toLowerCase() !== 'text'
    ? raw.language.trim()
    : undefined;

  const topics = normalizeTopics(raw.topics);

  const repo: Repository = {
    id: raw.id,
    owner: {
      username,
      avatarUrl: normalizeAvatar(raw.owner?.avatar_url, username),
      htmlUrl: raw.owner?.html_url || `https://gitea.com/${username}`,
      fullName: raw.owner?.full_name,
    },
    name,
    fullName,
    description: sanitizedDesc,
    url: raw.html_url || `https://gitea.com/${fullName}`,
    cloneUrl: raw.clone_url,
    sshUrl: raw.ssh_url,
    website: raw.website && raw.website.startsWith('http') ? raw.website : undefined,
    language,
    topics,
    stars: Math.max(0, raw.stars_count || 0),
    forks: Math.max(0, raw.forks_count || 0),
    watchers: Math.max(0, raw.watchers_count || 0),
    openIssues: Math.max(0, raw.open_issues_count || 0),
    size: Math.max(0, raw.size || 0),
    createdAt: raw.created_at || new Date().toISOString(),
    updatedAt: raw.updated_at || new Date().toISOString(),
    archived: Boolean(raw.archived),
    fork: Boolean(raw.fork),
    private: Boolean(raw.private),
    defaultBranch: raw.default_branch || 'main',
    license,
    latestRelease: latestRelease
      ? {
          tag: latestRelease.tag_name,
          name: latestRelease.name || latestRelease.tag_name,
          publishedAt: latestRelease.published_at || latestRelease.created_at,
          url: latestRelease.html_url,
        }
      : undefined,
    categories: [],
  };

  return repo;
}
