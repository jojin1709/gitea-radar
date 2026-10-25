'use client';

import { useState, useMemo } from 'react';
import { Star, GitFork, Eye } from 'lucide-react';
import { getPopularRepositories } from '../../lib/repositories';
import { RepositoryList } from '../../components/repository/RepositoryList';

export default function PopularPage() {
  const allPopular = useMemo(() => getPopularRepositories(), []);
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'watchers'>('stars');

  const sortedRepos = useMemo(() => {
    return [...allPopular].sort((a, b) => {
      if (sortBy === 'stars') return b.stars - a.stars;
      if (sortBy === 'forks') return b.forks - a.forks;
      if (sortBy === 'watchers') return (b.watchers || 0) - (a.watchers || 0);
      return 0;
    });
  }, [allPopular, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-dark-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-xs font-mono text-amber-300 mb-2">
            <Star className="h-3.5 w-3.5 text-amber-400" />
            <span>ALL-TIME PILLARS</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Most Popular
          </h1>
          <p className="mt-1.5 text-sm text-slate-400 max-w-xl">
            The most starred, cloned, and forked software repositories across the entire Gitea ecosystem.
          </p>
        </div>

        {/* Sort Switcher */}
        <div className="flex items-center rounded-lg border border-dark-border bg-dark-card p-1 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setSortBy('stars')}
            className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
              sortBy === 'stars'
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Star className="h-3.5 w-3.5" />
            Most Starred
          </button>
          <button
            type="button"
            onClick={() => setSortBy('forks')}
            className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
              sortBy === 'forks'
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitFork className="h-3.5 w-3.5" />
            Most Forked
          </button>
          <button
            type="button"
            onClick={() => setSortBy('watchers')}
            className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
              sortBy === 'watchers'
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Most Watched
          </button>
        </div>
      </div>

      {/* Feed */}
      <RepositoryList
        repositories={sortedRepos}
        showRank={true}
        emptyTitle="No popular repositories found"
        emptyMessage="Repositories discovered on Gitea will be ranked here by star and fork volume."
      />
    </div>
  );
}
