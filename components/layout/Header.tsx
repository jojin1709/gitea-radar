'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, Flame, Sparkles, TrendingUp, Star, Layers, Code, Search, Menu, X, Radio } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-2.5 focus:outline-none">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-radar-500/30 bg-radar-950/40 text-radar-400 transition-all group-hover:border-radar-400 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              <Radio className="h-5 w-5 animate-pulse-subtle" />
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-radar-300 transition-colors">
                Gitea <span className="text-radar-400">Radar</span>
              </span>
              <span className="hidden sm:block text-[10px] tracking-wider uppercase text-dark-muted font-mono font-medium -mt-1">
                Discovery Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 pl-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-radar-950/60 text-radar-300 border border-radar-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-dark-cardHover'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-radar-400' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Quick Search & Status */}
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            aria-label="Search repositories"
            className="flex items-center gap-2 rounded-lg border border-dark-border bg-dark-card px-3 py-1.5 text-xs text-slate-400 hover:border-dark-borderHover hover:text-white transition-all shadow-inner"
          >
            <Search className="h-3.5 w-3.5 text-radar-400" />
            <span className="hidden sm:inline">Search repos...</span>
            <kbd className="hidden sm:inline-block rounded border border-dark-border bg-dark-bg px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
              /
            </kbd>
          </Link>

          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-950/30 text-[11px] text-emerald-400 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Sync
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            className="flex md:hidden items-center justify-center p-2 rounded-lg border border-dark-border text-slate-400 hover:text-white hover:bg-dark-card"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-dark-border bg-dark-bg px-4 pt-2 pb-4 space-y-1">
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
                    ? 'bg-radar-950/70 text-radar-300 border border-radar-500/30'
                    : 'text-slate-300 hover:bg-dark-card'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-radar-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-dark-border mt-2">
            <Link
              href="/search"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-radar-500 text-slate-950 text-sm font-semibold hover:bg-radar-400"
            >
              <Search className="h-4 w-4" />
              Search All Repositories
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
