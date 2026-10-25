import { describe, it, expect } from 'vitest';
import { normalizeRepository, sanitizeText, normalizeTopics, normalizeAvatar } from '../crawler/normalization/normalize-repository';
import { RawGiteaRepo, RawGiteaRelease } from '../crawler/api/gitea-client';

describe('Repository Normalization', () => {
  it('sanitizes malicious HTML and script tags from description', () => {
    const malicious = '<script>alert("hacked")</script><b>Great Tool!</b> Visit <a href="javascript:void(0)">here</a>';
    const cleaned = sanitizeText(malicious);

    expect(cleaned).not.toContain('<script>');
    expect(cleaned).not.toContain('javascript:');
    expect(cleaned).not.toContain('<b>');
    expect(cleaned).toContain('Great Tool! Visit here');
  });

  it('normalizes topics to lower-case unique valid tokens', () => {
    const raw = ['GoLang', 'CLI-Tool!', 'GoLang', 'a', 'valid-topic', ''];
    const topics = normalizeTopics(raw);

    expect(topics).toEqual(['golang', 'cli-tool', 'valid-topic']);
    expect(topics).not.toContain('a'); // < 2 chars
  });

  it('provides safe fallback avatar when avatar_url is missing', () => {
    const avatar = normalizeAvatar('', 'alice');
    expect(avatar).toContain('libravatar.org/avatar/alice');
  });

  it('correctly maps raw Gitea response fields to Repository model', () => {
    const raw: RawGiteaRepo = {
      id: 550,
      name: 'tea',
      full_name: 'gitea/tea',
      description: 'A command line tool to interact with Gitea servers',
      owner: {
        id: 3,
        login: 'gitea',
        username: 'gitea',
        avatar_url: 'https://gitea.com/avatars/tea.png',
        html_url: 'https://gitea.com/gitea',
      },
      stars_count: 268,
      forks_count: 141,
      watchers_count: 69,
      open_issues_count: 114,
      size: 74454,
      language: 'Go',
      topics: ['gitea', 'cli'],
      created_at: '2019-05-19T11:37:14Z',
      updated_at: '2026-09-03T06:40:06Z',
      archived: false,
      fork: false,
      private: false,
      html_url: 'https://gitea.com/gitea/tea',
      url: 'https://gitea.com/api/v1/repos/gitea/tea',
      clone_url: 'https://gitea.com/gitea/tea.git',
      default_branch: 'main',
      licenses: ['MIT'],
    };

    const release: RawGiteaRelease = {
      id: 1,
      tag_name: 'v0.15.1',
      name: 'v0.15.1',
      published_at: '2026-08-02T14:40:05Z',
      html_url: 'https://gitea.com/gitea/tea/releases/tag/v0.15.1',
    };

    const repo = normalizeRepository(raw, release);

    expect(repo.id).toBe(550);
    expect(repo.name).toBe('tea');
    expect(repo.fullName).toBe('gitea/tea');
    expect(repo.stars).toBe(268);
    expect(repo.forks).toBe(141);
    expect(repo.language).toBe('Go');
    expect(repo.license).toBe('MIT');
    expect(repo.latestRelease?.tag).toBe('v0.15.1');
  });
});
