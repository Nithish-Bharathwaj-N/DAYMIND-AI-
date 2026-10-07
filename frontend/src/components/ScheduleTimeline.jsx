import React, { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle2, Trash2, Sparkles, Target, Circle } from 'lucide-react';
import { sound } from '../utils/audio';
import { getTodayShortDate, getCurrentDayName } from '../utils/dateUtils';

const CATEGORY_META = {
  ACADEMIC: { label: 'Academic', color: 'bg-purple-50 text-purple-700 border-purple-200', bar: '#8b5cf6' },
  WORK:     { label: 'Work',     color: 'bg-blue-50 text-blue-700 border-blue-200',       bar: '#3b82f6' },
  HEALTH:   { label: 'Health',   color: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: '#10b981' },
  PERSONAL: { label: 'Personal', color: 'bg-amber-50 text-amber-700 border-amber-200',  bar: '#f59e0b' },
  URGENT:   { label: 'Urgent',   color: 'bg-red-50 text-red-700 border-red-200',          bar: '#ef4444' },
  LEARNING: { label: 'Learning', color: 'bg-cyan-50 text-cyan-700 border-cyan-200',      bar: '#06b6d4' },
  OTHER:    { label: 'Other',    color: 'bg-slate-100 text-slate-700 border-slate-200',  bar: '#64748b' },
};

