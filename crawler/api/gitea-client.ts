/**
 * Resilient Gitea REST API Client.
 * Supports pagination, retry with exponential backoff, rate limiting (429 handling),
 * and configurable concurrency.
 */

export interface GiteaSearchOptions {
  q?: string;
  topic?: boolean;
  includeDesc?: boolean;
  page?: number;
  limit?: number;
  sort?: 'stars' | 'updated' | 'created' | 'forks' | 'recentupdate';
  order?: 'asc' | 'desc';
  uid?: number;
  priority_owner_id?: number;
}

export interface RawGiteaUser {
  id: number;
  login: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  html_url?: string;
  username?: string;
  website?: string;
  description?: string;
}

export interface RawGiteaRelease {
  id: number;
  tag_name: string;
  name?: string;
  body?: string;
  url?: string;
  html_url?: string;
  draft?: boolean;
  prerelease?: boolean;
  created_at?: string;
  published_at?: string;
  author?: RawGiteaUser;
}

export interface RawGiteaRepo {
  id: number;
  owner: RawGiteaUser;
  name: string;
  full_name: string;
  description?: string;
  empty?: boolean;
  private: boolean;
  fork: boolean;
  template?: boolean;
  mirror?: boolean;
  size?: number;
  language?: string;
  languages_url?: string;
  html_url: string;
  url: string;
  ssh_url?: string;
  clone_url?: string;
  original_url?: string;
  website?: string;
  stars_count: number;
  forks_count: number;
  watchers_count?: number;
  open_issues_count?: number;
  open_pr_counter?: number;
  release_counter?: number;
  default_branch?: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
  archived_at?: string;
  avatar_url?: string;
  topics?: string[];
  licenses?: string[];
  has_issues?: boolean;
  has_pull_requests?: boolean;
  has_wiki?: boolean;
}

export interface GiteaSearchResponse {
  ok: boolean;
  data: RawGiteaRepo[];
  totalCount?: number;
}

export class GiteaClient {
  private baseUrl: string;
  private token?: string;
  private timeoutMs: number;
  private maxRetries: number;
  private delayBetweenRequestsMs: number;

