import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import { getLanguage, getLanguages } from '../../../lib/repositories';
import { RepositoryList } from '../../../components/repository/RepositoryList';
import { formatNumber } from '../../../lib/utils';

interface LanguagePageProps {
  params: Promise<{ language: string }>;
}

const INVALID_FILENAME_CHARS = /[/\\:*?"<>|]/;

export async function generateStaticParams() {
  const languages = getLanguages();
  return languages
    .filter((l) => !INVALID_FILENAME_CHARS.test(l.name))
    .map((l) => ({
      language: encodeURIComponent(l.name),
    }));
}

export async function generateMetadata({ params }: LanguagePageProps) {
  const { language } = await params;
  const decoded = decodeURIComponent(language);
  return {
    title: `${decoded} Repositories`,
    description: `Discover open-source software and tools built in ${decoded} across the Gitea ecosystem.`,
  };
}

export default async function LanguageDetailPage({ params }: LanguagePageProps) {
  const { language } = await params;
  const decoded = decodeURIComponent(language);
  const { summary, repositories } = getLanguage(decoded);

  if (!summary && repositories.length === 0) {
    notFound();
  }

  const totalStars = repositories.reduce((acc, r) => acc + r.stars, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/languages"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-radar-300 transition-colors font-mono"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Languages</span>
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-dark-border pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-radar-500/30 bg-radar-950/40 px-3 py-1 text-xs font-mono text-radar-300 mb-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: summary?.color || '#06B6D4' }}
            />
            <span>LANGUAGE ECOSYSTEM</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            {decoded} Repositories
          </h1>
          <p className="mt-1.5 text-sm text-slate-400 max-w-xl">
            Open-source repositories where {decoded} is the primary programming language.
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
        emptyTitle={`No repositories found using ${decoded}`}
        emptyMessage="Repositories written in this language will appear here as they are discovered."
      />
    </div>
  );
}
