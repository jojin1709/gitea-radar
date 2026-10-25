'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Flame, TrendingUp, Sparkles, Star, ArrowRight } from 'lucide-react';
import { Repository } from '../../types/repository';
import { RepositoryCard } from '../repository/RepositoryCard';

interface HomeFeedSwitcherProps {
  trending: Repository[];
  rising: Repository[];
  newest: Repository[];
  popular: Repository[];
}

type TabKey = 'trending' | 'rising' | 'newest' | 'popular';

const TABS: { id: TabKey; label: string; icon: typeof Flame; count: number; href: string; description: string }[] = [
  {
    id: 'trending',
    label: 'Trending',
    icon: Flame,
    count: 12,
    href: '/trending',
    description: 'Ranked by 24h momentum, recent commits, and active community signals',
  },
  {
    id: 'rising',
    label: 'Rising Velocity',
    icon: TrendingUp,
    count: 12,
    href: '/rising',
    description: 'Highest star growth acceleration and percentage gain in the last 24h',
  },
  {
    id: 'newest',
    label: 'Recently Discovered',
    icon: Sparkles,
    count: 12,
    href: '/newest',
    description: 'Freshly launched open-source projects discovered by our hourly crawler',
  },
  {
    id: 'popular',
    label: 'Most Starred',
    icon: Star,
    count: 12,
    href: '/popular',
    description: 'All-time community favorites and foundational developer tools',
  },
];

export function HomeFeedSwitcher({
  trending,
  rising,
  newest,
  popular,
}: HomeFeedSwitcherProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('trending');

  const currentTab = TABS.find((t) => t.id === activeTab)!;

  const datasetMap: Record<TabKey, Repository[]> = {
    trending,
    rising,
    newest,
    popular,
  };

  const currentRepos = datasetMap[activeTab] || trending;

  return (
    <div className="space-y-6">
      {/* Control Bar: Tabs + Description + View All Link */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-border pb-4">
        {/* Navigation Segmented Tabs */}
        <div
          role="tablist"
          aria-label="Repository discovery views"
          className="inline-flex p-1 rounded-xl bg-dark-card border border-dark-border"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'bg-dark-bg text-white shadow-sm border border-dark-borderHover text-radar-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    isActive
                      ? tab.id === 'trending'
                        ? 'text-amber-400'
                        : tab.id === 'rising'
                        ? 'text-emerald-400'
                        : tab.id === 'popular'
                        ? 'text-amber-300'
                        : 'text-radar-400'
                      : 'text-slate-400'
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Full Feed Link */}
        <Link
          href={currentTab.href}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-radar-400 hover:text-radar-300 group self-start md:self-auto"
        >
          <span>Explore all {currentTab.label.toLowerCase()} repos</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* View Subtitle */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <p>{currentTab.description}</p>
        <span className="font-mono text-[11px] text-slate-400">
          Showing top {currentRepos.length} results
        </span>
      </div>

      {/* Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentRepos.map((repo, idx) => (
          <RepositoryCard
            key={`${activeTab}-${repo.fullName}`}
            repository={repo}
            rank={activeTab === 'trending' || activeTab === 'popular' ? idx + 1 : undefined}
            showTrendReason={activeTab === 'trending' || activeTab === 'rising'}
          />
        ))}
      </div>
    </div>
  );
}
