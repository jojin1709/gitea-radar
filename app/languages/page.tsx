import Link from 'next/link';
import { Code, Star } from 'lucide-react';
import { getLanguages } from '../../lib/repositories';
import { formatNumber } from '../../lib/utils';

export const metadata = {
  title: 'Programming Languages Explorer',
  description: 'Explore Gitea repositories categorized by programming language: Go, Rust, Python, TypeScript, C++, and more.',
};

export default function LanguagesPage() {
  const languages = getLanguages();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-dark-border pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-radar-500/30 bg-radar-950/40 px-3 py-1 text-xs font-mono text-radar-300 mb-2">
          <Code className="h-3.5 w-3.5 text-radar-400" />
          <span>LANGUAGE DIRECTORY</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Programming Languages
        </h1>
        <p className="mt-1.5 text-sm text-slate-400 max-w-xl">
          Browse software ecosystems by primary codebase language, total community stars, and repository adoption.
        </p>
      </div>

      {/* Grid of Languages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {languages.map((lang) => (
          <Link
            key={lang.name}
            href={`/languages/${encodeURIComponent(lang.name)}`}
            className="group rounded-xl border border-dark-border bg-dark-card p-5 hover:border-dark-borderHover hover:bg-dark-cardHover transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-3.5 w-3.5 rounded-full shadow-sm"
                    style={{ backgroundColor: lang.color }}
                  />
                  <h2 className="text-base font-bold text-white group-hover:text-radar-300 transition-colors">
                    {lang.name}
                  </h2>
                </div>
                <span className="font-mono text-xs text-slate-400 bg-dark-bg px-2.5 py-0.5 rounded-md border border-dark-border">
                  {lang.count} repos
                </span>
              </div>
            </div>

            {lang.topRepositories && lang.topRepositories.length > 0 && (
              <div className="mt-3 pt-3 border-t border-dark-border/60">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Popular Repos
                </div>
                <div className="flex flex-wrap gap-1">
                  {lang.topRepositories.slice(0, 3).map((r) => (
                    <span
                      key={r}
                      className="rounded bg-dark-bg px-2 py-0.5 text-[10px] font-mono text-slate-400 truncate max-w-[170px]"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-dark-border flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="h-3.5 w-3.5" />
                {formatNumber(lang.totalStars)} stars
              </span>
              <span className="text-radar-400 group-hover:translate-x-1 transition-transform font-semibold">
                Explore &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
