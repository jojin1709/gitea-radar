import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  GitFork,
  Eye,
  AlertCircle,
  ExternalLink,
  Tag,
  ArrowLeft,
  Terminal,
  Activity,
  Layers,
} from 'lucide-react';
import { getRepository, getAllRepositories } from '../../../../lib/repositories';
import { SnapshotManager } from '../../../../crawler/snapshots/snapshot-manager';
import { StarHistoryChart } from '../../../../components/charts/StarHistoryChart';
import { GrowthBadge } from '../../../../components/repository/GrowthBadge';
import { TrendReasonBadge } from '../../../../components/repository/TrendReasonBadge';
import { formatDate, formatRelativeTime, formatBytes } from '../../../../lib/utils';
import { CloneSnippet } from './CloneSnippet';

interface RepositoryPageProps {
  params: Promise<{ owner: string; name: string }>;
}

const INVALID_FILENAME_CHARS = /[/\\:*?"<>|]/;

export async function generateStaticParams() {
  const allRepos = getAllRepositories();
  return allRepos
    .filter((r) => !INVALID_FILENAME_CHARS.test(r.owner.username) && !INVALID_FILENAME_CHARS.test(r.name))
    .map((r) => ({
      owner: r.owner.username,
      name: r.name,
    }));
}

export async function generateMetadata({ params }: RepositoryPageProps) {
  const { owner, name } = await params;
  const repo = getRepository(owner, name);
  if (!repo) {
    return { title: 'Repository Not Found' };
  }

  return {
    title: `${repo.fullName} — Gitea Radar`,
    description: repo.description || `Explore ${repo.fullName} on Gitea Radar. Stars: ${repo.stars}, Forks: ${repo.forks}.`,
    openGraph: {
      title: `${repo.fullName} | Gitea Radar`,
      description: repo.description || `Explore ${repo.fullName} on Gitea Radar.`,
    },
  };
}

export default async function RepositoryDetailPage({ params }: RepositoryPageProps) {
  const { owner, name } = await params;
  const repo = getRepository(owner, name);

  if (!repo) {
    notFound();
  }

  // Load historical snapshot chart points
  const snapshotManager = new SnapshotManager();
  const allSnapshots = snapshotManager.loadAllSnapshots();

  const chartData = allSnapshots
    .filter((s) => s.repositories && s.repositories[repo.id])
    .map((s) => {
      const metric = s.repositories[repo.id];
      const d = new Date(s.timestamp);
      return {
        timestamp: s.timestamp,
        stars: metric.stars,
        forks: metric.forks,
        label: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    });

  // If only 1 snapshot point exists, create a baseline point to draw a meaningful trendline
  if (chartData.length === 1) {
    const point = chartData[0];
    const prevTime = new Date(new Date(point.timestamp).getTime() - 24 * 60 * 60 * 1000);
    const baselineStars = repo.starGrowth24h ? Math.max(0, point.stars - repo.starGrowth24h) : point.stars;
    const baselineForks = repo.forkGrowth24h ? Math.max(0, point.forks - repo.forkGrowth24h) : point.forks;

    chartData.unshift({
      timestamp: prevTime.toISOString(),
      stars: baselineStars,
      forks: baselineForks,
      label: '24h ago',
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-radar-300 transition-colors font-mono"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Discovery</span>
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="rounded-2xl border border-dark-border bg-dark-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-dark-border bg-dark-bg shrink-0">
              <Image
                src={repo.owner.avatarUrl}
                alt={`${repo.owner.username}'s avatar`}
                width={64}
                height={64}
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <a
                  href={`https://gitea.com/${repo.owner.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-radar-300"
                >
                  {repo.owner.username}
                </a>
                <span>/</span>
                {repo.archived && (
                  <span className="rounded bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 text-[10px] text-amber-300">
                    Archived
                  </span>
                )}
                {repo.fork && (
                  <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] text-slate-300">
                    Fork
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight break-all">
                {repo.name}
              </h1>
            </div>
          </div>

          {/* View on Gitea CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-radar-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-radar-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <span>View on Gitea</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Description */}
        <p className="text-base text-slate-200 leading-relaxed max-w-4xl">
          {repo.description || <span className="italic text-slate-400">No description provided for this repository.</span>}
        </p>

        {/* Topics & Categories */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-dark-border/80">
          {repo.categories.map((cat) => (
            <Link
              key={cat}
              href={`/categories/${cat}`}
              className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/30 px-2.5 py-1 text-xs font-mono text-purple-300 hover:border-purple-400 transition-colors"
            >
              <Layers className="h-3 w-3" />
              {cat}
            </Link>
          ))}
          {repo.topics.map((topic) => (
            <Link
              key={topic}
              href={`/topics/${encodeURIComponent(topic)}`}
              className="rounded-lg border border-dark-border bg-dark-bg px-2.5 py-1 text-xs font-mono text-slate-400 hover:border-radar-500/40 hover:text-radar-300 transition-colors"
            >
              #{topic}
            </Link>
          ))}
        </div>

        {/* Metric Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-dark-border">
          <div className="rounded-xl border border-dark-border bg-dark-bg p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Star className="h-3.5 w-3.5 text-amber-400" />
              <span>Stars</span>
            </div>
            <div className="text-xl font-bold text-white font-mono flex items-baseline gap-2">
              <span>{repo.stars.toLocaleString()}</span>
              <GrowthBadge starGrowth={repo.starGrowth24h} percentage={repo.growthPercentage24h} size="sm" />
            </div>
          </div>

          <div className="rounded-xl border border-dark-border bg-dark-bg p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <GitFork className="h-3.5 w-3.5 text-slate-400" />
              <span>Forks</span>
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {repo.forks.toLocaleString()}
            </div>
          </div>

          <div className="rounded-xl border border-dark-border bg-dark-bg p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Eye className="h-3.5 w-3.5 text-slate-400" />
              <span>Watchers</span>
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {(repo.watchers || 0).toLocaleString()}
            </div>
          </div>

          <div className="rounded-xl border border-dark-border bg-dark-bg p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <AlertCircle className="h-3.5 w-3.5 text-slate-400" />
              <span>Open Issues</span>
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {(repo.openIssues || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Historical Chart & Metadata Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): History Chart & Clone */}
        <div className="lg:col-span-2 space-y-8">
          {/* Star History Chart */}
          <StarHistoryChart data={chartData} repoName={repo.fullName} />

          {/* Quick Clone Snippet */}
          <div className="rounded-xl border border-dark-border bg-dark-card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Terminal className="h-4 w-4 text-radar-400" />
                Clone Repository
              </h3>
              <span className="text-xs text-slate-400 font-mono">Default: {repo.defaultBranch}</span>
            </div>
            <CloneSnippet
              httpsUrl={repo.cloneUrl || repo.url}
              sshUrl={repo.sshUrl}
            />
          </div>

          {/* Latest Release Card */}
          {repo.latestRelease ? (
            <div className="rounded-xl border border-dark-border bg-dark-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">Latest Release</h3>
                  <span className="rounded bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 text-xs font-mono text-emerald-300">
                    {repo.latestRelease.tag}
                  </span>
                </div>
                {repo.latestRelease.publishedAt && (
                  <span className="text-xs text-slate-400 font-mono">
                    Published {formatDate(repo.latestRelease.publishedAt)}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-300">
                {repo.latestRelease.name || repo.latestRelease.tag}
              </p>
              {repo.latestRelease.url && (
                <a
                  href={repo.latestRelease.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-radar-400 hover:text-radar-300 font-medium"
                >
                  View release notes on Gitea &rarr;
                </a>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dark-border bg-dark-card p-6 text-xs text-slate-400 font-mono">
              No packaged releases published yet for this repository.
            </div>
          )}
        </div>

        {/* Right Column: Repository Metadata & Radar Intelligence */}
        <div className="space-y-6">
          {/* Radar Intelligence Card */}
          <div className="rounded-xl border border-dark-border bg-dark-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-radar-400" />
              Radar Intelligence
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between border-b border-dark-border pb-2">
                <span className="text-slate-400">Trend Score:</span>
                <span className="text-radar-300 font-bold">{repo.trendScore?.toFixed(1) || 'N/A'} pts</span>
              </div>
              <div className="flex justify-between border-b border-dark-border pb-2">
                <span className="text-slate-400">Activity Score:</span>
                <span className="text-emerald-400 font-bold">{repo.activityScore || 0}/100</span>
              </div>
              <div className="flex justify-between border-b border-dark-border pb-2">
                <span className="text-slate-400">Freshness:</span>
                <span className="text-slate-200">{repo.freshnessScore || 0}/100</span>
              </div>
              {repo.trendReason && (
                <div className="pt-1">
                  <span className="text-slate-400 block mb-1">Ranking Rationale:</span>
                  <TrendReasonBadge reason={repo.trendReason} />
                </div>
              )}
            </div>
          </div>

          {/* Repository Facts */}
          <div className="rounded-xl border border-dark-border bg-dark-card p-6 space-y-3 text-xs font-mono">
            <h3 className="text-sm font-semibold text-white font-sans">Repository Facts</h3>

            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Language:</span>
                <span className="text-white font-medium">{repo.language || 'Unspecified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">License:</span>
                <span className="text-white">{repo.license || 'Not declared'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Size:</span>
                <span className="text-white">{formatBytes(repo.size)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Created:</span>
                <span className="text-slate-300">{formatDate(repo.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Active:</span>
                <span className="text-slate-300">{formatRelativeTime(repo.updatedAt)}</span>
              </div>
              {repo.website && (
                <div className="pt-2 border-t border-dark-border">
                  <span className="text-slate-400 block mb-1">Homepage:</span>
                  <a
                    href={repo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-radar-400 hover:text-radar-300 truncate block"
                  >
                    {repo.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
