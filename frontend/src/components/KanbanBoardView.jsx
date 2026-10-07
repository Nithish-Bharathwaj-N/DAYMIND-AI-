import React from 'react';
import { Clock, CheckCircle2, Trash2, Play, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

const CATEGORY_META = {
  ACADEMIC: { label: 'Academic', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  WORK:     { label: 'Work',     color: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
  HEALTH:   { label: 'Health',   color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  PERSONAL: { label: 'Personal', color: 'bg-slate-100 text-slate-800 border-slate-200' },
  LEARNING: { label: 'Learning', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  URGENT:   { label: 'Urgent',   color: 'bg-red-50 text-red-800 border-red-200' },
  OTHER:    { label: 'Other',    color: 'bg-slate-100 text-slate-800 border-slate-200' },
};

const PRIORITY_DOT = {
  URGENT:   'bg-red-500',
  HIGH:     'bg-amber-500',
  MEDIUM:   'bg-blue-500',
  LOW:      'bg-slate-400',
};

export default function KanbanBoardView({ tasks = [], onToggleComplete, onDeleteTask, onOpenFocusTimer, onSelectTask }) {
  const pendingTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);

  const TaskCard = ({ task, isDone = false }) => {
    const meta = CATEGORY_META[task.category] || CATEGORY_META.OTHER;
    const priorityDot = PRIORITY_DOT[task.priority] || PRIORITY_DOT.MEDIUM;

    return (
      <div
        onClick={() => { sound.playClick(); onSelectTask && onSelectTask(task); }}
        className={`p-4 rounded-xl border transition-all shadow-sm hover:shadow-md cursor-pointer group space-y-2.5 ${
          isDone
            ? 'bg-emerald-50/50 border-emerald-200 opacity-80'
            : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-purple-300 hover:scale-[1.01]'
        }`}
      >
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${priorityDot}`} />
            <h4 className={`text-xs font-bold leading-snug ${
              isDone ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)] group-hover:text-purple-600'
            } transition-colors truncate`}>
              {task.title}
            </h4>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${meta.color}`}>
            {meta.label}
          </span>
        </div>

        {/* Time info */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-secondary)]">
          <Clock className="w-3 h-3 shrink-0" />
          <span>
            {task.assignedHourSlot ? `${task.assignedHourSlot}:00` : '—'}
            {' '}&bull;{' '}
            <span className="line-through text-[var(--text-muted)]">{task.userEstimatedMinutes}m</span>
            {' '}→ <span className="font-bold text-purple-700">{task.predictedDurationMinutes}m</span>
          </span>
        </div>

        {task.biasCorrectionNotice && (
          <div className="text-[10px] font-mono text-amber-700 font-medium">
            ⚡ {task.biasCorrectionNotice}
          </div>
        )}

        {/* Actions */}
        {!isDone && (
          <div
            className="flex items-center justify-between pt-2 border-t border-[var(--border-color)] text-xs"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => { sound.playClick(); onOpenFocusTimer && onOpenFocusTimer(task); }}
              className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-purple-600 text-purple-600" />
              <span>Focus HUD</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { sound.playComplete(); onToggleComplete && onToggleComplete(task.id); }}
                className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Done</span>
              </button>
              <button
                onClick={() => { sound.playDelete(); onDeleteTask && onDeleteTask(task.id); }}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {isDone && (
          <div
            className="flex items-center justify-between pt-2 border-t border-[var(--border-color)] text-xs"
            onClick={e => e.stopPropagation()}
          >
            <span className="text-[10px] font-mono font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
            </span>
            <button
              onClick={() => { sound.playClick(); onToggleComplete && onToggleComplete(task.id); }}
              className="text-[10px] font-bold text-[var(--text-muted)] hover:text-purple-600 transition-colors cursor-pointer"
            >
              Undo
            </button>
          </div>
        )}
      </div>
    );
  };

  const EmptyColumn = ({ message, hint }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-2 border border-dashed border-[var(--border-color)] rounded-xl">
      <AlertCircle className="w-7 h-7 text-[var(--text-muted)]" />
      <p className="text-xs font-semibold text-[var(--text-secondary)]">{message}</p>
      {hint && <p className="text-[10px] text-[var(--text-muted)]">{hint}</p>}
    </div>
  );

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
        <div>
          <h2 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            Task Focus Board
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--tag-bg)] text-[var(--text-secondary)] border border-[var(--tag-border)] font-bold">
              Kanban View
            </span>
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">Manage tasks, launch Deep Focus, and track accomplishments</p>
        </div>
        <div className="text-[11px] font-mono text-[var(--text-secondary)] font-medium">
          {pendingTasks.length} Pending &bull; {completedTasks.length} Done
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Pending Column */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="font-bold text-[var(--text-primary)] text-sm">📌 Pending & Scheduled</h3>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {pendingTasks.length}
            </span>
          </div>
          <div className="space-y-3 min-h-[200px]">
            {pendingTasks.length === 0
              ? <EmptyColumn message="No pending tasks" hint="Use the form above or ⌘K to add tasks" />
              : pendingTasks.map(t => <TaskCard key={t.id} task={t} />)
            }
          </div>
        </div>

        {/* Completed Column */}
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-[var(--text-primary)] text-sm">✓ Accomplished</h3>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {completedTasks.length}
            </span>
          </div>
          <div className="space-y-3 min-h-[200px]">
            {completedTasks.length === 0
              ? <EmptyColumn message="No completed tasks yet" hint="Mark tasks done to see them here" />
              : completedTasks.map(t => <TaskCard key={t.id} task={t} isDone />)
            }
          </div>
        </div>

      </div>
    </div>
  );
}
