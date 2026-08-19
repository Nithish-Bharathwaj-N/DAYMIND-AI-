import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Flame, Plus, X, Loader2 } from 'lucide-react';
import { sound } from '../../utils/audio';

const API = 'http://localhost:8080/api/habits';
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  });
}

const EMOJI_OPTIONS = ['✅', '🏃', '📚', '🧘', '💻', '💧', '🎯', '🔥', '⚡', '🌟', '🏆', '🎨', '📝', '🌿'];
const COLOR_OPTIONS = ['#6c5ce7', '#00b894', '#0984e3', '#e17055', '#fd79a8', '#fdcb6e', '#00cec9', '#a29bfe'];

export default function HabitsView() {
  const [habits, setHabits]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(null); // id being toggled
  const [addingHabit, setAddingHabit] = useState(false);
  const [form, setForm] = useState({ name: '', icon: '✅', color: '#6c5ce7', frequency: 'DAILY' });
  const [error, setError] = useState(null);

  const weekDates = getWeekDates();
  const todayStr  = new Date().toISOString().split('T')[0];

  const fetchHabits = useCallback(() => {
    setLoading(true);
    fetch(API)
      .then(r => r.ok ? r.json() : Promise.reject('Server error'))
      .then(data => { if (data.success) setHabits(data.habits || []); })
      .catch(e => setError('Could not load habits — is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchHabits(); }, [fetchHabits]);

  const toggleHabit = async (habitId, dateStr) => {
    setSaving(habitId);
    try {
      sound.playComplete();
      const res = await fetch(`${API}/${habitId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr }),
      });
      const data = await res.json();
      if (data.success) {
        setHabits(prev => prev.map(h => h.id === habitId ? data.habit : h));
      }
    } catch {
      setError('Toggle failed');
    } finally {
      setSaving(null);
    }
  };

  const isDone = (habit, dateStr) => habit.completedDates?.includes(dateStr) ?? false;

  const addHabit = async () => {
    if (!form.name.trim()) return;
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), icon: form.icon, color: form.color, frequency: form.frequency }),
      });
      const data = await res.json();
      if (data.success) {
        setHabits(prev => [data.habit, ...prev]);
        setForm({ name: '', icon: '✅', color: '#6c5ce7', frequency: 'DAILY' });
        setAddingHabit(false);
        sound.playComplete();
      }
    } catch {
      setError('Failed to create habit');
    }
  };

  const removeHabit = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      setHabits(prev => prev.filter(h => h.id !== id));
      sound.playDelete?.();
    } catch {
      setError('Failed to delete habit');
    }
  };

  const todayDone  = habits.filter(h => isDone(h, todayStr)).length;
  const todayTotal = habits.length;
  const bestStreak = habits.reduce((m, h) => Math.max(m, h.currentStreak || 0), 0);
  const weekAvg    = habits.length > 0
    ? Math.round(habits.reduce((s, h) => s + weekDates.filter(d => isDone(h, d)).length, 0) / habits.length)
    : 0;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
    </div>
  );

  return (
    <div className="space-y-6 animate-slide-down">

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-medium flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Header */}
      <div className="ui-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Daily Habits</h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">
              Build consistent routines. Track streaks. Compound your growth.
            </p>
          </div>
          <button
            onClick={() => setAddingHabit(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-all shadow-sm shadow-purple-600/30 cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Habit
          </button>
        </div>

        {/* Add Habit Form */}
        {addingHabit && (
          <div className="mt-4 space-y-3 animate-slide-down p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)]">
            <input
              autoFocus
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              onKeyDown={e => { if (e.key === 'Enter') addHabit(); if (e.key === 'Escape') setAddingHabit(false); }}
              placeholder="Habit name (e.g., Journal, Walk 10k steps...)"
              className="theme-input w-full"
            />
            <div className="flex gap-3 flex-wrap">
              <div>
                <label className="text-[10px] text-[var(--text-muted)] font-bold uppercase mb-1 block">Icon</label>
                <div className="flex flex-wrap gap-1">
                  {EMOJI_OPTIONS.map(e => (
                    <button key={e} onClick={() => setForm(f => ({ ...f, icon: e }))}
                      className={`w-8 h-8 text-lg rounded-lg transition-all cursor-pointer ${form.icon === e ? 'bg-purple-600/20 ring-2 ring-purple-500' : 'hover:bg-[var(--bg-card)]'}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-[var(--text-muted)] font-bold uppercase mb-1 block">Color</label>
                <div className="flex gap-1">
                  {COLOR_OPTIONS.map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                      className={`w-6 h-6 rounded-full cursor-pointer transition-all ${form.color === c ? 'ring-2 ring-offset-1 ring-[var(--text-primary)] scale-110' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-[var(--text-muted)] font-bold uppercase mb-1 block">Frequency</label>
                <select
                  value={form.frequency}
                  onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
                  className="theme-input text-xs py-1.5 h-auto"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKDAYS">Weekdays</option>
                  <option value="WEEKLY">Weekly</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={addHabit} className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-extrabold cursor-pointer hover:bg-purple-500 transition-all">Add</button>
              <button onClick={() => setAddingHabit(false)} className="px-3 py-2 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs font-bold cursor-pointer">Cancel</button>
            </div>
          </div>
        )}

        {/* Today's Progress */}
        <div className="mt-5 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              <span>Today's Progress</span>
              <span className="font-extrabold text-[var(--text-primary)]">{todayDone}/{todayTotal}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-500"
                style={{ width: `${todayTotal > 0 ? (todayDone / todayTotal) * 100 : 0}%` }}
              />
            </div>
          </div>
          {todayDone === todayTotal && todayTotal > 0 && (
            <span className="text-sm animate-bounce">🏆</span>
          )}
        </div>
      </div>

      {/* Habit Grid */}
      {habits.length > 0 ? (
        <div className="ui-card p-5 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left text-xs font-bold text-[var(--text-secondary)] pb-3 pr-4 w-48">Habit</th>
                {DAYS.map((day, i) => {
                  const isToday = weekDates[i] === todayStr;
                  return (
                    <th key={day} className={`text-center text-[11px] font-bold pb-3 w-12 ${isToday ? 'text-purple-600 dark:text-purple-400' : 'text-[var(--text-secondary)]'}`}>
                      {day}
                      {isToday && <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mx-auto mt-0.5" />}
                    </th>
                  );
                })}
                <th className="text-center text-[11px] font-bold pb-3 text-[var(--text-secondary)] w-16">Streak</th>
                <th className="text-center text-[11px] font-bold pb-3 text-[var(--text-secondary)] w-16">Week</th>
                <th className="w-8 pb-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {habits.map(habit => {
                const weekScore = weekDates.filter(d => isDone(habit, d)).length;
                return (
                  <tr key={habit.id} className="group">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg leading-none">{habit.icon}</span>
                        <div>
                          <span className="text-xs font-bold text-[var(--text-primary)] block">{habit.name}</span>
                          <span className="text-[10px] text-[var(--text-muted)]">{habit.frequency?.toLowerCase()}</span>
                        </div>
                      </div>
                    </td>
                    {weekDates.map((dateStr, i) => {
                      const done      = isDone(habit, dateStr);
                      const isToday   = dateStr === todayStr;
                      const isFuture  = dateStr > todayStr;
                      const isLoading = saving === habit.id;
                      return (
                        <td key={i} className="py-3 text-center">
                          <button
                            onClick={() => !isFuture && !isLoading && toggleHabit(habit.id, dateStr)}
                            disabled={isFuture || isLoading}
                            className={`mx-auto w-8 h-8 rounded-xl border transition-all flex items-center justify-center ${
                              done
                                ? 'border-transparent text-white shadow-sm'
                                : isFuture
                                ? 'border-[var(--border-color)] bg-[var(--tag-bg)] opacity-30 cursor-not-allowed'
                                : `border-[var(--border-color)] bg-[var(--bg-input)] hover:border-purple-500/50 cursor-pointer ${isToday ? 'border-purple-500/30' : ''}`
                            }`}
                            style={done ? { backgroundColor: habit.color } : {}}
                          >
                            {done ? <CheckCircle2 className="w-4 h-4" /> : null}
                          </button>
                        </td>
                      );
                    })}
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-extrabold ${habit.currentStreak > 0 ? 'text-amber-500' : 'text-[var(--text-muted)]'}`}>
                        {habit.currentStreak > 0 && <Flame className="w-3.5 h-3.5" />}
                        {habit.currentStreak || 0}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className="text-xs font-bold text-[var(--text-primary)]">{weekScore}/7</span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => removeHabit(habit.id)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="ui-card p-12 text-center space-y-2">
          <p className="text-4xl">🎯</p>
          <p className="text-sm font-extrabold text-[var(--text-primary)]">No habits yet</p>
          <p className="text-xs text-[var(--text-secondary)]">Click "Add Habit" to start building your routine</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Best Streak',   value: `${bestStreak} days`, icon: '🔥' },
          { label: 'Done Today',    value: `${todayDone}/${todayTotal}`, icon: '✅' },
          { label: 'Total Habits',  value: habits.length, icon: '📋' },
          { label: 'Weekly Avg',    value: `${weekAvg}/7`, icon: '📊' },
        ].map(stat => (
          <div key={stat.label} className="ui-card p-5 space-y-2">
            <div className="text-2xl">{stat.icon}</div>
            <div className="text-xl font-black text-[var(--text-primary)]">{stat.value}</div>
            <div className="text-xs text-[var(--text-secondary)] font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