  constructor(options?: {
    baseUrl?: string;
    token?: string;
    timeoutMs?: number;
    maxRetries?: number;
    delayBetweenRequestsMs?: number;
  }) {
    this.baseUrl = (options?.baseUrl || process.env.GITEA_API_URL || 'https://gitea.com').replace(/\/+$/, '');
    this.token = options?.token || process.env.GITEA_TOKEN;
    this.timeoutMs = options?.timeoutMs || 15000;
    this.maxRetries = options?.maxRetries ?? 3;
    this.delayBetweenRequestsMs = options?.delayBetweenRequestsMs ?? (Number(process.env.CRAWLER_PAGE_DELAY_MS) || 250);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async fetchWithRetry<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T; headers: Headers }> {
    const url = `${this.baseUrl}/api/v1${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'Gitea-Radar-Crawler/1.0 (+https://github.com/gitea-radar)',
      ...(this.token ? { 'Authorization': `token ${this.token}` } : {}),
      ...(options.headers as Record<string, string> || {}),
    };

    let attempt = 0;
    let delay = 1000;

    while (attempt <= this.maxRetries) {
      attempt++;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.status === 429) {
          // Rate limited: inspect Retry-After or exponential backoff
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : delay * Math.pow(2, attempt - 1);
          const jitter = Math.floor(Math.random() * 500);
          console.warn(`[GiteaClient] Rate limited (429) on ${endpoint}. Waiting ${waitTime + jitter}ms (attempt ${attempt}/${this.maxRetries})`);
          await this.sleep(waitTime + jitter);
          continue;
        }

        if (response.status >= 500 && attempt <= this.maxRetries) {
          console.warn(`[GiteaClient] Server error (${response.status}) on ${endpoint}. Retrying in ${delay}ms...`);
          await this.sleep(delay);
          delay *= 2;
          continue;
        }

        if (!response.ok) {
          if (response.status === 404 || response.status === 403) {
            throw new Error(`PERM_OR_NOT_FOUND: ${url} (${response.status})`);
          }
          const text = await response.text().catch(() => '');
          throw new Error(`HTTP ${response.status} from ${url}: ${text}`);
        }

        const data = await response.json() as T;
        return { data, headers: response.headers };
      } catch (err: unknown) {
        const isAbort = (err as Error)?.name === 'AbortError';
        const isPermOrNotFound = (err as Error)?.message?.startsWith('PERM_OR_NOT_FOUND:');

        if (isPermOrNotFound) {
          throw err;
        }

        if (attempt <= this.maxRetries) {
          const reason = isAbort ? 'Timeout' : (err as Error)?.message || 'Network error';
          console.warn(`[GiteaClient] ${reason} on ${endpoint} (attempt ${attempt}/${this.maxRetries}). Retrying in ${delay}ms...`);
          await this.sleep(delay);
          delay *= 2;
        } else {
          throw err;
        }
      }
    }

    throw new Error(`Failed to fetch ${endpoint} after ${this.maxRetries} attempts.`);
  }

  /**
   * Search repositories with pagination and filtering.
   */
  async searchRepositories(options: GiteaSearchOptions = {}): Promise<GiteaSearchResponse> {
    const params = new URLSearchParams();
    if (options.q) params.set('q', options.q);
    if (options.topic !== undefined) params.set('topic', String(options.topic));
    if (options.includeDesc !== undefined) params.set('includeDesc', String(options.includeDesc));
    if (options.page) params.set('page', String(options.page));
    if (options.limit) params.set('limit', String(options.limit));
    if (options.sort) params.set('sort', options.sort);
    if (options.order) params.set('order', options.order);

    if (this.delayBetweenRequestsMs > 0) {
      await this.sleep(this.delayBetweenRequestsMs);
    }

    const { data, headers } = await this.fetchWithRetry<GiteaSearchResponse | RawGiteaRepo[]>(
      `/repos/search?${params.toString()}`
    );

    const totalCount = Number(headers.get('X-Total-Count')) || undefined;

    // Gitea returns { ok: true, data: [...] } for /repos/search
    if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as GiteaSearchResponse).data)) {
      return {
        ok: true,
        data: (data as GiteaSearchResponse).data,
        totalCount,
      };
    }

    if (Array.isArray(data)) {
      return {
        ok: true,
        data: data as RawGiteaRepo[],
        totalCount,
      };
    }

    return {
      ok: false,
      data: [],
      totalCount: 0,
    };
  }

  /**
   * Fetch latest releases for a repository.
   */
  async getLatestRelease(owner: string, repo: string): Promise<RawGiteaRelease | null> {
    try {
      if (this.delayBetweenRequestsMs > 0) {
        await this.sleep(this.delayBetweenRequestsMs);
      }
      const { data } = await this.fetchWithRetry<RawGiteaRelease[]>(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/releases?limit=1`
      );
      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      }
      return null;
    } catch (err: unknown) {
      // 404, 403 or empty releases is normal for repos without public releases
      if ((err as Error)?.message?.startsWith('PERM_OR_NOT_FOUND:')) {
        return null;
      }
      console.warn(`[GiteaClient] Failed to fetch releases for ${owner}/${repo}: ${(err as Error)?.message}`);
      return null;
    }
  }

  /**
   * Fetch single repository metadata.
   */
  async getRepository(owner: string, repo: string): Promise<RawGiteaRepo | null> {
    try {
      const { data } = await this.fetchWithRetry<RawGiteaRepo>(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
      );
      return data;
    } catch (err: unknown) {
      if ((err as Error)?.message?.startsWith('PERM_OR_NOT_FOUND:')) {
        return null;
      }
      throw err;
    }
  }
}
