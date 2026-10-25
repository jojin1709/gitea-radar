import { TrendingUp } from 'lucide-react';

interface GrowthBadgeProps {
  starGrowth?: number | null;
  percentage?: number | null;
  timeframe?: string;
  size?: 'sm' | 'md';
}

export function GrowthBadge({ starGrowth, percentage, timeframe = '24h', size = 'sm' }: GrowthBadgeProps) {
  // Return null if no real historical data exists
  if (starGrowth === null || starGrowth === undefined || starGrowth <= 0) {
    return null;
  }

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono font-medium rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 ${
        isSmall ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
      title={`Gained ${starGrowth} stars in the last ${timeframe} based on historical snapshots`}
    >
      <TrendingUp className={isSmall ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      <span>+{starGrowth} stars</span>
      {percentage !== null && percentage !== undefined && percentage > 0 && (
        <span className="text-emerald-500/80 font-normal">({percentage}%)</span>
      )}
      <span className="text-emerald-500/60 text-[10px]">/{timeframe}</span>
    </span>
  );
}
