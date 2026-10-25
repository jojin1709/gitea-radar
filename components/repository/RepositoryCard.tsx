'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, GitFork, ExternalLink, Clock } from 'lucide-react';
import { Repository } from '../../types/repository';
import { GrowthBadge } from './GrowthBadge';
import { TrendReasonBadge } from './TrendReasonBadge';
import { formatNumber, formatRelativeTime } from '../../lib/utils';

interface RepositoryCardProps {
  repository: Repository;
  rank?: number;
  showTrendReason?: boolean;
}

export function RepositoryCard({ repository, rank, showTrendReason = false }: RepositoryCardProps) {
  const {
    owner,
    name,
    fullName,
    description,
    language,
    topics,
    stars,
    forks,
    starGrowth24h,
    growthPercentage24h,
    updatedAt,
    url,
    trendScore,
    trendReason,
  } = repository;

  return (
    <div
      tabIndex={0}
      className="group relative flex flex-col justify-between rounded-xl border border-dark-border bg-dark-card p-5 transition-all duration-200 hover:border-dark-borderHover hover:bg-dark-cardHover hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-radar-500"
    >
      {/* Top Header: Rank + Avatar + Name + External Link */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {rank !== undefined && (
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                  rank === 1
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                    : rank === 2
                    ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                    : rank === 3
                    ? 'bg-amber-700/20 text-amber-600 border border-amber-700/40'
                    : 'bg-dark-bg text-slate-400 border border-dark-border'
                }`}
              >
                #{rank}
              </span>
            )}

            {/* Avatar */}
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-dark-border bg-dark-bg shrink-0">
              <Image
                src={owner.avatarUrl}
                alt={`${owner.username}'s avatar`}
                width={32}
                height={32}
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>

            {/* Title & Owner */}
            <div className="min-w-0">
              <div className="flex items-baseline gap-1 text-xs text-slate-400">
                <span className="truncate hover:text-slate-200">{owner.username}</span>
                <span>/</span>
              </div>
              <Link
                href={`/repository/${owner.username}/${name}`}
                className="text-base font-semibold text-white group-hover:text-radar-300 transition-colors truncate block"
              >
                {name}
              </Link>
            </div>
          </div>

          {/* Direct Gitea Link Button */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open repository on Gitea.com"
            aria-label={`Open ${fullName} on Gitea.com`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-dark-border bg-dark-bg text-slate-400 hover:border-radar-500/50 hover:text-radar-300 transition-all shrink-0"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Description */}
        <p className="mt-3 text-sm text-slate-300 leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {description || <span className="italic text-slate-400">No description provided.</span>}
        </p>

        {/* Topics */}
        {topics && topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {topics.slice(0, 4).map((topic) => (
              <Link
                key={topic}
                href={`/topics/${encodeURIComponent(topic)}`}
                className="rounded border border-dark-border bg-dark-bg/60 px-2 py-0.5 text-[11px] font-mono text-slate-400 hover:border-radar-500/40 hover:text-radar-300 transition-colors"
              >
                #{topic}
              </Link>
            ))}
            {topics.length > 4 && (
              <span className="text-[10px] text-slate-400 font-mono self-center">
                +{topics.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Trend Reason (if enabled) */}
        {showTrendReason && trendReason && (
          <div className="mt-3">
            <TrendReasonBadge reason={trendReason} trendScore={trendScore} />
          </div>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="mt-4 pt-3 border-t border-dark-border flex items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          {/* Language */}
          {language && (
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <span className="h-2 w-2 rounded-full bg-radar-400" />
              {language}
            </span>
          )}

          {/* Stars */}
          <span className="flex items-center gap-1 font-mono text-slate-300">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />
            {formatNumber(stars)}
          </span>

          {/* Forks */}
          <span className="flex items-center gap-1 font-mono text-slate-300">
            <GitFork className="h-3.5 w-3.5 text-slate-400" />
            {formatNumber(forks)}
          </span>
        </div>

        {/* Growth or Updated Timestamp */}
        <div className="flex items-center gap-2 shrink-0">
          <GrowthBadge starGrowth={starGrowth24h} percentage={growthPercentage24h} timeframe="24h" />
          <span className="flex items-center gap-1 text-[11px] text-slate-400" title={new Date(updatedAt).toLocaleString()}>
            <Clock className="h-3 w-3" />
            {formatRelativeTime(updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
