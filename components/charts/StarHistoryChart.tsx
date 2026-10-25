'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface ChartPoint {
  timestamp: string;
  stars: number;
  forks: number;
  label: string;
}

interface StarHistoryChartProps {
  data: ChartPoint[];
  repoName: string;
}

export function StarHistoryChart({ data, repoName }: StarHistoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dark-border bg-dark-bg/50 text-slate-400 text-sm font-mono">
        Insufficient snapshot history collected for {repoName}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dark-border bg-dark-card p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-semibold text-white">Historical Metric Trajectory</h3>
          <p className="text-xs text-slate-400">
            Recorded snapshots from Gitea Radar crawler pipeline
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-radar-300">
            <span className="h-2 w-2 rounded-full bg-radar-400" />
            Stars
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            Forks
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="starGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="forkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c263d" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-dark-border bg-dark-bg/95 p-3 shadow-xl backdrop-blur-md text-xs font-mono">
                      <div className="text-slate-400 mb-1">{label}</div>
                      <div className="flex items-center justify-between gap-4 text-radar-300 font-bold">
                        <span>Stars:</span>
                        <span>{payload[0]?.value}</span>
                      </div>
                      {payload[1] && (
                        <div className="flex items-center justify-between gap-4 text-slate-300">
                          <span>Forks:</span>
                          <span>{payload[1]?.value}</span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="stars"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#starGradient)"
            />
            <Area
              type="monotone"
              dataKey="forks"
              stroke="#64748b"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#forkGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
