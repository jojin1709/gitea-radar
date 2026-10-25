import fs from 'fs';
import path from 'path';
import { Repository, CategorySummary, LanguageSummary, TopicSummary, PlatformStats } from '../types/repository';

export interface ValidationReport {
  valid: boolean;
  totalRepos: number;
  errors: string[];
  warnings: string[];
}

export function validateData(dataDir?: string): ValidationReport {
  const dir = dataDir || path.join(process.cwd(), 'data');
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredFiles = [
    'repositories.json',
    'trending.json',
    'newest.json',
    'rising.json',
    'popular.json',
    'categories.json',
    'languages.json',
    'topics.json',
    'stats.json',
  ];

  for (const file of requiredFiles) {
    const fullPath = path.join(dir, file);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Missing required dataset file: ${file}`);
      continue;
    }

    try {
      const raw = fs.readFileSync(fullPath, 'utf-8');
      JSON.parse(raw);
    } catch (err) {
      errors.push(`Invalid JSON syntax in file: ${file} - ${(err as Error)?.message}`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, totalRepos: 0, errors, warnings };
  }

  // Deep validation of repositories.json
  const reposPath = path.join(dir, 'repositories.json');
  const repos: Repository[] = JSON.parse(fs.readFileSync(reposPath, 'utf-8'));

  if (!Array.isArray(repos) || repos.length === 0) {
    errors.push('repositories.json is empty or not an array');
    return { valid: false, totalRepos: 0, errors, warnings };
  }

  const seenIds = new Set<number>();
  const seenNames = new Set<string>();

  for (let i = 0; i < repos.length; i++) {
    const r = repos[i];
    const prefix = `Repo #${i} (${r.fullName || 'unknown'}):`;

    // ID check
    if (typeof r.id !== 'number' || isNaN(r.id)) {
      errors.push(`${prefix} invalid ID: ${r.id}`);
    } else if (seenIds.has(r.id)) {
      errors.push(`${prefix} duplicate ID detected: ${r.id}`);
    } else {
      seenIds.add(r.id);
    }

    // Name and fullName
    if (!r.name || typeof r.name !== 'string') {
      errors.push(`${prefix} missing or invalid name`);
    }
    if (!r.fullName || typeof r.fullName !== 'string') {
      errors.push(`${prefix} missing or invalid fullName`);
    } else if (seenNames.has(r.fullName.toLowerCase())) {
      errors.push(`${prefix} duplicate fullName detected: ${r.fullName}`);
    } else {
      seenNames.add(r.fullName.toLowerCase());
    }

    // Owner
    if (!r.owner || !r.owner.username) {
      errors.push(`${prefix} missing owner.username`);
    }

    // URL validation
    if (!r.url || !r.url.startsWith('http')) {
      errors.push(`${prefix} invalid url: ${r.url}`);
    }

    // Numeric checks
    if (typeof r.stars !== 'number' || r.stars < 0 || isNaN(r.stars)) {
      errors.push(`${prefix} invalid stars count: ${r.stars}`);
    }
    if (typeof r.forks !== 'number' || r.forks < 0 || isNaN(r.forks)) {
      errors.push(`${prefix} invalid forks count: ${r.forks}`);
    }

    // Timestamps
    if (isNaN(new Date(r.createdAt).getTime())) {
      errors.push(`${prefix} invalid createdAt date: ${r.createdAt}`);
    }
    if (isNaN(new Date(r.updatedAt).getTime())) {
      errors.push(`${prefix} invalid updatedAt date: ${r.updatedAt}`);
    }

    // Categories
    if (!Array.isArray(r.categories)) {
      errors.push(`${prefix} categories must be an array`);
    }
  }

  // Validate stats.json
  const statsPath = path.join(dir, 'stats.json');
  const stats: PlatformStats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));
  if (stats.totalRepositories !== repos.length) {
    warnings.push(`stats.totalRepositories (${stats.totalRepositories}) does not match repositories.json length (${repos.length})`);
  }

  return {
    valid: errors.length === 0,
    totalRepos: repos.length,
    errors,
    warnings,
  };
}

function main() {
  console.log('[INFO] Validating production data integrity in data/...');
  const report = validateData();

  if (report.warnings.length > 0) {
    for (const w of report.warnings) {
      console.warn(`[WARN] ${w}`);
    }
  }

  if (!report.valid) {
    console.error(`[ERROR] Data validation failed with ${report.errors.length} errors:`);
    for (const err of report.errors.slice(0, 20)) {
      console.error(` - ${err}`);
    }
    if (report.errors.length > 20) {
      console.error(` ... and ${report.errors.length - 20} more errors.`);
    }
    process.exit(1);
  }

  console.log(`[SUCCESS] Data validation passed. Verified ${report.totalRepos} repositories across all datasets.`);
  process.exit(0);
}

if (require.main === module) {
  main();
}
