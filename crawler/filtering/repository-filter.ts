import { RawGiteaRepo } from '../api/gitea-client';

export interface FilterOptions {
  allowPrivate?: boolean;
  allowArchived?: boolean;
  allowEmpty?: boolean;
  minStars?: number;
  excludeSpam?: boolean;
}

const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  allowPrivate: false,
  allowArchived: true, // We allow archived, but de-emphasize in trending
  allowEmpty: false,
  minStars: 0,
  excludeSpam: true,
};

// Patterns matching malicious test repositories or blatant spam
const SPAM_NAME_PATTERNS = [
  /javascript:/i,
  /<[^>]+>/i,
  /alert\(/i,
  /xss-test/i,
  /prompt-injection/i,
  /hackclient.*fucking/i,
  /free-crypto/i,
  /telegram-scam/i,
  /casino-online/i,
];

/**
 * Validates whether a repository meets quality and safety standards.
 */
export function filterRepository(
  repo: RawGiteaRepo,
  options: FilterOptions = DEFAULT_FILTER_OPTIONS
): { allowed: boolean; reason?: string } {
  // 1. Private check
  if (!options.allowPrivate && repo.private) {
    return { allowed: false, reason: 'Private repository' };
  }

  // 2. Empty check
  if (!options.allowEmpty) {
    if (repo.empty === true) {
      return { allowed: false, reason: 'Empty repository flag' };
    }
    if ((repo.size === 0 || repo.size === undefined) && (repo.stars_count || 0) === 0 && (repo.release_counter || 0) === 0) {
      return { allowed: false, reason: 'Zero size with zero stars and releases' };
    }
  }

  // 3. Obvious spam / malicious names
  if (options.excludeSpam) {
    const fullName = `${repo.owner?.login || ''}/${repo.name || ''}`;
    const desc = repo.description || '';

    for (const pattern of SPAM_NAME_PATTERNS) {
      if (pattern.test(fullName) || pattern.test(desc)) {
        return { allowed: false, reason: `Spam/Malicious pattern match: ${pattern}` };
      }
    }

    // Single character or garbage named repos with 0 stars
    if (repo.name.length < 2 && (repo.stars_count || 0) === 0) {
      return { allowed: false, reason: 'Trivial name with zero stars' };
    }
  }

  // 4. Minimum stars check if configured
  if (options.minStars && (repo.stars_count || 0) < options.minStars) {
    return { allowed: false, reason: `Stars below minimum threshold (${options.minStars})` };
  }

  return { allowed: true };
}
