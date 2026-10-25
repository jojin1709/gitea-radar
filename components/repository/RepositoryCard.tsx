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

const LANGUAGE_COLORS: Record<string, string> = {
  Go: '#00ADD8',
  Rust: '#DEA584',
  Python: '#3572A5',
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  Java: '#B07219',
  'C++': '#F34B7D',
  C: '#555555',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Shell: '#89E051',
  Vue: '#41B883',
  HTML: '#E34C26',
  CSS: '#563D7C',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Dart: '#00B4AB',
  Lua: '#000080',
  Zig: '#EC915C',
};

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

  const langColor = language ? LANGUAGE_COLORS[language] || '#64748B' : undefined;

  return (
    <div
      tabIndex={0}
      className="group relative flex flex-col justify-between rounded-xl border border-dark-border bg-dark-card p-4 transition-all duration-200 hover:border-dark-borderHover hover:bg-dark-cardHover hover:shadow-xl focus:outline-none focus-visible:ring-1 focus-visible:ring-radar-400"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {rank !== undefined && (
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-md font-mono text-xs font-semibold shrink-0 ${
                  rank === 1
                    ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                    : rank === 2
                    ? 'bg-slate-300/10 text-slate-200 border border-slate-300/30'
                    : rank === 3
                    ? 'bg-amber-700/10 text-amber-500 border border-amber-700/30'
                    : 'bg-white/5 text-slate-400 border border-white/5'
                }`}
              >
                {rank}
              </span>
            )}

            {/* Avatar */}
            <div className="relative h-7 w-7 overflow-hidden rounded-full border border-white/10 bg-dark-bg shrink-0">
              <Image
                src={owner.avatarUrl}
                alt={`${owner.username}'s avatar`}
                width={28}
                height={28}
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>

            {/* Title & Owner */}
            <div className="min-w-0">
              <div className="flex items-baseline gap-1 text-[11px] font-mono text-slate-400 truncate">
                <span className="truncate hover:text-slate-300">{owner.username}</span>
                <span>/</span>
              </div>
              <Link
                href={`/repository/${owner.username}/${name}`}
                className="text-sm font-semibold text-white group-hover:text-radar-300 transition-colors truncate block"
              >
                {name}
              </Link>
            </div>
          </div>

          {/* Direct External Link */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open on Gitea.com"
            aria-label={`Open ${fullName} on Gitea.com`}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white transition-all shrink-0"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Description */}
        <p className="mt-2.5 text-xs text-slate-300 leading-relaxed line-clamp-2 min-h-[2rem]">
          {description || <span className="italic text-slate-400">No description provided.</span>}
        </p>

        {/* Topics */}
        {topics && topics.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {topics.slice(0, 3).map((topic) => (
              <Link
                key={topic}
                href={`/topics/${encodeURIComponent(topic)}`}
                className="rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/[0.03] border border-white/5 hover:border-radar-500/30 hover:text-radar-300 transition-colors"
              >
                #{topic}
              </Link>
            ))}
            {topics.length > 3 && (
              <span className="text-[10px] text-slate-400 font-mono self-center">
                +{topics.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Trend Reason Badge */}
        {showTrendReason && trendReason && (
          <div className="mt-2.5">
            <TrendReasonBadge reason={trendReason} trendScore={trendScore} />
          </div>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          {/* Language */}
          {language && (
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: langColor }}
              />
              {language}
            </span>
          )}

          {/* Stars */}
          <span className="flex items-center gap-1 font-mono text-[11px] text-slate-300">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400/20" />
            {formatNumber(stars)}
          </span>

          {/* Forks */}
          <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
            <GitFork className="h-3 w-3 text-slate-400" />
            {formatNumber(forks)}
          </span>
        </div>

        {/* Growth or Updated Timestamp */}
        <div className="flex items-center gap-2 shrink-0">
          <GrowthBadge starGrowth={starGrowth24h} percentage={growthPercentage24h} timeframe="24h" size="sm" />
          <span className="flex items-center gap-1 text-[10px] text-slate-400" title={new Date(updatedAt).toLocaleString()}>
            <Clock className="h-2.5 w-2.5" />
            {formatRelativeTime(updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
