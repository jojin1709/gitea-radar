'use client';

import { useState } from 'react';
import { Repository } from '../../types/repository';
import { RepositoryCard } from './RepositoryCard';
import { SearchX, ChevronDown } from 'lucide-react';

interface RepositoryListProps {
  repositories: Repository[];
  showRank?: boolean;
  showTrendReason?: boolean;
  initialCount?: number;
  emptyTitle?: string;
  emptyMessage?: string;
}

export function RepositoryList({
  repositories,
  showRank = false,
  showTrendReason = false,
  initialCount = 24,
  emptyTitle = 'No repositories found',
  emptyMessage = 'Try adjusting your filters or search keywords to discover more projects.',
}: RepositoryListProps) {
  const [displayCount, setDisplayCount] = useState(initialCount);

  if (!repositories || repositories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dark-border border-dashed bg-dark-card/40 p-12 text-center my-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dark-bg text-radar-400 border border-dark-border mb-4">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-white">{emptyTitle}</h3>
        <p className="mt-1.5 text-sm text-slate-400 max-w-sm">{emptyMessage}</p>
      </div>
    );
  }

  const visibleRepos = repositories.slice(0, displayCount);
  const hasMore = displayCount < repositories.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleRepos.map((repo, idx) => (
          <RepositoryCard
            key={`${repo.id}-${repo.fullName}`}
            repository={repo}
            rank={showRank ? idx + 1 : undefined}
            showTrendReason={showTrendReason}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={() => setDisplayCount((prev) => prev + 24)}
            className="flex items-center gap-2 rounded-lg border border-dark-border bg-dark-card px-6 py-2.5 text-sm font-medium text-slate-200 hover:border-radar-500/50 hover:bg-dark-cardHover hover:text-white transition-all shadow-sm"
          >
            <span>Load More Repositories ({repositories.length - displayCount} remaining)</span>
            <ChevronDown className="h-4 w-4 text-radar-400" />
          </button>
        </div>
      )}
    </div>
  );
}
