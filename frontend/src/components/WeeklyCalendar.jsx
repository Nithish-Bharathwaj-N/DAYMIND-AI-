import React, { useState } from 'react';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, Trash2, Zap, Filter } from 'lucide-react';
import { sound } from '../utils/audio';
import { getCurrentDayName } from '../utils/dateUtils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 to 20:00

const CATEGORY_COLORS = {
  ACADEMIC: 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-500/40',
  WORK:     'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-500/40',
  HEALTH:   'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-500/40',
  PERSONAL: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-500/40',
  URGENT:   'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-200 border-red-300 dark:border-red-500/60',
  LEARNING: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-200 border-cyan-300 dark:border-cyan-500/40',
  OTHER:    'bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600',
};

const ENERGY_SLOTS = {
  peak: { hours: [9, 10, 11], label: '⚡ Peak', bg: 'bg-amber-50/50 dark:bg-amber-950/10' },
  work: { hours: [12, 13, 14, 15, 16], label: '🌤️ Focus', bg: 'bg-blue-50/50 dark:bg-blue-950/10' },
};

function getEnergyBadge(hour) {
  if (hour >= 9 && hour <= 11) return '⚡ Deep Focus';
  if (hour >= 12 && hour <= 16) return '🌤️ Peak Work';
  return '🌙 Low Energy';
}

function getSlotBg(hour) {
  if (hour >= 9 && hour <= 11) return 'bg-amber-500/4 dark:bg-amber-950/10';
  return '';
}

export default function WeeklyCalendar({ tasks = [], onToggleComplete, onDeleteTask, onSelectTask }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [weekOffset, setWeekOffset] = useState(0);
  const todayDayName = getCurrentDayName();

  const filteredTasks = tasks.filter(t => selectedCategory === 'ALL' || t.category === selectedCategory);

  const getTaskForSlot = (day, hour) =>
    filteredTasks.find(t => t.dayOfWeek?.toUpperCase() === day.toUpperCase() && t.assignedHourSlot === hour);

  return (
    <div className="space-y-4">

      {/* Controls */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          <span className="text-xs font-mono text-[var(--text-secondary)] flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['ALL', 'ACADEMIC', 'WORK', 'HEALTH', 'LEARNING', 'URGENT'].map((cat) => (
            <button
              key={cat}
              onClick={() => { sound.playClick(); setSelectedCategory(cat); }}
              className={`px-2.5 py-1.5 rounded-lg font-mono text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-[var(--bg-input)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-purple-500/40 hover:text-[var(--text-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Week Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => { sound.playClick(); setWeekOffset(p => p - 1); }}
            className="p-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-purple-500/40 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => { sound.playClick(); setWeekOffset(0); }}
            className="text-xs font-mono font-bold text-[var(--text-primary)] px-3 py-1.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] hover:border-purple-500/40 transition-all cursor-pointer"
          >
            {weekOffset === 0 ? 'This Week' : weekOffset < 0 ? `${Math.abs(weekOffset)}w ago` : `+${weekOffset}w`}
          </button>
          <button
            onClick={() => { sound.playClick(); setWeekOffset(p => p + 1); }}
            className="p-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-purple-500/40 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-main)]">
                <th className="p-3 text-left font-mono text-[10px] font-bold text-[var(--text-secondary)] w-24 border-r border-[var(--border-color)]">
                  Time
                </th>
                {DAYS.map((day) => {
                  const isToday = day === todayDayName && weekOffset === 0;
                  return (
                    <th
                      key={day}
                      className={`p-3 text-center font-mono text-[11px] font-bold border-r border-[var(--border-color)] last:border-r-0 transition-colors ${
                        isToday
                          ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span>{day.slice(0, 3)}</span>
                        {isToday && <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />}
                      </div>
                      <div className={`text-[9px] font-normal mt-0.5 ${isToday ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-[var(--text-muted)]'}`}>
                        {isToday ? '★ Today' : day.slice(0, 3)}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((hour) => {
                const slotBg = getSlotBg(hour);
                return (
                  <tr key={hour} className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-input)] transition-colors ${slotBg}`}>
                    {/* Time Label */}
                    <td className="p-2.5 text-left border-r border-[var(--border-color)] bg-[var(--bg-main)] align-top">
                      <div className="text-[11px] font-mono font-bold text-[var(--text-secondary)]">{hour}:00</div>
                      <div className="text-[9px] font-mono text-[var(--text-muted)] mt-0.5">{getEnergyBadge(hour)}</div>
                    </td>

                    {/* Day Cells */}
                    {DAYS.map((day) => {
                      const task = getTaskForSlot(day, hour);
                      const isToday = day === todayDayName && weekOffset === 0;
                      return (
                        <td
                          key={day}
                          className={`p-1 border-r border-[var(--border-color)] last:border-r-0 h-20 align-top ${
                            isToday ? 'bg-purple-50/40 dark:bg-purple-950/10' : ''
                          }`}
                        >
                          {task ? (
                            <div
                              onClick={() => { sound.playClick(); onSelectTask && onSelectTask(task); }}
                              className={`p-2 rounded-xl border h-full flex flex-col justify-between transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md ${
                                task.isCompleted
                                  ? 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 opacity-60'
                                  : CATEGORY_COLORS[task.category] || CATEGORY_COLORS.OTHER
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1">
                                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase bg-black/8 dark:bg-white/10`}>
                                    {task.category}
                                  </span>
                                  <div className="flex items-center gap-0.5">
                                    <button
                                      onClick={e => { e.stopPropagation(); sound.playComplete(); onToggleComplete && onToggleComplete(task.id); }}
                                      className={`p-0.5 rounded transition-colors cursor-pointer ${task.isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-emerald-600'}`}
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={e => { e.stopPropagation(); sound.playDelete(); onDeleteTask && onDeleteTask(task.id); }}
                                      className="p-0.5 rounded text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                                <div className={`text-[11px] font-bold mt-1 line-clamp-2 leading-tight ${task.isCompleted ? 'line-through' : ''}`}>
                                  {task.title}
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-[9px] font-mono pt-1 border-t border-black/10 dark:border-white/10">
                                <span className="opacity-70">{task.userEstimatedMinutes}m → <strong>{task.predictedDurationMinutes}m</strong></span>
                                <span className="font-bold text-amber-600 dark:text-amber-400">×{task.polymorphicMultiplier}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="empty-slot h-full flex items-center justify-center text-[10px] font-mono opacity-0 hover:opacity-100 transition-opacity">
                              + slot
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
