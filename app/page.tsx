import Link from 'next/link';
import {
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
  Star,
  Activity,
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
import { HomeFeedSwitcher } from '../components/home/HomeFeedSwitcher';
import { formatNumber } from '../lib/utils';

// Icon map for categories
const CATEGORY_ICONS: Record<string, any> = {
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
  const trending = getTrendingRepositories().slice(0, 12);
  const newest = getNewestRepositories().slice(0, 12);
  const rising = getRisingRepositories().slice(0, 12);
  const popular = getPopularRepositories().slice(0, 12);
  const categories = getCategories().slice(0, 8);
  const languages = getLanguages().slice(0, 10);
  const topics = getTopics().slice(0, 16);
  const stats = getPlatformStats();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Cockpit Hero Section */}
      <section className="relative pt-6 pb-2 text-center space-y-6">
        {/* Subtle Status Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-dark-border bg-dark-card/90 px-3.5 py-1 text-xs text-slate-300 backdrop-blur-md shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-[11px] text-slate-400">GITEA RADAR</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">Open-Source Ecosystem Intelligence</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Discover what developers are building on Gitea
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Real-time star velocity, commit recency, and emerging open-source software discovered and indexed across the public network.
          </p>
        </div>

        {/* Search Bar with Keyboard Shortcut */}
        <div className="max-w-xl mx-auto pt-1">
          <form action="/search" method="GET" className="relative group">
            <input
              type="text"
              name="q"
              placeholder="Search repositories, languages, topics, or authors..."
              className="w-full rounded-xl border border-dark-border bg-dark-card px-4 py-3 pl-11 pr-28 text-sm text-white placeholder-slate-400 backdrop-blur-md transition-colors focus:border-radar-400 focus:outline-none focus:ring-1 focus:ring-radar-400"
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-radar-400 transition-colors" />
            <button
              type="submit"
              className="absolute right-2 top-2 rounded-lg bg-radar-500 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-radar-400 transition-colors shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Quick Tag Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3">
            <span className="text-[11px] text-slate-400 font-mono mr-1">Hot:</span>
            {[
              { label: 'cyber', q: 'cyber', isSecurity: true },
              { label: 'burp', q: 'burp', isSecurity: true },
              { label: 'pentest', q: 'pentest', isSecurity: true },
              { label: 'ai', q: 'ai', isSecurity: false },
              { label: 'cli', q: 'cli', isSecurity: false },
              { label: 'gitea', q: 'gitea', isSecurity: false },
              { label: 'devops', q: 'devops', isSecurity: false },
            ].map((tag) => (
              <Link
                key={tag.label}
                href={`/search?q=${tag.q}`}
                className={`rounded-md px-2 py-0.5 text-xs font-mono transition-all border ${
                  tag.isSecurity
                    ? 'border-rose-500/20 bg-rose-950/20 text-rose-300 hover:border-rose-500/40'
                    : 'border-dark-border bg-dark-card text-slate-400 hover:border-dark-borderHover hover:text-slate-200'
                }`}
              >
                #{tag.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Live Ecosystem Metric Ribbon */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-6 sm:gap-10 font-mono text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-white font-semibold">{stats.totalRepositories}</span>
            <span className="text-slate-400">Repositories</span>
          </div>
          <div className="hidden sm:block text-slate-700">|</div>
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
            <span className="text-amber-300 font-semibold">{stats.totalStars.toLocaleString()}</span>
            <span className="text-slate-400">Stars</span>
          </div>
          <div className="hidden sm:block text-slate-700">|</div>
          <div className="flex items-center gap-1.5">
            <Code2 className="h-3.5 w-3.5 text-radar-400" />
            <span className="text-slate-200 font-semibold">{stats.languagesCount}</span>
            <span className="text-slate-400">Languages</span>
          </div>
          <div className="hidden sm:block text-slate-700">|</div>
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-slate-200 font-semibold">{stats.categoriesCount}</span>
            <span className="text-slate-400">Categories</span>
          </div>
        </div>
      </section>

      {/* Main Interactive Repository Cockpit */}
      <section>
        <HomeFeedSwitcher
          trending={trending}
          rising={rising}
          newest={newest}
          popular={popular}
        />
      </section>

      {/* Categories Radar Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-dark-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-950/20 text-purple-400">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Categories</h2>
              <p className="text-xs text-slate-400">
                Software indexed by domain and application scope
              </p>
            </div>
          </div>
          <Link
            href="/categories"
            className="flex items-center gap-1 text-xs font-medium text-radar-400 hover:text-radar-300 group"
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
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-bg text-slate-300 border border-dark-border group-hover:text-radar-300 transition-colors">
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

      {/* Languages & Topics Dual Deck */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Languages Card */}
        <div className="rounded-xl border border-dark-border bg-dark-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-dark-border pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-radar-400" />
              <h3 className="font-semibold text-white text-sm">Top Languages</h3>
            </div>
            <Link href="/languages" className="text-xs text-radar-400 hover:text-radar-300 font-medium">
              View all &rarr;
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {languages.map((lang) => (
              <Link
                key={lang.name}
                href={`/languages/${encodeURIComponent(lang.name)}`}
                className="flex items-center gap-2 rounded-lg border border-dark-border bg-dark-bg px-3 py-1.5 text-xs text-slate-300 hover:border-dark-borderHover hover:text-white transition-all group"
              >
                <span
                  className="h-2 w-2 rounded-full"
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
        <div className="rounded-xl border border-dark-border bg-dark-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-dark-border pb-3">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-400" />
              <h3 className="font-semibold text-white text-sm">Trending Topics</h3>
            </div>
            <Link href="/topics" className="text-xs text-radar-400 hover:text-radar-300 font-medium">
              View all &rarr;
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {topics.map((topic) => (
              <Link
                key={topic.name}
                href={`/topics/${encodeURIComponent(topic.name)}`}
                className="rounded-lg border border-dark-border bg-dark-bg px-2.5 py-1 text-xs font-mono text-slate-400 hover:border-dark-borderHover hover:text-slate-200 transition-all"
              >
                #{topic.name}
                <span className="ml-1 text-[10px] text-slate-400">
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
