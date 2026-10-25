import { Flame, Sparkles, Activity, Award } from 'lucide-react';

interface TrendReasonBadgeProps {
  reason?: string;
  trendScore?: number;
}

export function TrendReasonBadge({ reason }: TrendReasonBadgeProps) {
  if (!reason) return null;

  let Icon = Flame;
  let colorClass = 'border-amber-500/20 bg-amber-500/10 text-amber-300';

  if (reason.includes('Rapid 24h star surge')) {
    Icon = Flame;
    colorClass = 'border-rose-500/20 bg-rose-500/10 text-rose-300';
  } else if (reason.includes('Breakout') || reason.includes('new')) {
    Icon = Sparkles;
    colorClass = 'border-sky-500/20 bg-sky-500/10 text-sky-300';
  } else if (reason.includes('release') || reason.includes('commit') || reason.includes('velocity')) {
    Icon = Activity;
    colorClass = 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300';
  } else if (reason.includes('staple')) {
    Icon = Award;
    colorClass = 'border-purple-500/20 bg-purple-500/10 text-purple-300';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-medium leading-tight ${colorClass}`}>
      <Icon className="h-3 w-3 shrink-0" />
      <span className="truncate">{reason}</span>
    </div>
  );
}
