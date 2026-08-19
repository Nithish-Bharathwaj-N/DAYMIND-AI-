import React, { useEffect, useState, useMemo } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getLast7Dates() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d;
  });
}

export default function ProductivityTrendChart({ tasks = [] }) {
  const [weeklyMinutes, setWeeklyMinutes] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/focus-sessions/weekly')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.success) setWeeklyMinutes(data.weeklyMinutes || {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const points = useMemo(() => {
    const today = new Date();
    const dates = getLast7Dates();
    return dates.map(d => {
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
      const mins = weeklyMinutes[dateStr] || 0;
      // Convert to a productivity % (360 mins = 100%)
      const val = Math.min(100, Math.round((mins / 360) * 100));
      const isToday = d.toDateString() === today.toDateString();
      const dayLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
      return { day: dayLabel, val, mins, isToday, dateStr };
    });
  }, [weeklyMinutes]);

  const W = 380, H = 110;
  const PAD_L = 28, PAD_R = 12, PAD_T = 12, PAD_B = 6;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  const coords = points.map((p, i) => ({
    x: PAD_L + (i / (points.length - 1)) * chartW,
    y: PAD_T + (1 - p.val / 100) * chartH,
    ...p,
  }));

  const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
  const areaD = pathD + ` L ${coords[coords.length - 1].x.toFixed(1)} ${(PAD_T + chartH).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(PAD_T + chartH).toFixed(1)} Z`;

  const avgVal = Math.round(points.reduce((s, p) => s + p.val, 0) / points.length);
  const todayMins = points.find(p => p.isToday)?.mins ?? 0;

  return (
    <div className="ui-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          <span>Focus Trend (7d)</span>
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[var(--text-muted)]">
            Today: <strong className="text-purple-600">{Math.floor(todayMins / 60)}h {todayMins % 60}m</strong>
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--text-secondary)] bg-[var(--tag-bg)] border border-[var(--tag-border)] px-2.5 py-1 rounded-lg">
            Avg: <span className="text-purple-600 dark:text-purple-400">{avgVal}%</span>
          </div>
          <button
            onClick={fetchData}
            className="p-1.5 rounded-lg hover:bg-purple-500/10 text-[var(--text-muted)] hover:text-purple-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Y axis labels */}
        <div className="absolute left-0 top-3 bottom-1 flex flex-col justify-between text-[9px] font-mono text-[var(--text-muted)] pointer-events-none">
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" style={{ height: 110 }}>
          <defs>
            <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6c5ce7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6c5ce7" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 0.5, 1].map((r, i) => (
            <line
              key={i}
              x1={PAD_L} y1={PAD_T + r * chartH}
              x2={W - PAD_R} y2={PAD_T + r * chartH}
              stroke="currentColor" strokeOpacity="0.08" strokeWidth="1"
              className="text-slate-500"
            />
          ))}

          {/* Area fill */}
          <path d={areaD} fill="url(#prodGrad)" />

          {/* Line */}
          <path d={pathD} fill="none" stroke="#6c5ce7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots */}
          {coords.map((c, i) => (
            <g key={i}>
              {c.isToday && (
                <circle cx={c.x} cy={c.y} r="9" fill="#6c5ce7" fillOpacity="0.12" />
              )}
              <circle
                cx={c.x} cy={c.y} r={c.isToday ? 5 : 3.5}
                fill={c.val > 0 ? '#6c5ce7' : 'var(--bg-card)'}
                stroke="#6c5ce7" strokeWidth={c.isToday ? 2.5 : 2}
                className="cursor-pointer"
              >
                <title>{c.day}: {c.mins} mins ({c.val}%)</title>
              </circle>
              {c.isToday && (
                <text x={c.x} y={c.y - 12} textAnchor="middle" fontSize="8" fill="#6c5ce7" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                  {c.val}%
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* X axis day labels */}
        <div className="flex justify-between text-[10px] font-mono text-[var(--text-secondary)] px-6 -mt-1">
          {points.map((p, i) => (
            <span key={i} className={p.isToday ? 'font-extrabold text-purple-600 dark:text-purple-400' : ''}>
              {p.day}
            </span>
          ))}
        </div>
      </div>

      {Object.keys(weeklyMinutes).length === 0 && !loading && (
        <p className="text-[10px] text-[var(--text-muted)] text-center font-medium">
          Complete focus sessions to see your real trend chart
        </p>
      )}
    </div>
  );
}
