import { describe, it, expect } from 'vitest';
import { filterRepository } from '../crawler/filtering/repository-filter';
import { RawGiteaRepo } from '../crawler/api/gitea-client';

function createRawRepo(overrides: Partial<RawGiteaRepo> = {}): RawGiteaRepo {
  return {
    id: 10,
    owner: { id: 1, login: 'developer' },
    name: 'valid-repo',
    full_name: 'developer/valid-repo',
    description: 'A genuine open-source project',
    empty: false,
    private: false,
    fork: false,
    size: 2048,
    stars_count: 5,
    forks_count: 1,
    html_url: 'https://gitea.com/developer/valid-repo',
    url: 'https://gitea.com/api/v1/repos/developer/valid-repo',
    archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

describe('Quality Filtering', () => {
  it('allows valid open-source repositories', () => {
    const valid = createRawRepo();
    const result = filterRepository(valid);
    expect(result.allowed).toBe(true);
  });

  it('rejects private repositories', () => {
    const priv = createRawRepo({ private: true });
    const result = filterRepository(priv);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('Private');
  });

  it('rejects empty repositories', () => {
    const empty = createRawRepo({ empty: true });
    const result = filterRepository(empty);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('Empty');
  });

  it('rejects zero-size repositories with 0 stars and no releases', () => {
    const zeroSize = createRawRepo({ size: 0, stars_count: 0, release_counter: 0 });
    const result = filterRepository(zeroSize);
    expect(result.allowed).toBe(false);
  });

  it('rejects malicious XSS injection repository names', () => {
    const xssRepo = createRawRepo({
      name: '-a-href-javascript-alert--XSS---Click-here-for-XSS-test--a-',
      full_name: 'attacker/-a-href-javascript-alert--XSS---Click-here-for-XSS-test--a-',
    });
    const result = filterRepository(xssRepo);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('Spam/Malicious');
  });

  it('rejects single-character name with zero stars', () => {
    const singleChar = createRawRepo({ name: 'x', stars_count: 0 });
    const result = filterRepository(singleChar);
    expect(result.allowed).toBe(false);
  });
});
