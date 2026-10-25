'use client';

import { useState, useMemo } from 'react';
import { Flame, Filter } from 'lucide-react';
import { getTrendingRepositories, getLanguages, getCategories } from '../../lib/repositories';
import { RepositoryList } from '../../components/repository/RepositoryList';

export default function TrendingPage() {
  const allTrending = useMemo(() => getTrendingRepositories(), []);
  const languages = useMemo(() => getLanguages(), []);
  const categories = useMemo(() => getCategories(), []);

  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [minStars, setMinStars] = useState<number>(0);

  const filteredRepos = useMemo(() => {
    const list = allTrending.filter((repo) => {
      if (selectedLanguage && repo.language?.toLowerCase() !== selectedLanguage.toLowerCase()) {
        return false;
      }
      if (selectedCategory && (!repo.categories || !repo.categories.includes(selectedCategory))) {
        return false;
      }
      if (minStars > 0 && repo.stars < minStars) {
        return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (timeframe === 'today') {
        const growthA = a.starGrowth24h ?? 0;
        const growthB = b.starGrowth24h ?? 0;
        if (growthB !== growthA) return growthB - growthA;
        return (b.trendScore || 0) - (a.trendScore || 0);
      } else if (timeframe === 'week') {
        const growth7dA = a.starGrowth7d ?? ((a.starGrowth24h || 0) * 3);
        const growth7dB = b.starGrowth7d ?? ((b.starGrowth24h || 0) * 3);
        if (growth7dB !== growth7dA) return growth7dB - growth7dA;
        return (b.activityScore || 0) - (a.activityScore || 0);
      } else {
        // Month: sustained activity + freshness + popularity
        const scoreA = (a.activityScore || 0) * 0.5 + (a.freshnessScore || 0) * 0.3 + Math.log10(a.stars + 1) * 5;
        const scoreB = (b.activityScore || 0) * 0.5 + (b.freshnessScore || 0) * 0.3 + Math.log10(b.stars + 1) * 5;
        return scoreB - scoreA;
      }
    });
  }, [allTrending, timeframe, selectedLanguage, selectedCategory, minStars]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-dark-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-xs font-mono text-amber-300 mb-2">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>COMMUNITY MOMENTUM</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Trending Repositories
          </h1>
          <p className="mt-1.5 text-sm text-slate-400 max-w-xl">
            See what the open-source community is most excited about. Ranked by star growth velocity, recent commit activity, and emerging freshness.
          </p>
        </div>

        {/* Timeframe Tabs */}
        <div className="flex items-center rounded-xl border border-dark-border bg-dark-card p-1 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setTimeframe('today')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              timeframe === 'today'
                ? 'bg-dark-bg text-radar-300 font-semibold border border-dark-borderHover shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('week')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              timeframe === 'week'
                ? 'bg-dark-bg text-radar-300 font-semibold border border-dark-borderHover shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            This Week
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('month')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              timeframe === 'month'
                ? 'bg-dark-bg text-radar-300 font-semibold border border-dark-borderHover shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dark-border bg-dark-card/60 p-3.5 backdrop-blur-md">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono pr-2">
          <Filter className="h-3.5 w-3.5 text-radar-400" />
          <span>Filters:</span>
        </div>

        {/* Language Filter */}
        <select
          aria-label="Filter by Language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="rounded-lg border border-dark-border bg-dark-bg px-3 py-1.5 text-xs text-slate-200 focus:border-radar-500 focus:outline-none"
        >
          <option value="">All Languages</option>
          {languages.map((l) => (
            <option key={l.name} value={l.name}>
              {l.name} ({l.count})
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          aria-label="Filter by Category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-dark-border bg-dark-bg px-3 py-1.5 text-xs text-slate-200 focus:border-radar-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.count})
            </option>
          ))}
        </select>

        {/* Min Stars Filter */}
        <select
          aria-label="Filter by Minimum Stars"
          value={minStars}
          onChange={(e) => setMinStars(Number(e.target.value))}
          className="rounded-lg border border-dark-border bg-dark-bg px-3 py-1.5 text-xs text-slate-200 focus:border-radar-500 focus:outline-none"
        >
          <option value={0}>Any Stars</option>
          <option value={10}>&gt; 10 Stars</option>
          <option value={50}>&gt; 50 Stars</option>
          <option value={100}>&gt; 100 Stars</option>
        </select>

        {/* Reset */}
        {(selectedLanguage || selectedCategory || minStars > 0) && (
          <button
            type="button"
            onClick={() => {
              setSelectedLanguage('');
              setSelectedCategory('');
              setMinStars(0);
            }}
            className="text-xs text-radar-400 hover:text-radar-300 font-mono ml-auto"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Repositories Feed */}
      <RepositoryList
        repositories={filteredRepos}
        showRank={true}
        showTrendReason={true}
        emptyTitle="No trending repositories match this criteria"
        emptyMessage="Try clearing your language or category filter to discover trending repositories across other domains."
      />
    </div>
  );
}
