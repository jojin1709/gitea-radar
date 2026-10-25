import { ArrowUpRight } from 'lucide-react';

interface GrowthBadgeProps {
  starGrowth?: number | null;
  percentage?: number | null;
  timeframe?: string;
  size?: 'sm' | 'md';
}

export function GrowthBadge({ starGrowth, percentage, timeframe = '24h', size = 'sm' }: GrowthBadgeProps) {
  if (starGrowth === null || starGrowth === undefined || starGrowth <= 0) {
    return null;
  }

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-0.5 font-mono font-semibold rounded px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${
        isSmall ? 'text-[10px]' : 'text-xs'
      }`}
      title={`+${starGrowth} stars in the last ${timeframe}`}
    >
      <ArrowUpRight className="h-3 w-3" />
      <span>+{starGrowth}</span>
      {percentage !== null && percentage !== undefined && percentage > 0 && (
        <span className="opacity-80 font-normal">({percentage}%)</span>
      )}
    </span>
  );
}
