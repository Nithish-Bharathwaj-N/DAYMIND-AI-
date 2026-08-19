import React, { useState, useMemo, useCallback } from 'react';
import { Sparkles, RefreshCw, ChevronRight, Loader2, Brain } from 'lucide-react';
import { sound } from '../utils/audio';

const TIME_OF_DAY = () => {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
};

const TYPE_STYLES = {
  WARNING: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
  TIP:     'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
  INFO:    'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
  SUCCESS: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
};

/**
 * Derive contextual AI suggestions entirely from real task data passed via props.
 * No mock data — every suggestion is computed from what's actually in the backend tasks array.
 */
function deriveTaskSuggestions(tasks, timeOfDay) {
  const todayISO = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => {
    if (!t.scheduledDate) return false;
    const d = Array.isArray(t.scheduledDate)
      ? `${t.scheduledDate[0]}-${String(t.scheduledDate[1]).padStart(2,'0')}-${String(t.scheduledDate[2]).padStart(2,'0')}`
      : t.scheduledDate;
    return d === todayISO;
  });

  const urgent       = todayTasks.filter(t => t.priority === 'URGENT' && !(t.completed || t.isCompleted));
  const pending      = todayTasks.filter(t => !(t.completed || t.isCompleted));
  const completed    = todayTasks.filter(t => t.completed || t.isCompleted);
  const totalToday   = todayTasks.length;
  const completionPct = totalToday > 0 ? Math.round((completed.length / totalToday) * 100) : 0;
  const highPriority = pending.filter(t => t.priority === 'HIGH' || t.priority === 'URGENT');

  const suggestions = [];

  // --- URGENT TASK WARNING ---
  if (urgent.length > 0) {
    suggestions.push({
      icon: '🚨',
      type: 'WARNING',
      title: `${urgent.length} Urgent Task${urgent.length > 1 ? 's' : ''} Need Attention`,
      detail: `"${urgent[0].title}"${urgent.length > 1 ? ` and ${urgent.length - 1} more` : ''} — tackle these first to prevent deadline overrun.`,
      action: null,
    });
  }

  // --- PROGRESS STATUS ---
  if (totalToday > 0 && completionPct >= 60) {
    suggestions.push({
      icon: '🏆',
      type: 'SUCCESS',
      title: `${completionPct}% Done — Great Momentum!`,
      detail: `You've completed ${completed.length} of ${totalToday} tasks today. ${pending.length > 0 ? `${pending.length} left.` : 'All done!'}`,
      action: null,
    });
  } else if (totalToday > 0 && completionPct < 30 && timeOfDay === 'afternoon') {
    suggestions.push({
      icon: '⚡',
      type: 'WARNING',
      title: 'Behind Schedule — Time to Accelerate',
      detail: `Only ${completionPct}% done by ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Consider running the optimizer to reassign tasks.`,
      action: 'optimize',
    });
  }

  // --- NEXT TASK SUGGESTION ---
  if (pending.length > 0) {
    const next = highPriority[0] || pending[0];
    suggestions.push({
      icon: '🎯',
      type: 'TIP',
      title: `Next Up: ${next.title}`,
      detail: `Priority: ${next.priority || 'MEDIUM'} · ${next.taskType || next.category || 'Task'} · Est. ${next.predictedDurationMinutes || 60} min`,
      action: null,
    });
  }

  // --- PLANNING FALLACY WARNING ---
  const biasedTasks = tasks.filter(t => t.biasCorrectionNotice);
  if (biasedTasks.length > 0) {
    suggestions.push({
      icon: '🧠',
      type: 'INFO',
      title: 'Planning Fallacy Correction Active',
      detail: `${biasedTasks.length} task${biasedTasks.length > 1 ? 's have' : ' has'} been time-buffered based on your past completion patterns.`,
      action: null,
    });
  }

  // --- OPTIMIZE NUDGE ---
  if (pending.length > 3 && suggestions.length < 3) {
    suggestions.push({
      icon: '✨',
      type: 'INFO',
      title: 'Run Self-Healing Optimizer',
      detail: `You have ${pending.length} pending tasks. Let the AI reschedule them into your peak focus windows (9–11 AM, 2–4 PM).`,
      action: 'optimize',
    });
  }

  // --- TIME-OF-DAY DEFAULTS (only if few data-driven ones) ---
  if (suggestions.length === 0) {
    const defaults = {
      morning:   { icon: '🌅', type: 'TIP', title: 'Peak Focus Window Active', detail: 'Your brain is sharpest 9–11 AM. Tackle the hardest task now.' },
      afternoon: { icon: '☕', type: 'TIP', title: 'Post-Lunch Tip', detail: 'Energy dips 1–3 PM. Consider a short walk or a lighter creative task.' },
      evening:   { icon: '📝', type: 'TIP', title: 'Plan Tomorrow', detail: 'Spend 15 min planning tomorrow for a 40% focus boost next morning.' },
      night:     { icon: '🌙', type: 'INFO', title: 'Rest is Productivity', detail: 'Consistent sleep is the #1 predictor of next-day cognitive performance.' },
    };
    suggestions.push(defaults[timeOfDay] || defaults.morning);
  }

  return suggestions.slice(0, 3);
}

