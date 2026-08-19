import React, { useState, useEffect } from 'react';
import { Sparkles, X, CheckCircle2, ArrowRight, Loader2, Zap, AlertTriangle } from 'lucide-react';
import { sound } from '../utils/audio';

const API = 'http://localhost:8080';

/**
 * OptimizeDayModal — Self-healing schedule optimization.
 * Calls POST /api/schedule/optimize-full which uses real task names from the DB.
 * Shows an animated step-by-step audit log of what moved where and why.
 */
export default function OptimizeDayModal({ isOpen, onClose, onApplyChanges }) {
  const [phase, setPhase] = useState('idle'); // idle | loading | results | done
  const [result, setResult] = useState(null);
  const [visibleChanges, setVisibleChanges] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setPhase('idle');
      setResult(null);
      setVisibleChanges([]);
      setError(null);
    }
  }, [isOpen]);

  const runOptimization = async () => {
    setPhase('loading');
    setError(null);
    sound.playClick();

    try {
      const res = await fetch(`${API}/api/schedule/optimize-full`, { method: 'POST' });
      const data = await res.json();
      setResult(data);
      setPhase('results');
      setVisibleChanges([]);

      // Animate changes appearing one by one
      if (data.changes && data.changes.length > 0) {
        for (let i = 0; i < data.changes.length; i++) {
          await new Promise(r => setTimeout(r, 380));
          setVisibleChanges(prev => [...prev, data.changes[i]]);
          sound.playPreempt && sound.playPreempt();
        }
      }
    } catch (err) {
      setError('Could not reach backend. Ensure Spring Boot is running on port 8080.');
      setPhase('idle');
    }
  };

  const handleApply = () => {
    sound.playComplete();
    setPhase('done');
    onApplyChanges && onApplyChanges();
    setTimeout(onClose, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="glass-modal-overlay" onClick={onClose}>
      <div
        className="glass-modal-content w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[var(--text-primary)]">Self-Healing Optimizer</h2>
              <p className="text-[11px] text-[var(--text-secondary)] font-medium">AI reschedules tasks to peak focus windows</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Idle State */}
          {phase === 'idle' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/20">
                <p className="text-sm font-semibold text-purple-800 dark:text-purple-300 leading-relaxed">
                  The optimizer analyzes your real scheduled tasks, identifies conflicts,
                  and moves flexible low-priority items into peak focus windows (9–11 AM, 2–4 PM)
                  while protecting your URGENT and HIGH priority work.
                </p>
              </div>

              {/* How it works */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-[var(--text-secondary)] uppercase tracking-wider">How it works</h3>
                {[
                  { icon: '🔒', label: 'Lock URGENT + HIGH tasks in place', color: 'text-red-600' },
                  { icon: '📊', label: 'Score remaining tasks by flexibility', color: 'text-purple-600' },
                  { icon: '⚡', label: 'Move flexible tasks to peak focus hours', color: 'text-amber-600' },
                  { icon: '📝', label: 'Return full audit log of changes', color: 'text-blue-600' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)]">
                    <span className="text-lg">{item.icon}</span>
                    <span className={`text-xs font-semibold ${item.color}`}>{item.label}</span>
                  </div>
                ))}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <p className="text-xs font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={runOptimization}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Run Self-Healing Optimizer
              </button>
            </div>
          )}

          {/* Loading */}
          {phase === 'loading' && (
            <div className="py-12 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-extrabold text-[var(--text-primary)]">Analyzing schedule...</p>
                <p className="text-xs text-[var(--text-secondary)]">Scoring flexibility, locking priorities, finding peak slots</p>
              </div>
            </div>
          )}

          {/* Results */}
          {phase === 'results' && result && (
            <div className="space-y-5">
              {/* Status badge */}
              <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
                result.changesCount > 0
                  ? 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-500/20'
                  : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/20'
              }`}>
                <span className="text-2xl">{result.changesCount > 0 ? '✨' : '✅'}</span>
                <div>
                  <div className={`text-sm font-extrabold ${result.changesCount > 0 ? 'text-purple-700 dark:text-purple-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                    {result.status === 'ALREADY_OPTIMAL' ? 'Schedule Already Optimal!' : `${result.changesCount} Task${result.changesCount !== 1 ? 's' : ''} Rescheduled`}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-snug">{result.explanation}</p>
                </div>
              </div>

              {/* Audit log of changes */}
              {result.changes && result.changes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold text-[var(--text-secondary)] uppercase tracking-wider">
                    Rescheduling Audit Log
                  </h3>
                  {visibleChanges.map((change, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] space-y-2"
                      style={{ animation: 'slideDown 0.3s ease-out' }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[var(--text-primary)] truncate flex-1">
                          {change.taskTitle}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          change.priority === 'LOW' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' :
                          change.priority === 'MEDIUM' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600' :
                          'bg-amber-50 dark:bg-amber-950/30 text-amber-600'
                        }`}>
                          {change.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="px-2 py-1 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 border border-red-200/50 dark:border-red-800/30 font-bold">
                          {change.fromSlot}
                        </span>
                        <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                        <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-200/50 dark:border-emerald-800/30 font-bold">
                          {change.toSlot}
                        </span>
                      </div>
                      <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">{change.reason}</p>
                    </div>
                  ))}

                  {/* Loading indicator for remaining changes */}
                  {visibleChanges.length < result.changes.length && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)]">
                      <Loader2 className="w-3.5 h-3.5 text-purple-600 animate-spin" />
                      <span className="text-xs text-[var(--text-secondary)]">Processing changes...</span>
                    </div>
                  )}
                </div>
              )}

              {/* Apply button */}
              {visibleChanges.length === result.changes.length && (
                <button
                  onClick={handleApply}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {result.changesCount > 0 ? 'Apply Changes & Refresh' : 'Got it — Schedule is Optimal'}
                </button>
              )}
            </div>
          )}

          {/* Done */}
          {phase === 'done' && (
            <div className="py-8 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-sm font-extrabold text-[var(--text-primary)]">Schedule Updated!</p>
              <p className="text-xs text-[var(--text-secondary)]">Your tasks have been moved to peak focus windows.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
