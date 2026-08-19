import React, { useState } from 'react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

const PRIORITY_COLOR = {
  URGENT: 'border-l-red-500',
  HIGH:   'border-l-amber-500',
  MEDIUM: 'border-l-blue-400',
  LOW:    'border-l-slate-300',
};

export default function TodayTasksWidget({ tasks = [], onToggleComplete, onViewAll }) {
  const [filter, setFilter] = useState('All');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'Important') return t.priority === 'HIGH' || t.priority === 'URGENT';
    if (filter === 'Completed') return t.isCompleted;
    return true;
  });

  const formatHour = (h) => {
    if (!h && h !== 0) return '—';
    const suffix = h >= 12 ? 'PM' : 'AM';
    const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${display}:00 ${suffix}`;
  };

  return (
    <div className="ui-card p-5 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[var(--text-primary)]">Today's Top Tasks</h3>
        <button
          onClick={() => { sound.playClick(); onViewAll && onViewAll(); }}
          className="text-xs font-bold text-purple-600 hover:text-purple-500 transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--tag-bg)] border border-[var(--tag-border)] text-xs font-semibold">
        {['All', 'Important', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => { sound.playClick(); setFilter(tab); }}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
              filter === tab
                ? 'bg-purple-600 text-white shadow-sm font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="py-8 flex flex-col items-center gap-2 text-center">
          <AlertCircle className="w-7 h-7 text-[var(--text-muted)]" />
          <p className="text-xs font-semibold text-[var(--text-secondary)]">No tasks yet</p>
          <p className="text-[10px] text-[var(--text-muted)]">Add tasks using the form or ⌘K</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <p className="text-xs text-center text-[var(--text-muted)] py-4">No tasks in this filter</p>
      ) : (
        <div className="space-y-1.5">
          {filteredTasks.slice(0, 6).map((t) => (
            <div
              key={t.id}
              onClick={() => { sound.playComplete(); onToggleComplete && onToggleComplete(t.id); }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl border-l-2 hover:bg-[var(--bg-input)] transition-all cursor-pointer group ${
                PRIORITY_COLOR[t.priority] || 'border-l-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  className={`p-0.5 rounded-full transition-colors shrink-0 ${
                    t.isCompleted ? 'text-emerald-500' : 'text-[var(--text-muted)] group-hover:text-purple-600'
                  }`}
                >
                  {t.isCompleted
                    ? <CheckCircle2 className="w-4.5 h-4.5" />
                    : <Circle className="w-4.5 h-4.5" />
                  }
                </button>
                <span className={`text-xs font-semibold truncate ${
                  t.isCompleted
                    ? 'line-through text-[var(--text-muted)]'
                    : 'text-[var(--text-primary)]'
                }`}>
                  {t.title}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-secondary)] shrink-0 ml-2">
                {formatHour(t.assignedHourSlot)}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
