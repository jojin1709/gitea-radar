import { Flame, Sparkles, Activity, Award } from 'lucide-react';

interface TrendReasonBadgeProps {
  reason?: string;
  trendScore?: number;
}

export function TrendReasonBadge({ reason, trendScore }: TrendReasonBadgeProps) {
  if (!reason) return null;

  let Icon = Flame;
  let colorClass = 'border-amber-500/30 bg-amber-950/30 text-amber-300';

  if (reason.includes('Rapid 24h star surge')) {
    Icon = Flame;
    colorClass = 'border-rose-500/30 bg-rose-950/30 text-rose-300';
  } else if (reason.includes('Breakout') || reason.includes('new')) {
    Icon = Sparkles;
    colorClass = 'border-radar-500/30 bg-radar-950/30 text-radar-300';
  } else if (reason.includes('release') || reason.includes('commit') || reason.includes('velocity')) {
    Icon = Activity;
    colorClass = 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300';
  } else if (reason.includes('staple')) {
    Icon = Award;
    colorClass = 'border-purple-500/30 bg-purple-950/30 text-purple-300';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${colorClass}`}>
      <Icon className="h-3 w-3" />
      <span>{reason}</span>
      {trendScore !== undefined && (
        <span className="opacity-70 font-mono text-[10px] ml-0.5">
          ({trendScore.toFixed(0)} pts)
        </span>
      )}
    </div>
  );
}
