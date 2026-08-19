import React from 'react';
import { X, Cpu, Clock, Zap, CheckCircle2, Trash2, AlertTriangle, Layers, Award, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

export default function TaskDetailModal({ isOpen, onClose, task, onToggleComplete, onDeleteTask, onOptimizeTask }) {
  if (!isOpen || !task) return null;

  return (
    <div className="glass-modal-overlay animate-slide-down">
      <div className="glass-modal-content w-full max-w-lg p-6 md:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-500/10 hover:bg-slate-500/20 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-color)]">
          <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-500 shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 font-bold">
              Subclass: {task.taskType || 'BaseTask'}
            </span>
            <h2 className="text-lg font-extrabold text-[var(--text-primary)] leading-snug mt-1">{task.title}</h2>
          </div>
        </div>

        {/* Java Diagnostics Matrix */}
        <div className="space-y-3 text-xs">
          
          <div className="p-4 rounded-xl bg-slate-500/5 border border-[var(--border-color)] space-y-2">
            <div className="flex justify-between items-center text-[var(--text-secondary)] font-mono">
              <span>Category / Domain:</span>
              <span className="text-amber-500 font-bold">{task.category || 'WORK'}</span>
            </div>
            <div className="flex justify-between items-center text-[var(--text-secondary)] font-mono">
              <span>Priority Rating:</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">{task.priority || 'HIGH'}</span>
            </div>
            <div className="flex justify-between items-center text-[var(--text-secondary)] font-mono">
              <span>Polymorphic Multiplier:</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">{task.polymorphicMultiplier || 1.25}x</span>
            </div>
            <div className="flex justify-between items-center text-[var(--text-secondary)] font-mono">
              <span>Flexibility Score:</span>
              <span className="text-emerald-500 font-bold">{task.flexibilityScore ? task.flexibilityScore.toFixed(3) : '0.333'}</span>
            </div>
            <div className="flex justify-between items-center text-[var(--text-secondary)] font-mono">
              <span>Assigned Slot:</span>
              <span className="text-[var(--text-primary)] font-bold">{task.dayOfWeek || 'Monday'} @ {task.assignedHourSlot || 10}:00</span>
            </div>
          </div>

          {/* Time Calculation Card */}
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 font-mono flex items-center justify-between">
            <div>
              <div className="text-[var(--text-secondary)] text-[11px]">User Estimate vs Java Prediction:</div>
              <div className="text-[var(--text-primary)] font-bold mt-0.5">
                <span className="line-through text-slate-400">{task.userEstimatedMinutes || 60} mins</span> →{' '}
                <span className="text-amber-500 font-extrabold">{task.predictedDurationMinutes || 75} mins</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold text-[10px]">
              +{(task.predictedDurationMinutes || 75) - (task.userEstimatedMinutes || 60)}m Buffer
            </span>
          </div>

          {/* Bias Correction Notice */}
          {task.biasCorrectionNotice && (
            <div className="p-3 rounded-xl bg-slate-500/10 border border-[var(--border-color)] text-[11px] text-[var(--text-secondary)] font-medium">
              {task.biasCorrectionNotice}
            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-end gap-3">
          
          <button
            onClick={() => {
              sound.playPreempt();
              if (onOptimizeTask) onOptimizeTask(task.id);
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>⚡ AI Re-Optimize Slot</span>
          </button>

          <button
            onClick={() => {
              sound.playComplete();
              if (onToggleComplete) onToggleComplete(task.id);
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{task.isCompleted ? 'Mark Incomplete' : 'Mark Completed'}</span>
          </button>

          <button
            onClick={() => {
              sound.playDelete();
              if (onDeleteTask) onDeleteTask(task.id);
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-500 border border-red-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
            <span>Delete</span>
          </button>

        </div>

      </div>
    </div>
  );
}
