import React from 'react';
import { Target, Sparkles } from 'lucide-react';

export default function FocusScoreGauge({ tasks = [] }) {
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalCount = tasks.length > 0 ? tasks.length : 14;
  const percent = totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 80 + 20)) : 78;

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="ui-card p-5 space-y-4">
      
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[var(--text-primary)]">Focus Score</h3>
      </div>

      <div className="flex items-center gap-5">
        
        {/* Ring Gauge */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="rgba(108, 92, 231, 0.15)"
              strokeWidth="10"
            />
            {/* Progress Arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#6c5ce7"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-black text-[var(--text-primary)]">{percent}%</span>
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-1">
          <div className="text-base font-extrabold text-purple-600 dark:text-purple-400">
            {percent >= 70 ? 'Great Focus!' : 'Good Focus!'}
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-medium">
            Keep it up, you're doing awesome! 🚀
          </p>
        </div>

      </div>

    </div>
  );
}
