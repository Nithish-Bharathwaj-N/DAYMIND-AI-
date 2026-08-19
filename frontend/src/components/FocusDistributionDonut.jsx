import React from 'react';

export default function FocusDistributionDonut({ tasks = [] }) {
  // Calculate breakdown from tasks
  const workMins = tasks.filter((t) => t.category === 'WORK' || t.category === 'URGENT').reduce((sum, t) => sum + (t.predictedDurationMinutes || 60), 0);
  const learnMins = tasks.filter((t) => t.category === 'LEARNING' || t.category === 'ACADEMIC').reduce((sum, t) => sum + (t.predictedDurationMinutes || 60), 0);
  const meetingMins = tasks.filter((t) => t.category === 'MEETING').reduce((sum, t) => sum + (t.predictedDurationMinutes || 45), 0) || 90;
  const personalMins = tasks.filter((t) => t.category === 'PERSONAL' || t.category === 'HEALTH').reduce((sum, t) => sum + (t.predictedDurationMinutes || 45), 0) || 90;

  const totalMins = workMins + learnMins + meetingMins + personalMins;
  const totalHours = Math.max(1, Math.round(totalMins / 60));

  const data = [
    { label: 'Deep Work', percent: totalMins > 0 ? Math.round((workMins / totalMins) * 100) : 45, color: '#6c5ce7' },
    { label: 'Learning', percent: totalMins > 0 ? Math.round((learnMins / totalMins) * 100) : 25, color: '#3b82f6' },
    { label: 'Meetings', percent: totalMins > 0 ? Math.round((meetingMins / totalMins) * 100) : 15, color: '#06b6d4' },
    { label: 'Personal', percent: totalMins > 0 ? Math.round((personalMins / totalMins) * 100) : 15, color: '#f59e0b' },
  ];

  const radius = 40;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="ui-card p-5 space-y-4">
      
      <h3 className="text-sm font-extrabold text-[var(--text-primary)]">Focus Time Distribution</h3>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* SVG Donut */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {data.map((item, index) => {
              const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += item.percent;

              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all hover:opacity-80 cursor-pointer"
                />
              );
            })}
          </svg>

          {/* Donut Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-black text-[var(--text-primary)] leading-none">{totalHours}h</span>
            <span className="text-[9px] text-[var(--text-secondary)] font-semibold uppercase mt-0.5">Total Focus</span>
          </div>
        </div>

        {/* Category Legend */}
        <div className="space-y-2.5 flex-1 w-full">
          {data.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-semibold text-[var(--text-primary)]">{item.label}</span>
              </div>
              <span className="font-mono font-bold text-[var(--text-secondary)]">{item.percent}%</span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
