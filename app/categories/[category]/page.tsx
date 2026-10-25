import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Layers, Star } from 'lucide-react';
import { getCategory, getCategories } from '../../../lib/repositories';
import { RepositoryList } from '../../../components/repository/RepositoryList';
import { formatNumber } from '../../../lib/utils';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((c) => ({
    category: c.id,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const { summary } = getCategory(category);
  if (!summary) return { title: 'Category Not Found' };

  return {
    title: `${summary.name} Repositories`,
    description: summary.description || `Browse ${summary.name} projects in the Gitea ecosystem.`,
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const { summary, repositories } = getCategory(category);

  if (!summary && repositories.length === 0) {
    notFound();
  }

  const title = summary?.name || category;
  const description = summary?.description || `Open-source repositories categorized under ${title}.`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-radar-300 transition-colors font-mono"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Categories</span>
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-dark-border pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-xs font-mono text-purple-300 mb-2">
            <Layers className="h-3.5 w-3.5 text-purple-400" />
            <span>CATEGORY FEED</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-slate-400 max-w-xl">
            {description}
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
            <span>{formatNumber(repositories.reduce((acc, r) => acc + r.stars, 0))}</span>
          </div>
        </div>
      </div>

      {/* Feed */}
      <RepositoryList
        repositories={repositories}
        showRank={false}
        showTrendReason={true}
        emptyTitle={`No repositories found in ${title}`}
        emptyMessage="Repositories tagged or classified under this category will automatically appear here."
      />
    </div>
  );
}
