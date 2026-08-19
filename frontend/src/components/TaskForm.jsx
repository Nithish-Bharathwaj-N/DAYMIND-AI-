import React, { useState } from 'react';
import { Zap, AlertTriangle, Calculator, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'ACADEMIC', label: 'Academic', mult: 1.25, badge: '+25% Bias', color: 'border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10' },
  { id: 'WORK', label: 'Work', mult: 1.15, badge: '+15% Bias', color: 'border-cyan-500/40 text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10' },
  { id: 'HEALTH', label: 'Health', mult: 1.30, badge: '+30% Bias', color: 'border-emerald-500/40 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' },
  { id: 'PERSONAL', label: 'Personal', mult: 0.95, badge: '-5% Adj', color: 'border-slate-400/40 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-500/10' },
  { id: 'LEARNING', label: 'Learning', mult: 1.20, badge: '+20% Ramp', color: 'border-purple-500/40 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/10' },
  { id: 'URGENT', label: 'Urgent', mult: 1.00, badge: 'Preempt', color: 'border-red-500/40 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TaskForm({ onTaskCreated, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('ACADEMIC');
  const [priority, setPriority] = useState('MEDIUM');
  const [userEstimatedMinutes, setUserEstimatedMinutes] = useState(60);
  const [assignedHourSlot, setAssignedHourSlot] = useState(9);
  const [dayOfWeek, setDayOfWeek] = useState('Monday');

  const selectedCat = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const predictedMinutes = Math.round(userEstimatedMinutes * selectedCat.mult);

  const handleSubmit = (e, forceUrgent = false) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskPayload = {
      title: title.trim(),
      rawPrompt: title.trim(),
      userEstimatedMinutes: Number(userEstimatedMinutes),
      assignedHourSlot: Number(assignedHourSlot),
      dayOfWeek,
      category: forceUrgent ? 'URGENT' : category,
      priority: forceUrgent ? 'URGENT' : priority,
    };

    onTaskCreated(taskPayload);
    setTitle('');
  };

  return (
    <div className="glass-card p-6 mb-6 relative overflow-hidden shadow-lg">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[var(--text-primary)]">Schedule Task with AI Engine</h2>
            <p className="text-[11px] text-[var(--text-secondary)] font-medium">Polymorphic Duration Bias Correction · Smart Slot Allocation</p>
          </div>
        </div>
        <div className="hidden sm:block text-[10px] font-mono text-purple-700 dark:text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 font-bold">
          Factory Pattern Active
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
        
        {/* Task Title */}
        <div>
          <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
            Task Description / Subject
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Prepare Spring Boot lecture notes, Complete design sprint..."
            required
            className="theme-input py-3 text-sm"
          />
        </div>

        {/* Category Pills */}
        <div>
          <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
            Polymorphic Subclass Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex flex-col justify-between cursor-pointer hover:scale-[1.02] ${
                  category === cat.id
                    ? `${cat.color} ring-2 ring-amber-500/30 scale-[1.02]`
                    : 'bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-purple-500/40 hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] font-mono mt-1 opacity-80">{cat.badge}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Priority, Day, Hour, Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="theme-input">
              <option value="LOW">Low (Weight 0.25)</option>
              <option value="MEDIUM">Medium (Weight 0.50)</option>
              <option value="HIGH">High (Weight 0.75)</option>
              <option value="URGENT">Urgent Preempt (1.00)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Target Day</label>
            <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} className="theme-input">
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Hour Slot</label>
            <select value={assignedHourSlot} onChange={(e) => setAssignedHourSlot(Number(e.target.value))} className="theme-input">
              {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((hour) => (
                <option key={hour} value={hour}>
                  {hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Est. Duration (mins)</label>
            <input
              type="number" min="10" max="480"
              value={userEstimatedMinutes}
              onChange={(e) => setUserEstimatedMinutes(Math.max(10, Number(e.target.value)))}
              className="theme-input font-mono"
            />
          </div>
        </div>

        {/* Polymorphic Bias Calculator */}
        <div className="p-3.5 rounded-xl bg-[var(--bg-input)] border border-purple-500/25 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Calculator className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <div>
              <span className="text-[var(--text-secondary)]">AI Duration Prediction: </span>
              <span className="text-[var(--text-primary)] font-mono font-bold">{userEstimatedMinutes}m</span>
              <span className="text-[var(--text-secondary)]"> × {selectedCat.mult}x ({selectedCat.label}) = </span>
              <span className="text-amber-600 dark:text-amber-400 font-mono font-black text-sm">{predictedMinutes}m</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 font-mono text-[10px] border border-purple-500/20 font-bold shrink-0">
            {selectedCat.badge}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting || !title.trim()}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/25 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Add Urgent (Dynamic Replan)</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white dark:text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isSubmitting ? 'Scheduling...' : 'Schedule Task (AI Engine)'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
