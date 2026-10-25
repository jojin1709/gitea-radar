import Link from 'next/link';
import { Radio, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { getPlatformStats } from '../../lib/repositories';

export function Footer() {
  const stats = getPlatformStats();

  return (
    <footer className="border-t border-dark-border bg-dark-bg/90 mt-20 text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-radar-500/40 bg-radar-950 text-radar-400">
                <Radio className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-white">
                Gitea <span className="text-radar-400">Radar</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Discover what developers are building. Real-time open-source project discovery across the Gitea ecosystem.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              Crawler powered by GitHub Actions
            </div>
          </div>

          {/* Col 2: Discovery Feeds */}
          <div className="space-y-2.5">
            <h3 className="font-semibold text-white tracking-wide uppercase text-[11px] font-mono">
              Discovery Feeds
            </h3>
            <ul className="space-y-1.5">
              <li><Link href="/trending" className="hover:text-radar-300 transition-colors">Trending Repositories</Link></li>
              <li><Link href="/newest" className="hover:text-radar-300 transition-colors">Just Discovered</Link></li>
              <li><Link href="/rising" className="hover:text-radar-300 transition-colors">Fastest Growing</Link></li>
              <li><Link href="/popular" className="hover:text-radar-300 transition-colors">Most Starred</Link></li>
              <li><Link href="/search" className="hover:text-radar-300 transition-colors">Advanced Search</Link></li>
              <li><a href="/feed.xml" target="_blank" rel="noopener noreferrer" className="hover:text-radar-300 transition-colors">RSS Feed (XML)</a></li>
            </ul>
          </div>

          {/* Col 3: Ecosystem */}
          <div className="space-y-2.5">
            <h3 className="font-semibold text-white tracking-wide uppercase text-[11px] font-mono">
              Ecosystem
            </h3>
            <ul className="space-y-1.5">
              <li><Link href="/categories" className="hover:text-radar-300 transition-colors">Categories</Link></li>
              <li><Link href="/languages" className="hover:text-radar-300 transition-colors">Languages</Link></li>
              <li><Link href="/topics" className="hover:text-radar-300 transition-colors">Topics</Link></li>
              <li>
                <a
                  href="https://gitea.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-radar-300 transition-colors"
                >
                  Gitea.com
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Engine Specs */}
          <div className="space-y-2.5">
            <h3 className="font-semibold text-white tracking-wide uppercase text-[11px] font-mono">
              Live Platform Engine
            </h3>
            <div className="rounded-lg border border-dark-border bg-dark-card p-3 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Tracked Repos:</span>
                <span className="text-radar-300 font-bold">{stats.totalRepositories}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Stars:</span>
                <span className="text-amber-400 font-bold">{stats.totalStars.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Languages:</span>
                <span className="text-slate-200">{stats.languagesCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Categories:</span>
                <span className="text-slate-200">{stats.categoriesCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-slate-400 text-xs">
            <span>&copy; {new Date().getFullYear()} Gitea Radar.</span>
            <span className="hidden sm:inline text-slate-600">&bull;</span>
            <span className="text-slate-300">
              Developed with pride by <strong className="text-white font-semibold">JOJIN JOHN</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px] font-mono">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Sanitized API</span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-radar-400" /> Edge Cached</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
