import fs from 'fs';
import path from 'path';
import { Repository, HistoricalSnapshot, RepositorySnapshotMetric } from '../../types/repository';

export class SnapshotManager {
  private snapshotsDir: string;

  constructor(snapshotsDir?: string) {
    this.snapshotsDir = snapshotsDir || path.join(process.cwd(), 'data', 'snapshots');
    if (!fs.existsSync(this.snapshotsDir)) {
      fs.mkdirSync(this.snapshotsDir, { recursive: true });
    }
  }

  /**
   * Formats a date into a clean hourly snapshot filename: YYYY-MM-DDTHH.json
   */
  public getSnapshotFilename(date: Date = new Date()): string {
    const iso = date.toISOString(); // e.g. 2026-09-03T21:26:00.000Z
    const hourly = iso.substring(0, 13).replace(':', '-'); // e.g. 2026-09-03T21
    return `${hourly}.json`;
  }

  /**
   * Saves a snapshot of current repository metrics.
   */
  public saveSnapshot(repos: Repository[], date: Date = new Date()): string {
    const filename = this.getSnapshotFilename(date);
    const filepath = path.join(this.snapshotsDir, filename);

    const snapshotMap: Record<number, RepositorySnapshotMetric> = {};
    for (const repo of repos) {
      snapshotMap[repo.id] = {
        id: repo.id,
        fullName: repo.fullName,
        stars: repo.stars,
        forks: repo.forks,
        watchers: repo.watchers || 0,
        openIssues: repo.openIssues || 0,
        updatedAt: repo.updatedAt,
        timestamp: date.toISOString(),
      };
    }

    const snapshot: HistoricalSnapshot = {
      timestamp: date.toISOString(),
      totalTracked: repos.length,
      repositories: snapshotMap,
    };

    fs.writeFileSync(filepath, JSON.stringify(snapshot, null, 2), 'utf-8');
    this.pruneOldSnapshots(60); // Retain last 60 snapshots (~2 months of hourly/daily)
    return filepath;
  }

  /**
   * Loads all available snapshots, ordered from oldest to newest.
   */
  public loadAllSnapshots(): HistoricalSnapshot[] {
    if (!fs.existsSync(this.snapshotsDir)) return [];

    const files = fs.readdirSync(this.snapshotsDir)
      .filter(f => f.endsWith('.json'))
      .sort();

    const snapshots: HistoricalSnapshot[] = [];
    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(this.snapshotsDir, file), 'utf-8');
        const parsed = JSON.parse(raw) as HistoricalSnapshot;
        if (parsed && parsed.repositories) {
          snapshots.push(parsed);
        }
      } catch (err) {
        console.warn(`[SnapshotManager] Skipping corrupt snapshot file ${file}:`, err);
      }
    }

    return snapshots;
  }

  /**
   * Finds the snapshot closest to a target timestamp (e.g. 24h ago).
   * If no snapshot is within maxDriftMs (default: 36 hours for a 24h target), returns null.
   */
  public findClosestSnapshot(
    snapshots: HistoricalSnapshot[],
    targetTime: number,
    maxDriftMs: number = 36 * 60 * 60 * 1000
  ): HistoricalSnapshot | null {
    if (snapshots.length === 0) return null;

    let bestSnapshot: HistoricalSnapshot | null = null;
    let smallestDiff = Infinity;

    for (const s of snapshots) {
      const snapTime = new Date(s.timestamp).getTime();
      const diff = Math.abs(snapTime - targetTime);

      if (diff < smallestDiff && diff <= maxDriftMs) {
        smallestDiff = diff;
        bestSnapshot = s;
      }
    }

    return bestSnapshot;
  }

  /**
   * Cleans up older snapshots past maxToKeep.
   */
  private pruneOldSnapshots(maxToKeep: number): void {
    try {
      const files = fs.readdirSync(this.snapshotsDir)
        .filter(f => f.endsWith('.json'))
        .sort();

      if (files.length > maxToKeep) {
        const toDelete = files.slice(0, files.length - maxToKeep);
        for (const file of toDelete) {
          fs.unlinkSync(path.join(this.snapshotsDir, file));
        }
      }
    } catch (err) {
      console.warn('[SnapshotManager] Error pruning snapshots:', err);
    }
  }
}
