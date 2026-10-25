'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { getAllRepositories, getLanguages, getCategories, getTopics } from '../../lib/repositories';
import { searchRepositories } from '../../lib/search';
import { RepositoryList } from '../../components/repository/RepositoryList';
import { Repository } from '../../types/repository';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const allRepos = useMemo(() => getAllRepositories(), []);
  const languages = useMemo(() => getLanguages(), []);
  const categories = useMemo(() => getCategories(), []);
  const topics = useMemo(() => getTopics(), []);

  // Read initial values from URL params
  const initialQ = searchParams.get('q') || '';
  const initialLang = searchParams.get('language') || '';
  const initialCat = searchParams.get('category') || '';
  const initialTopic = searchParams.get('topic') || '';
  const initialMinStars = Number(searchParams.get('minStars')) || 0;
  const initialSort = (searchParams.get('sort') as any) || 'relevance';

  const [query, setQuery] = useState(initialQ);
  const [language, setLanguage] = useState(initialLang);
  const [category, setCategory] = useState(initialCat);
  const [topic, setTopic] = useState(initialTopic);
  const [minStars, setMinStars] = useState(initialMinStars);
  const [sortBy, setSortBy] = useState(initialSort);

  const [liveRepos, setLiveRepos] = useState<Repository[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync state when URL params change from navigation
  const qParam = searchParams.get('q') ?? '';
  const langParam = searchParams.get('language') ?? '';
  const catParam = searchParams.get('category') ?? '';
  const topicParam = searchParams.get('topic') ?? '';

  useEffect(() => {
    if (qParam !== query) setQuery(qParam);
    if (langParam !== language) setLanguage(langParam);
    if (catParam !== category) setCategory(catParam);
    if (topicParam !== topic) setTopic(topicParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qParam, langParam, catParam, topicParam]);

  // Live Gitea REST API sync for any query
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setLiveRepos([]);
      setIsSyncing(false);
      return;
    }

    const controller = new AbortController();
    setIsSyncing(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.repos)) {
            setLiveRepos(data.repos);
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Live search sync failed:', err);
        }
      } finally {
        setIsSyncing(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Sync state back to URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (language) params.set('language', language);
    if (category) params.set('category', category);
    if (topic) params.set('topic', topic);
    if (minStars > 0) params.set('minStars', String(minStars));
    if (sortBy && sortBy !== 'relevance') params.set('sort', sortBy);

    const queryString = params.toString();
    const target = queryString ? `/search?${queryString}` : '/search';
    router.replace(target, { scroll: false });
  }, [query, language, category, topic, minStars, sortBy, router]);

  // Combine pre-indexed repos with live Gitea synced repos
  const combinedRepos = useMemo(() => {
    const map = new Map<string, Repository>();
    for (const r of allRepos) {
      map.set(r.fullName.toLowerCase(), r);
    }
    for (const r of liveRepos) {
      if (!map.has(r.fullName.toLowerCase())) {
        map.set(r.fullName.toLowerCase(), r);
      }
    }
    return Array.from(map.values());
  }, [allRepos, liveRepos]);

  // Execute search filter
  const results = useMemo(() => {
    return searchRepositories(combinedRepos, {
      query,
      language: language || undefined,
      category: category || undefined,
      topic: topic || undefined,
      minStars,
      sortBy,
    });
  }, [combinedRepos, query, language, category, topic, minStars, sortBy]);

  const hasActiveFilters = Boolean(language || category || topic || minStars > 0);

  const clearAll = () => {
    setQuery('');
    setLanguage('');
    setCategory('');
    setTopic('');
    setMinStars(0);
    setSortBy('relevance');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-dark-border pb-6 space-y-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Search Discovery Catalog
        </h1>
        <p className="text-sm text-slate-400 max-w-xl">
          Search across 300+ indexed repositories by keywords, full names, technology stacks, and categories.
        </p>

        {/* Big Search Input */}
        <div className="relative max-w-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by repository name, owner, description, or keyword..."
            autoFocus
            className="w-full rounded-xl border border-dark-border bg-dark-card px-4 py-3.5 pl-11 pr-10 text-sm text-white placeholder-slate-400 shadow-xl transition-all focus:border-radar-500 focus:outline-none focus:ring-2 focus:ring-radar-500/20"
          />
          <Search className="absolute left-3.5 top-4 h-4 w-4 text-radar-400" />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Popular / Security Quick Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-mono mr-1">Trending Tags:</span>
          {[
            { label: 'cyber', query: 'cyber' },
            { label: 'burp', query: 'burp' },
            { label: 'burpsuite', query: 'burpsuite' },
            { label: 'pentest', query: 'pentest' },
            { label: 'cve', query: 'cve' },
            { label: 'exploit', query: 'exploit' },
            { label: 'security', query: 'security' },
            { label: 'ai', query: 'ai' },
            { label: 'cli', query: 'cli' },
            { label: 'gitea', query: 'gitea' },
            { label: 'tools', query: 'tools' },
          ].map((tag) => {
            const isSelected = query.toLowerCase() === tag.query || topic.toLowerCase() === tag.query;
            return (
              <button
                key={tag.label}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setQuery('');
                  } else {
                    setQuery(tag.query);
                  }
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-mono transition-all border ${
                  isSelected
                    ? 'bg-radar-500 text-slate-950 font-bold border-radar-400 shadow-sm'
                    : tag.label === 'cyber' || tag.label === 'burp' || tag.label === 'pentest' || tag.label === 'exploit'
                    ? 'bg-rose-950/40 text-rose-300 border-rose-500/30 hover:border-rose-400'
                    : 'bg-dark-card text-slate-300 border-dark-border hover:border-dark-borderHover hover:text-white'
                }`}
              >
                #{tag.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dark-border bg-dark-card/70 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono pr-1">
            <SlidersHorizontal className="h-3.5 w-3.5 text-radar-400" />
            <span>Refine:</span>
          </div>

          {/* Language filter */}
          <select
            aria-label="Language filter"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-lg border border-dark-border bg-dark-bg px-3 py-1.5 text-xs text-slate-200 focus:border-radar-500 focus:outline-none"
          >
            <option value="">All Languages</option>
            {languages.map((l) => (
              <option key={l.name} value={l.name}>
                {l.name}
              </option>
            ))}
          </select>

          {/* Category filter */}
          <select
            aria-label="Category filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-dark-border bg-dark-bg px-3 py-1.5 text-xs text-slate-200 focus:border-radar-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Topic filter */}
          <select
            aria-label="Topic filter"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="rounded-lg border border-dark-border bg-dark-bg px-3 py-1.5 text-xs text-slate-200 focus:border-radar-500 focus:outline-none"
          >
            <option value="">All Topics</option>
            {topics.slice(0, 30).map((t) => (
              <option key={t.name} value={t.name}>
                #{t.name}
              </option>
            ))}
          </select>

          {/* Min Stars filter */}
          <select
            aria-label="Minimum stars filter"
            value={minStars}
            onChange={(e) => setMinStars(Number(e.target.value))}
            className="rounded-lg border border-dark-border bg-dark-bg px-3 py-1.5 text-xs text-slate-200 focus:border-radar-500 focus:outline-none"
          >
            <option value={0}>Any Stars</option>
            <option value={5}>&gt; 5 Stars</option>
            <option value={20}>&gt; 20 Stars</option>
            <option value={50}>&gt; 50 Stars</option>
            <option value={100}>&gt; 100 Stars</option>
          </select>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">Sort:</span>
            <select
              aria-label="Sort order"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-dark-border bg-dark-bg px-2.5 py-1.5 text-xs text-slate-200 focus:border-radar-500 focus:outline-none"
            >
              <option value="relevance">Relevance</option>
              <option value="stars">Most Stars</option>
              <option value="updated">Recently Updated</option>
              <option value="created">Recently Created</option>
              <option value="trend">Trend Score</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {isSyncing ? (
              <span className="flex items-center gap-1.5 text-xs font-mono text-radar-400 bg-radar-500/10 px-2 py-0.5 rounded border border-radar-500/20 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-radar-400"></span>
                Syncing Gitea...
              </span>
            ) : query.trim().length >= 2 ? (
              <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Gitea Synced
              </span>
            ) : null}
            <div className="text-xs font-mono text-radar-400 font-medium">
              {results.length} found
            </div>
          </div>

          {(query || hasActiveFilters) && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-slate-400 hover:text-white font-mono underline ml-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Feed */}
      <RepositoryList
        repositories={results}
        showRank={false}
        showTrendReason={true}
        emptyTitle="No repositories matched your search"
        emptyMessage="Try searching for broader keywords like 'cli', 'web', 'tools', or clear the active language and star filters."
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-400 font-mono text-sm">
          Loading Search Radar...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
