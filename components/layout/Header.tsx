'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Flame,
  Sparkles,
  TrendingUp,
  Star,
  Layers,
  Code,
  Compass,
  Search,
  Menu,
  X,
  Rss,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { name: 'Trending', href: '/trending', icon: Flame },
  { name: 'Newest', href: '/newest', icon: Sparkles },
  { name: 'Rising', href: '/rising', icon: TrendingUp },
  { name: 'Popular', href: '/popular', icon: Star },
  { name: 'Categories', href: '/categories', icon: Layers },
  { name: 'Languages', href: '/languages', icon: Code },
  { name: 'Topics', href: '/topics', icon: Compass },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        router.push('/search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-2.5 focus:outline-none">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-radar-500/10 border border-radar-400/20 text-radar-400 group-hover:border-radar-400/50 transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a10 10 0 0 1 10 10" />
                <path d="M12 12 19 5" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-white group-hover:text-slate-200 transition-colors">
                Gitea <span className="text-radar-400 font-bold">Radar</span>
              </span>
              <span className="hidden sm:inline-block rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/5">
                v1.0
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-white/[0.08] font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-radar-400' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Tools: Search, RSS, GitHub */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/search"
            aria-label="Search repositories"
            className="flex items-center gap-2 rounded-lg border border-dark-border bg-dark-card/60 px-2.5 py-1.5 text-xs text-slate-400 hover:border-dark-borderHover hover:text-slate-200 transition-all"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline text-xs">Search catalog...</span>
            <kbd className="hidden sm:inline-block rounded border border-white/10 bg-white/5 px-1 py-0.5 text-[10px] font-mono text-slate-400">
              /
            </kbd>
          </Link>

          {/* RSS Link */}
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            title="RSS 2.0 Feed"
            aria-label="RSS 2.0 Feed"
            className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg border border-dark-border bg-dark-card/60 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all"
          >
            <Rss className="h-3.5 w-3.5" />
          </a>

          {/* GitHub Repo */}
          <a
            href="https://github.com/jojin1709/gitea-radar"
            target="_blank"
            rel="noopener noreferrer"
            title="View on GitHub"
            aria-label="View Gitea Radar on GitHub"
            className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg border border-dark-border bg-dark-card/60 text-slate-400 hover:text-white hover:border-white/20 transition-all"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            className="flex lg:hidden items-center justify-center p-1.5 rounded-lg border border-dark-border text-slate-400 hover:text-white"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-dark-border bg-dark-bg px-4 pt-2 pb-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-radar-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
