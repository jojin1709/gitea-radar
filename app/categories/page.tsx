import Link from 'next/link';
import {
  Layers,
  Star,
  Sparkles,
  Cpu,
  ShieldCheck,
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
} from 'lucide-react';
import { getCategories } from '../../lib/repositories';
import { formatNumber } from '../../lib/utils';

export const metadata = {
  title: 'Repository Categories',
  description: 'Explore Gitea repositories classified into software domains: AI, Developer Tools, Cybersecurity, Web, Infrastructure, and more.',
};

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

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-dark-border pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-xs font-mono text-purple-300 mb-2">
          <Layers className="h-3.5 w-3.5 text-purple-400" />
          <span>TAXONOMY & DIRECTORY</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Ecosystem Categories
        </h1>
        <p className="mt-1.5 text-sm text-slate-400 max-w-xl">
          Discover specialized tools and platforms grouped by domain, architecture, and technology stack.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.iconName] || Folder;
          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="group rounded-xl border border-dark-border bg-dark-card p-5 hover:border-dark-borderHover hover:bg-dark-cardHover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-bg text-radar-400 border border-dark-border group-hover:border-radar-500/30 group-hover:text-radar-300 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs text-slate-400 bg-dark-bg px-2.5 py-1 rounded-md border border-dark-border">
                    {cat.count} repos
                  </span>
                </div>
                <h2 className="text-base font-bold text-white group-hover:text-radar-300 transition-colors">
                  {cat.name}
                </h2>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
              </div>

              {cat.topRepositories && cat.topRepositories.length > 0 && (
                <div className="mt-4 pt-3 border-t border-dark-border/60">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Sample Repositories
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cat.topRepositories.slice(0, 3).map((r) => (
                      <span
                        key={r}
                        className="rounded bg-dark-bg px-2 py-0.5 text-[10px] font-mono text-slate-400 truncate max-w-[180px]"
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
                  {formatNumber(cat.totalStars)} stars
                </span>
                <span className="text-radar-400 group-hover:translate-x-1 transition-transform font-semibold">
                  Browse feed &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