export default function ScheduleTimeline({ backendTasks = [], onToggleComplete, onDeleteTask, onSelectTask, onOptimizeClick, onStartFocus }) {
  const todayShort = getTodayShortDate();
  const dayName = getCurrentDayName();
  const now = new Date();
  const currentHour = now.getHours();
  const todayISO = new Date().toISOString().split('T')[0];

  // Filter to today's tasks — uses scheduledDate or dayOfWeek matching current day
  const todayTasks = backendTasks.filter(t => {
    if (t.scheduledDate) {
      const d = Array.isArray(t.scheduledDate)
        ? `${t.scheduledDate[0]}-${String(t.scheduledDate[1]).padStart(2,'0')}-${String(t.scheduledDate[2]).padStart(2,'0')}`
        : String(t.scheduledDate);
      if (d.startsWith(todayISO)) return true;
    }
    // Fallback match by dayOfWeek (e.g., "Wednesday")
    return t.dayOfWeek && t.dayOfWeek.toLowerCase() === dayName.toLowerCase();
  });

  const sortedTasks = [...todayTasks].sort((a, b) => a.assignedHourSlot - b.assignedHourSlot);
  const isEmpty = sortedTasks.length === 0;
  const completed = sortedTasks.filter(t => (t.isCompleted || t.completed)).length;
  const progressPct = sortedTasks.length > 0 ? Math.round((completed / sortedTasks.length) * 100) : 0;

  // Identify current active task for Current Focus Hero HUD
  const activeTask = sortedTasks.find(t => !(t.isCompleted || t.completed) && (t.assignedHourSlot === currentHour || t.assignedHourSlot >= currentHour)) || sortedTasks.find(t => !(t.isCompleted || t.completed)) || sortedTasks[0];

  const formatHour = (h) => {
    const suffix = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayH}:00 ${suffix}`;
  };

  const formatEndTime = (h, mins) => {
    const totalMins = h * 60 + (mins || 60);
    const endH = Math.floor(totalMins / 60);
    const endM = totalMins % 60;
    const suffix = endH >= 12 ? 'PM' : 'AM';
    const displayH = endH > 12 ? endH - 12 : endH === 0 ? 12 : endH;
    return `${displayH}:${endM.toString().padStart(2, '0')} ${suffix}`;
  };

  return (
    <div className="ui-card p-6 space-y-5">

      {/* Hero Current Focus HUD Banner */}
      {activeTask && !activeTask.isCompleted && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-slate-100 border border-purple-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm shadow-purple-500/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              <span className="text-[10px] font-mono font-black tracking-wider text-purple-700 uppercase">CURRENT FOCUS · NOW</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 leading-snug">{activeTask.title}</h3>
            <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
              <span>{formatHour(activeTask.assignedHourSlot)} – {formatEndTime(activeTask.assignedHourSlot, activeTask.predictedDurationMinutes)}</span>
              <span>•</span>
              <span className="text-purple-700 font-bold">{activeTask.predictedDurationMinutes || activeTask.userEstimatedMinutes || 60} mins</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-mono font-bold border border-purple-200">
                {activeTask.category || 'WORK'}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onStartFocus && onStartFocus(activeTask);
            }}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Target className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>START FOCUS HUD</span>
          </button>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>Today's Schedule</span>
          </h2>
          <div className="text-[11px] font-mono text-[var(--text-secondary)] mt-0.5 font-semibold">
            {todayShort} • {dayName}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {sortedTasks.length > 0 && (
            <div className="text-right">
              <div className="text-[11px] font-bold text-[var(--text-primary)]">{progressPct}%</div>
              <div className="text-[10px] text-[var(--text-muted)]">done</div>
            </div>
          )}
          <button
            onClick={() => {
              sound.playClick();
              onOptimizeClick && onOptimizeClick();
            }}
            className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 border border-purple-500/30 text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Optimize</span>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {sortedTasks.length > 0 && (
        <div className="h-1 rounded-full bg-[var(--bg-input)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* Empty State */}
      {isEmpty && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
            <Clock className="w-7 h-7 text-purple-500/60" />
          </div>
          <div className="text-sm font-bold text-[var(--text-secondary)]">No tasks scheduled today</div>
          <div className="text-xs text-[var(--text-muted)] max-w-[180px]">
            Add tasks using the Task form or ⌘K command bar
          </div>
        </div>
      )}

      {/* Timeline */}
      {!isEmpty && (
        <div className="space-y-2 relative pl-4 border-l-2 border-slate-200 max-h-[460px] overflow-y-auto pr-2">
          {sortedTasks.map((task) => {
            const isCurrent = task.assignedHourSlot === currentHour;
            const meta = CATEGORY_META[task.category] || CATEGORY_META.OTHER;
            const startTime = formatHour(task.assignedHourSlot);
            const endTime = formatEndTime(task.assignedHourSlot, task.predictedDurationMinutes);

            return (
              <div
                key={task.id}
                onClick={() => {
                  sound.playClick();
                  onSelectTask && onSelectTask(task);
                }}
                className="flex items-start gap-3 group cursor-pointer relative"
              >
                {/* Timeline dot */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playComplete();
                    onToggleComplete && onToggleComplete(task.id);
                  }}
                  className={`-ml-[21px] mt-2.5 w-3 h-3 rounded-full border-2 border-[var(--bg-card)] shrink-0 transition-all cursor-pointer ${
                    (task.isCompleted || task.completed)
                      ? 'bg-emerald-500'
                      : isCurrent
                      ? 'bg-purple-600 ring-4 ring-purple-600/20'
                      : 'bg-slate-300'
                  }`}
                />

                {/* Time */}
                <div className={`w-16 text-[10px] font-mono font-semibold shrink-0 pt-2.5 ${
                  isCurrent ? 'text-purple-600 font-bold' : 'text-[var(--text-muted)]'
                }`}>
                  {startTime}
                </div>

                {/* Card */}
                <div className={`flex-1 p-3 rounded-xl border transition-all group-hover:shadow-sm mb-2 relative overflow-hidden ${
                  (task.isCompleted || task.completed)
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : isCurrent
                    ? 'bg-purple-50/70 border-purple-200 shadow-sm shadow-purple-500/10'
                    : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-purple-300'
                }`}>
                  {/* Left accent bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-full"
                    style={{ backgroundColor: meta.bar, opacity: (task.isCompleted || task.completed) ? 0.3 : 0.8 }}
                  />

                  <div className="flex items-start justify-between gap-2 pl-1">
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-bold leading-snug ${
                        (task.isCompleted || task.completed) ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                      }`}>
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={`tag-chip ${meta.color}`}>{meta.label}</span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {startTime} → {endTime}
                        </span>
                        {isCurrent && !(task.isCompleted || task.completed) && (
                          <span className="text-[10px] font-bold text-purple-600 flex items-center gap-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse inline-block" /> Now
                          </span>
                        )}
                        {task.priority === 'URGENT' && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md border border-red-200">
                            🚨 URGENT
                          </span>
                        )}
                      </div>
                      {task.biasCorrectionNotice && (
                        <div className="mt-1 text-[10px] text-amber-600 font-mono font-medium">
                          ⚡ {task.biasCorrectionNotice}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playComplete();
                          onToggleComplete && onToggleComplete(task.id);
                        }}
                        title={(task.isCompleted || task.completed) ? 'Mark Pending' : 'Mark Done'}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                          (task.isCompleted || task.completed)
                            ? 'text-emerald-500 hover:bg-emerald-500/10'
                            : 'text-[var(--text-muted)] hover:text-emerald-500 hover:bg-emerald-500/10'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playDelete();
                          onDeleteTask && onDeleteTask(task.id);
                        }}
                        title="Delete"
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
        <div className="text-[11px] font-mono text-[var(--text-secondary)] font-medium flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-purple-600" />
          <span>{completed}/{sortedTasks.length} tasks today</span>
        </div>
        {backendTasks.length > todayTasks.length && (
          <div className="text-[10px] text-[var(--text-muted)]">
            +{backendTasks.length - todayTasks.length} more scheduled later
          </div>
        )}
      </div>

    </div>
  );
}
