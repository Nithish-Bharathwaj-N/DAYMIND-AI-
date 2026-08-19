import React, { useEffect, useState } from 'react';
import { CheckSquare, Target, TrendingUp, Heart, Flame } from 'lucide-react';

const API = 'http://localhost:8080/api';

export default function KpiCards({ tasks = [] }) {
  const [focusMins, setFocusMins] = useState(0);
  const [streak, setStreak]       = useState(0);

  // Fetch real focus time and habit streak once on mount
  useEffect(() => {
    // Today's focus minutes
    fetch(`${API}/focus-sessions/today`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.success) setFocusMins(data.totalMinutes || 0); })
      .catch(() => {});

    // Max habit streak
    fetch(`${API}/habits`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.success) setStreak(data.maxStreak || 0); })
      .catch(() => {});
  }, []);

  // Task stats — from real task list passed via props
  const completedCount = tasks.filter(t => t.completed || t.isCompleted).length;
  const totalCount     = tasks.length;
  const tasksPercent   = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Focus time
  const focusHours   = Math.floor(focusMins / 60);
  const focusRemMins = focusMins % 60;
  const focusPercent = Math.min(100, Math.round((focusMins / 360) * 100)); // 6h goal

  // Productivity: real ratio + baseline floor
  const productivityPercent = totalCount > 0
    ? Math.min(100, Math.round((completedCount / totalCount) * 80 + 20))
    : 0;

  // Well-being: drops per urgent overdue task
  const urgentPending = tasks.filter(t => !(t.completed || t.isCompleted) && t.priority === 'URGENT').length;
  const wellbeingScore = Math.max(40, Math.min(100, 100 - urgentPending * 15));

  // Streak percent (cap at 30-day target)
  const streakPercent = Math.min(100, Math.round((streak / 30) * 100));

  const wellColor = wellbeingScore >= 75 ? 'emerald' : wellbeingScore >= 50 ? 'amber' : 'rose';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">

      {/* 1. Tasks Today */}
      <div className="ui-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--text-secondary)]">Tasks Today</span>
          <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
            <CheckSquare className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-[var(--text-primary)]">{completedCount}</div>
          <div className="text-[11px] text-[var(--text-secondary)] font-medium">
            of {totalCount} completed
          </div>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-500/20 overflow-hidden">
          <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: `${tasksPercent}%` }} />
        </div>
      </div>

      {/* 2. Focus Time — real from DB */}
      <div className="ui-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--text-secondary)]">Focus Time</span>
          <div className="p-2 rounded-xl bg-blue-500/15 text-blue-500">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-[var(--text-primary)]">
            {focusHours}h {focusRemMins}m
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] font-medium">of 6h goal</div>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-500/20 overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${focusPercent}%` }} />
        </div>
      </div>

      {/* 3. Productivity */}
      <div className="ui-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--text-secondary)]">Productivity</span>
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-[var(--text-primary)]">{productivityPercent}%</div>
          <div className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
            {tasksPercent >= 50 ? '↑ On Track' : '↓ Needs Focus'}
            <span className="text-[var(--text-secondary)] font-normal ml-1">today</span>
          </div>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-500/20 overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${productivityPercent}%` }} />
        </div>
      </div>

      {/* 4. Well-being */}
      <div className="ui-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--text-secondary)]">Well-being</span>
          <div className="p-2 rounded-xl bg-rose-500/15 text-rose-500">
            <Heart className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-[var(--text-primary)]">
            {wellbeingScore}<span className="text-xs font-normal text-[var(--text-secondary)]">/100</span>
          </div>
          <div className={`text-[11px] text-${wellColor}-500 font-semibold flex items-center gap-1`}>
            {wellbeingScore >= 75 ? 'Good' : wellbeingScore >= 50 ? 'Fair' : 'Needs Rest'}
            <span className={`w-2 h-2 rounded-full bg-${wellColor}-500 animate-pulse`} />
          </div>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-500/20 overflow-hidden">
          <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${wellbeingScore}%` }} />
        </div>
      </div>

      {/* 5. Streak — real from DB */}
      <div className="ui-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--text-secondary)]">Streak</span>
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-[var(--text-primary)]">
            {streak} <span className="text-xs font-semibold text-[var(--text-secondary)]">days</span>
          </div>
          <div className="text-[11px] text-amber-500 font-semibold">
            {streak > 0 ? '🔥 Active Streak' : '⚡ Start a habit!'}
          </div>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-500/20 overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${streakPercent}%` }} />
        </div>
      </div>

    </div>
  );
}
