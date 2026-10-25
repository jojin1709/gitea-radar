import { Sparkles } from 'lucide-react';
import { getNewestRepositories } from '../../lib/repositories';
import { RepositoryList } from '../../components/repository/RepositoryList';

export const metadata = {
  title: 'Just Discovered & Newest Repositories',
  description: 'Newly created and freshly indexed public repositories discovered across the Gitea ecosystem.',
};

export default function NewestPage() {
  const newest = getNewestRepositories();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-dark-border pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-radar-500/30 bg-radar-950/40 px-3 py-1 text-xs font-mono text-radar-300 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-radar-400" />
          <span>CHRONOLOGICAL STREAM</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Newest Repositories
        </h1>
        <p className="mt-1.5 text-sm text-slate-400 max-w-xl">
          The freshest open-source projects discovered by our automated crawler. Find new tools before anyone else.
        </p>
      </div>

      {/* Feed */}
      <RepositoryList
        repositories={newest}
        showRank={false}
        emptyTitle="No recently created repositories"
        emptyMessage="The automated discovery pipeline regularly tracks newly created repositories on Gitea."
      />
    </div>
  );
}
