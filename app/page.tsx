import Link from 'next/link';
import {
  Flame,
  Sparkles,
  TrendingUp,
  Star,
  Layers,
  Code2,
  Compass,
  ArrowRight,
  Search,
  ShieldCheck,
  Terminal,
  Cpu,
  Workflow,
  Server,
  Database,
  Globe,
  Smartphone,
  Home,
  Bot,
  Network,
  Gamepad2,
  GraduationCap,
  Folder,
} from 'lucide-react';
import {
  getTrendingRepositories,
  getNewestRepositories,
  getRisingRepositories,
  getPopularRepositories,
  getCategories,
  getLanguages,
  getTopics,
  getPlatformStats,
} from '../lib/repositories';
import { RepositoryCard } from '../components/repository/RepositoryCard';
import { formatNumber } from '../lib/utils';

// Icon map for categories
const CATEGORY_ICONS: Record<string, any> = {
  Sparkles,
  Cpu,
  Shield: ShieldCheck,
  Wrench: Terminal,
  Terminal,
  Workflow,
  Server,
  Database,
  Globe,
  Smartphone,
  Home,
  Bot,
  Network,
  Gamepad2,
  GraduationCap,
  Folder,
};

export default function HomePage() {
  const trending = getTrendingRepositories().slice(0, 6);
  const newest = getNewestRepositories().slice(0, 6);
  const rising = getRisingRepositories().slice(0, 6);
  const popular = getPopularRepositories().slice(0, 6);
  const categories = getCategories().slice(0, 8);
  const languages = getLanguages().slice(0, 10);
  const topics = getTopics().slice(0, 16);
  const stats = getPlatformStats();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-20">
      {/* Hero Section */}
      <section className="relative pt-8 pb-4 text-center space-y-6">
        {/* Beacon Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-radar-500/30 bg-radar-950/50 px-3.5 py-1 text-xs font-mono text-radar-300 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-radar-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-radar-500" />
          </span>
          <span>GITEA RADAR &bull; LIVE ECOSYSTEM SCANNER</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover what developers are{' '}
            <span className="bg-gradient-to-r from-radar-400 via-cyan-200 to-emerald-400 bg-clip-text text-transparent">
              building.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            New repositories. Rising projects. Open-source software worth watching from across the global Gitea network.
          </p>
        </div>

        {/* Big Search Bar */}
        <div className="max-w-xl mx-auto pt-2">
          <form action="/search" method="GET" className="relative group">
            <input
              type="text"
              name="q"
              placeholder="Search repositories by name, language, topic, or keyword..."
              className="w-full rounded-xl border border-dark-border bg-dark-card/90 px-4 py-3.5 pl-11 pr-28 text-sm text-white placeholder-slate-400 backdrop-blur-md shadow-2xl transition-all group-hover:border-dark-borderHover focus:border-radar-500 focus:outline-none focus:ring-2 focus:ring-radar-500/20"
            />
            <Search className="absolute left-3.5 top-4 h-4 w-4 text-radar-400" />
            <button
              type="submit"
              className="absolute right-2 top-2 rounded-lg bg-radar-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-radar-400 transition-colors shadow-sm"
            >
              Explore
            </button>
          </form>

          {/* Quick Tag Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            <span className="text-xs text-slate-400 font-mono">Popular:</span>
            {[
              { label: 'cyber', q: 'cyber', isSecurity: true },
              { label: 'burp', q: 'burp', isSecurity: true },
              { label: 'pentest', q: 'pentest', isSecurity: true },
              { label: 'cve', q: 'cve', isSecurity: true },
              { label: 'ai', q: 'ai', isSecurity: false },
              { label: 'cli', q: 'cli', isSecurity: false },
              { label: 'gitea', q: 'gitea', isSecurity: false },
            ].map((tag) => (
              <Link
                key={tag.label}
                href={`/search?q=${tag.q}`}
                className={`rounded-full px-2.5 py-0.5 text-xs font-mono transition-all border ${
                  tag.isSecurity
                    ? 'border-rose-500/30 bg-rose-950/30 text-rose-300 hover:border-rose-400'
                    : 'border-dark-border bg-dark-card text-slate-300 hover:border-radar-400 hover:text-white'
                }`}
              >
                #{tag.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-12 font-mono text-xs text-slate-400">
          <div>
            <span className="text-white font-bold text-sm mr-1.5">{stats.totalRepositories}</span>
            <span>Repositories Tracked</span>
          </div>
          <div className="hidden sm:block text-slate-600">&bull;</div>
          <div>
            <span className="text-amber-400 font-bold text-sm mr-1.5">{stats.totalStars.toLocaleString()}</span>
            <span>Total Stars</span>
          </div>
          <div className="hidden sm:block text-slate-600">&bull;</div>
          <div>
            <span className="text-radar-300 font-bold text-sm mr-1.5">{stats.languagesCount}</span>
            <span>Languages</span>
          </div>
          <div className="hidden sm:block text-slate-600">&bull;</div>
          <div>
            <span className="text-emerald-400 font-bold text-sm mr-1.5">{stats.categoriesCount}</span>
            <span>Categories</span>
          </div>
        </div>
      </section>

      {/* Section 1: Trending Now */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-dark-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-950/40 text-amber-400">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Trending Now</h2>
              <p className="text-xs text-slate-400">
                Ranked by 24h momentum, commit recency, and community activity
              </p>
            </div>
          </div>
          <Link
            href="/trending"
            className="flex items-center gap-1 text-xs font-semibold text-radar-400 hover:text-radar-300 group"
          >
            <span>View all trending</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trending.map((repo, index) => (
            <RepositoryCard
              key={repo.fullName}
              repository={repo}
              rank={index + 1}
              showTrendReason={true}
            />
          ))}
        </div>
      </section>

      {/* Section 2: Just Discovered (Newest) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-dark-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-radar-500/30 bg-radar-950/40 text-radar-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Just Discovered</h2>
              <p className="text-xs text-slate-400">
                Freshly created public repositories spotted by the crawler
              </p>
            </div>
          </div>
          <Link
            href="/newest"
            className="flex items-center gap-1 text-xs font-semibold text-radar-400 hover:text-radar-300 group"
          >
            <span>View all newest</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {newest.map((repo) => (
            <RepositoryCard key={repo.fullName} repository={repo} />
          ))}
        </div>
      </section>

      {/* Section 3: Rising Fast */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-dark-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-950/40 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Rising Fast</h2>
              <p className="text-xs text-slate-400">
                Repositories with the highest star velocity and percentage growth
              </p>
            </div>
          </div>
          <Link
            href="/rising"
            className="flex items-center gap-1 text-xs font-semibold text-radar-400 hover:text-radar-300 group"
          >
            <span>View all rising</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rising.map((repo) => (
            <RepositoryCard key={repo.fullName} repository={repo} showTrendReason={true} />
          ))}
        </div>
      </section>

      {/* Section 4: Most Starred */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-dark-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-950/40 text-amber-400">
              <Star className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Most Starred</h2>
              <p className="text-xs text-slate-400">
                Pillar software and beloved community projects in Gitea
              </p>
            </div>
          </div>
          <Link
            href="/popular"
            className="flex items-center gap-1 text-xs font-semibold text-radar-400 hover:text-radar-300 group"
          >
            <span>View all popular</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popular.map((repo, index) => (
            <RepositoryCard key={repo.fullName} repository={repo} rank={index + 1} />
          ))}
        </div>
      </section>

      {/* Section 5: Explore Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-dark-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-950/40 text-purple-400">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Explore Categories</h2>
              <p className="text-xs text-slate-400">
                Classified by topics, package manifests, and architectural scope
              </p>
            </div>
          </div>
          <Link
            href="/categories"
            className="flex items-center gap-1 text-xs font-semibold text-radar-400 hover:text-radar-300 group"
          >
            <span>All categories</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.iconName] || Folder;
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="group rounded-xl border border-dark-border bg-dark-card p-4 hover:border-dark-borderHover hover:bg-dark-cardHover transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-bg text-radar-400 border border-dark-border group-hover:border-radar-500/30 group-hover:text-radar-300 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-mono text-xs text-slate-400">
                      {cat.count} repos
                    </span>
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-radar-300 transition-colors text-sm">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-dark-border/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="h-3 w-3" />
                    {formatNumber(cat.totalStars)}
                  </span>
                  <span className="text-radar-400 group-hover:translate-x-0.5 transition-transform">
                    Explore &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Section 6: Popular Languages & Topics */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Languages Card */}
        <div className="rounded-2xl border border-dark-border bg-dark-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-dark-border pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-radar-400" />
              <h3 className="font-bold text-white text-base">Popular Languages</h3>
            </div>
            <Link href="/languages" className="text-xs text-radar-400 hover:text-radar-300 font-semibold">
              View all &rarr;
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {languages.map((lang) => (
              <Link
                key={lang.name}
                href={`/languages/${encodeURIComponent(lang.name)}`}
                className="flex items-center gap-2 rounded-lg border border-dark-border bg-dark-bg px-3 py-1.5 text-xs text-slate-300 hover:border-radar-500/40 hover:text-white transition-all group"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="font-medium">{lang.name}</span>
                <span className="font-mono text-slate-400 text-[10px] group-hover:text-radar-400">
                  {lang.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Topics Card */}
        <div className="rounded-2xl border border-dark-border bg-dark-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-dark-border pb-3">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Trending Topics</h3>
            </div>
            <Link href="/topics" className="text-xs text-radar-400 hover:text-radar-300 font-semibold">
              View all &rarr;
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {topics.map((topic) => (
              <Link
                key={topic.name}
                href={`/topics/${encodeURIComponent(topic.name)}`}
                className="rounded-lg border border-dark-border bg-dark-bg px-3 py-1.5 text-xs font-mono text-slate-400 hover:border-emerald-500/40 hover:text-emerald-300 transition-all"
              >
                #{topic.name}
                <span className="ml-1.5 text-[10px] text-slate-400">
                  {topic.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