export default function AiSuggestionsWidget({ tasks = [], onOptimizeClick, onViewAllInsights }) {
  const [refreshTick, setRefreshTick] = useState(0);
  const [loading, setLoading]         = useState(false);
  const timeOfDay = TIME_OF_DAY();

  // Recompute suggestions whenever tasks or refreshTick changes
  const suggestions = useMemo(
    () => deriveTaskSuggestions(tasks, timeOfDay),
    [tasks, timeOfDay, refreshTick]
  );

  const handleRefresh = () => {
    sound.playClick?.();
    setLoading(true);
    setTimeout(() => {
      setRefreshTick(t => t + 1);
      setLoading(false);
    }, 600); // brief loading feel
  };

  const handleSuggestionClick = (s) => {
    sound.playClick?.();
    if (s.action === 'optimize') onOptimizeClick?.();
    else if (s.action === 'insights') onViewAllInsights?.();
  };

  const todayISO = new Date().toISOString().split('T')[0];
  const todayCount = tasks.filter(t => {
    if (!t.scheduledDate) return false;
    const d = Array.isArray(t.scheduledDate)
      ? `${t.scheduledDate[0]}-${String(t.scheduledDate[1]).padStart(2,'0')}-${String(t.scheduledDate[2]).padStart(2,'0')}`
      : t.scheduledDate;
    return d === todayISO;
  }).length;

  return (
    <div className="ui-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-600" />
          <span>AI Insights</span>
          <span className="text-[9px] bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded-full font-bold border border-purple-500/20">
            {tasks.length} tasks
          </span>
        </h3>
        <button
          onClick={handleRefresh}
          title="Refresh insights"
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-purple-600 hover:bg-purple-500/10 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="text-[10px] font-mono text-[var(--text-muted)] -mt-1 font-medium capitalize">
        {timeOfDay} · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {todayCount} today
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
        </div>
      ) : (
        <div className="space-y-2.5">
          {suggestions.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSuggestionClick(item)}
              className={`p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer group ${TYPE_STYLES[item.type] || TYPE_STYLES.TIP} ${item.action ? 'hover:shadow-sm' : 'cursor-default'}`}
            >
              <div className="text-base leading-none shrink-0 mt-0.5">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold leading-tight">
                  {item.title}
                </div>
                <div className="text-[11px] font-medium mt-0.5 leading-relaxed opacity-80">
                  {item.detail}
                </div>
              </div>
              {item.action && (
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="pt-1 text-center">
        <button
          onClick={() => { sound.playClick?.(); onViewAllInsights?.(); }}
          className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors inline-flex items-center gap-1 cursor-pointer"
        >
          <span>Full Analytics Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
