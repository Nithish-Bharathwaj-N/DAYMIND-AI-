import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Target, Trash2, Loader2, X, TrendingUp, CheckCircle2, Circle } from 'lucide-react';
import { sound } from '../../utils/audio';

const API = 'http://localhost:8080/api/goals';

const GOAL_CATEGORIES = ['CAREER', 'HEALTH', 'LEARNING', 'PERSONAL', 'ACADEMIC', 'FINANCE'];
const CATEGORY_META = {
  CAREER:   { label: 'Career',       icon: '💼', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25' },
  HEALTH:   { label: 'Health',       icon: '🏃', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25' },
  LEARNING: { label: 'Learning',     icon: '📚', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25' },
  PERSONAL: { label: 'Personal',     icon: '🌟', color: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25' },
  ACADEMIC: { label: 'Academic',     icon: '🎓', color: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/25' },
  FINANCE:  { label: 'Finance',      icon: '💰', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25' },
};

const STATUS_COLORS = {
  ACTIVE:    'bg-emerald-500/10 text-emerald-700 border-emerald-500/25',
  COMPLETED: 'bg-blue-500/10 text-blue-700 border-blue-500/25',
  PAUSED:    'bg-amber-500/10 text-amber-700 border-amber-500/25',
  ABANDONED: 'bg-slate-500/10 text-slate-700 border-slate-500/25',
};

export default function GoalsView({ onShowToast }) {
  const [goals, setGoals]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [error, setError]         = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const [form, setForm] = useState({
    title: '', description: '', category: 'LEARNING',
    targetValue: 10, unit: 'tasks', deadline: '', icon: '🎯'
  });

  const fetchGoals = useCallback(() => {
    setLoading(true);
    fetch(API)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (data.success) setGoals(data.goals || []); })
      .catch(() => setError('Could not load goals — is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const addGoal = async () => {
    if (!form.title.trim()) return;
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          targetValue: Number(form.targetValue) || 10,
          unit: form.unit || 'tasks',
          deadline: form.deadline || null,
          icon: CATEGORY_META[form.category]?.icon || '🎯',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGoals(prev => [data.goal, ...prev]);
        setForm({ title: '', description: '', category: 'LEARNING', targetValue: 10, unit: 'tasks', deadline: '', icon: '🎯' });
        setShowForm(false);
        sound.playComplete?.();
        onShowToast?.('🎯 Goal created!');
      }
    } catch {
      setError('Failed to create goal');
    }
  };

  const updateProgress = async (id, delta) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API}/${id}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      });
      const data = await res.json();
      if (data.success) {
        setGoals(prev => prev.map(g => g.id === id ? data.goal : g));
        sound.playComplete?.();
      }
    } catch {
      setError('Failed to update progress');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      setGoals(prev => prev.filter(g => g.id !== id));
      if (expandedGoal === id) setExpandedGoal(null);
      sound.playDelete?.();
    } catch {
      setError('Failed to delete goal');
    }
  };

  const activeGoals    = goals.filter(g => g.status === 'ACTIVE');
  const completedGoals = goals.filter(g => g.status === 'COMPLETED');
  const avgProgress    = goals.length > 0
    ? Math.round(goals.reduce((s, g) => s + (g.progressPercent || 0), 0) / goals.length)
    : 0;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
    </div>
  );

  return (
    <div className="space-y-6 animate-slide-down">

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-medium flex justify-between">
          {error}
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Header */}
      <div className="ui-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Goals</h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">
              Set ambitious targets. Track real progress. Achieve with AI support.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-all shadow-sm shadow-purple-600/30 cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> New Goal
          </button>
        </div>

        {/* Summary row */}
        <div className="mt-5 grid grid-cols-3 gap-4">
          {[
            { label: 'Active', value: activeGoals.length, icon: '🎯', color: 'text-purple-600' },
            { label: 'Completed', value: completedGoals.length, icon: '✅', color: 'text-emerald-600' },
            { label: 'Avg Progress', value: `${avgProgress}%`, icon: '📊', color: 'text-blue-600' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-xl">{s.icon}</div>
              <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-[var(--text-secondary)]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Goal Form */}
      {showForm && (
        <div className="ui-card p-6 animate-slide-down space-y-4">
          <h3 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-600" /> New Goal
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1 block">Title *</label>
              <input
                autoFocus
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addGoal()}
                placeholder="e.g., Complete 10 DSA problems, Run 5km daily..."
                className="theme-input w-full"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1 block">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Why this goal matters..."
                className="theme-input w-full resize-none"
                rows={2}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="theme-input w-full"
              >
                {GOAL_CATEGORIES.map(c => (
                  <option key={c} value={c}>{CATEGORY_META[c]?.label || c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1 block">Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                className="theme-input w-full"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1 block">Target Value</label>
              <input
                type="number"
                min="1"
                value={form.targetValue}
                onChange={e => setForm(f => ({ ...f, targetValue: e.target.value }))}
                className="theme-input w-full"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1 block">Unit</label>
              <input
                value={form.unit}
                onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                placeholder="tasks, pages, sessions..."
                className="theme-input w-full"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addGoal} className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-extrabold cursor-pointer hover:bg-purple-500 transition-all">
              Create Goal
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs font-bold cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="ui-card p-16 text-center space-y-3">
          <p className="text-5xl">🎯</p>
          <p className="text-sm font-extrabold text-[var(--text-primary)]">No goals yet</p>
          <p className="text-xs text-[var(--text-secondary)]">Set your first goal to start tracking progress</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map(goal => {
            const meta    = CATEGORY_META[goal.category] || CATEGORY_META.PERSONAL;
            const pct     = goal.progressPercent ?? 0;
            const isExp   = expandedGoal === goal.id;
            const isUpdating = updatingId === goal.id;
            const daysLeft = goal.deadline
              ? Math.ceil((new Date(goal.deadline) - new Date()) / 86400000)
              : null;

            return (
              <div
                key={goal.id}
                className={`ui-card p-5 transition-all cursor-pointer ${isExp ? 'ring-2 ring-purple-500' : 'hover:ring-1 hover:ring-purple-500/30'}`}
                onClick={() => setExpandedGoal(isExp ? null : goal.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-purple-500/10">
                    {goal.icon}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-sm font-extrabold text-[var(--text-primary)] leading-tight">{goal.title}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.color}`}>
                            {meta.icon} {meta.label}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[goal.status] || STATUS_COLORS.ACTIVE}`}>
                            {goal.status}
                          </span>
                          {daysLeft !== null && (
                            <span className={`text-[10px] font-bold ${daysLeft < 7 ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                              {daysLeft > 0 ? `⏳ ${daysLeft}d left` : '⚠️ Overdue'}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); deleteGoal(goal.id); }}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
                        <span className="font-medium">{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                        <span className="font-extrabold text-purple-600">{Math.round(pct)}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded actions */}
                {isExp && (
                  <div className="mt-4 pt-4 border-t border-[var(--border-color)] animate-slide-down">
                    {goal.description && (
                      <p className="text-xs text-[var(--text-secondary)] mb-4">{goal.description}</p>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={e => { e.stopPropagation(); updateProgress(goal.id, 1); }}
                        disabled={isUpdating}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
                      >
                        {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <TrendingUp className="w-3 h-3" />}
                        +1 Progress
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); updateProgress(goal.id, -1); }}
                        disabled={isUpdating || goal.currentValue <= 0}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-300 text-xs font-bold cursor-pointer transition-all disabled:opacity-40"
                      >
                        -1 Undo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
