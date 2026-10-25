import { TrendingUp } from 'lucide-react';
import { getRisingRepositories } from '../../lib/repositories';
import { RepositoryList } from '../../components/repository/RepositoryList';

export const metadata = {
  title: 'Rising Fast Repositories',
  description: 'Repositories exhibiting the fastest star growth velocity and historical metric increases in the Gitea ecosystem.',
};

export default function RisingPage() {
  const rising = getRisingRepositories();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-dark-border pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-mono text-emerald-300 mb-2">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          <span>VELOCITY & ADOPTION</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Rising Fast
        </h1>
        <p className="mt-1.5 text-sm text-slate-400 max-w-xl">
          Projects gaining rapid traction and breakout engagement. Metrics reflect actual historical star deltas recorded over periodic snapshots.
        </p>
      </div>

      {/* Feed */}
      <RepositoryList
        repositories={rising}
        showRank={true}
        showTrendReason={true}
        emptyTitle="No rising repositories recorded yet"
        emptyMessage="As the crawler records consecutive snapshots over 24h and 7d intervals, delta growth trajectories appear here automatically."
      />
    </div>
  );
}
