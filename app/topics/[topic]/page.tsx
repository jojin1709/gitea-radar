import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Hash, Star } from 'lucide-react';
import { getTopic, getTopics } from '../../../lib/repositories';
import { RepositoryList } from '../../../components/repository/RepositoryList';
import { formatNumber } from '../../../lib/utils';

interface TopicPageProps {
  params: Promise<{ topic: string }>;
}

const INVALID_FILENAME_CHARS = /[/\\:*?"<>|]/;

export async function generateStaticParams() {
  const topics = getTopics();
  return topics
    .filter((t) => !INVALID_FILENAME_CHARS.test(t.name))
    .map((t) => ({
      topic: encodeURIComponent(t.name),
    }));
}

export async function generateMetadata({ params }: TopicPageProps) {
  const { topic } = await params;
  const decoded = decodeURIComponent(topic);
  return {
    title: `#${decoded} Repositories`,
    description: `Discover open-source software tagged with #${decoded} in the Gitea ecosystem.`,
  };
}

export default async function TopicDetailPage({ params }: TopicPageProps) {
  const { topic } = await params;
  const decoded = decodeURIComponent(topic);
  const { summary, repositories } = getTopic(decoded);

  if (!summary && repositories.length === 0) {
    notFound();
  }

  const totalStars = repositories.reduce((acc, r) => acc + r.stars, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/topics"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-300 transition-colors font-mono"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Topics</span>
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-dark-border pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-mono text-emerald-300 mb-2">
            <Hash className="h-3.5 w-3.5 text-emerald-400" />
            <span>TOPIC FEED</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            #{decoded}
          </h1>
          <p className="mt-1.5 text-sm text-slate-400 max-w-xl">
            Repositories annotated with the topic tag &ldquo;{decoded}&rdquo;.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono bg-dark-card border border-dark-border px-4 py-2 rounded-xl self-start sm:self-auto">
          <div>
            <span className="text-white font-bold">{repositories.length}</span>
            <span className="text-slate-400 ml-1">repos</span>
          </div>
          <div className="text-slate-600">&bull;</div>
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="h-3.5 w-3.5" />
            <span>{formatNumber(totalStars)}</span>
          </div>
        </div>
      </div>

      {/* Feed */}
      <RepositoryList
        repositories={repositories}
        showRank={false}
        showTrendReason={true}
        emptyTitle={`No repositories tagged #${decoded}`}
        emptyMessage="Repositories tagged with this keyword will appear here as they are discovered."
      />
    </div>
  );
}
