import Link from 'next/link';
import { Compass, Star, Hash } from 'lucide-react';
import { getTopics } from '../../lib/repositories';
import { formatNumber } from '../../lib/utils';

export const metadata = {
  title: 'Community Topics & Tags',
  description: 'Explore community-tagged topics across the Gitea repository ecosystem.',
};

export default function TopicsPage() {
  const topics = getTopics();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-dark-border pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-mono text-emerald-300 mb-2">
          <Compass className="h-3.5 w-3.5 text-emerald-400" />
          <span>TOPICS & KEYWORDS</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Ecosystem Topics
        </h1>
        <p className="mt-1.5 text-sm text-slate-400 max-w-xl">
          Granular tags and ecosystem keywords applied to projects by repository maintainers.
        </p>
      </div>

      {/* Grid of Topics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topics.map((topic) => (
          <Link
            key={topic.name}
            href={`/topics/${encodeURIComponent(topic.name)}`}
            className="group rounded-xl border border-dark-border bg-dark-card p-4 hover:border-dark-borderHover hover:bg-dark-cardHover transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1 font-mono font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                  <Hash className="h-4 w-4 text-emerald-400" />
                  {topic.name}
                </span>
                <span className="font-mono text-xs text-slate-400 bg-dark-bg px-2 py-0.5 rounded border border-dark-border">
                  {topic.count}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-dark-border flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="h-3 w-3" />
                {formatNumber(topic.totalStars)}
              </span>
              <span className="text-radar-400 group-hover:translate-x-1 transition-transform">
                View repos &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
