import React, { useState, useEffect } from 'react';
import { Video, Clock, Users, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

const AVATAR_COLORS = [
  'from-purple-600 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-pink-500 to-rose-500',
];

export default function UpcomingMeetingsWidget({ onViewCalendar }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/meetings')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.meetings)) {
          setMeetings(data.meetings);
        }
      })
      .catch(() => setMeetings([]))
      .finally(() => setLoading(false));
  }, []);

  const BORDER_COLORS = [
    'border-purple-500/30 bg-purple-500/5 dark:bg-purple-950/20',
    'border-blue-500/30 bg-blue-500/5 dark:bg-blue-950/20',
    'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20',
  ];

  return (
    <div className="ui-card p-5 space-y-4">
      
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2">
          <Video className="w-4 h-4 text-purple-600" />
          <span>Upcoming Meetings</span>
        </h3>
        <button
          onClick={() => { sound.playClick(); onViewCalendar && onViewCalendar(); }}
          className="text-xs font-bold text-purple-600 hover:text-purple-500 transition-colors cursor-pointer"
        >
          View Calendar
        </button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800/40 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && meetings.length === 0 && (
        <div className="py-8 flex flex-col items-center gap-2 text-center">
          <AlertCircle className="w-8 h-8 text-[var(--text-muted)]" />
          <p className="text-sm font-semibold text-[var(--text-secondary)]">No meetings scheduled</p>
          <p className="text-xs text-[var(--text-muted)]">Go to the Meetings tab to analyze & schedule meetings</p>
        </div>
      )}

      {!loading && meetings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {meetings.slice(0, 3).map((m, idx) => {
            const initials = (m.title || 'M').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div
                key={m.id || idx}
                onClick={() => sound.playClick()}
                className={`p-3.5 rounded-2xl border ${BORDER_COLORS[idx % 3]} hover:scale-[1.02] transition-all cursor-pointer space-y-2 shadow-sm`}
              >
                <div>
                  <h4 className="text-xs font-extrabold text-[var(--text-primary)] truncate">{m.title}</h4>
                  <div className="text-[10px] font-mono text-[var(--text-secondary)] mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{m.scheduledTime || m.date || 'Scheduled'}</span>
                  </div>
                </div>
                <div className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-300 flex items-center gap-1">
                  <Video className="w-3 h-3 text-purple-500" />
                  <span>{m.platform || 'Google Meet'}</span>
                </div>
                <div className="flex items-center gap-1 pt-1 border-t border-[var(--border-color)]">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {(m.participants || [initials]).slice(0, 3).map((p, i) => (
                      <div
                        key={i}
                        className={`h-5 w-5 rounded-full ring-2 ring-[var(--bg-card)] bg-gradient-to-tr ${AVATAR_COLORS[i % AVATAR_COLORS.length]} text-white font-bold text-[8px] flex items-center justify-center`}
                      >
                        {typeof p === 'string' ? p.slice(0, 2).toUpperCase() : p.name?.slice(0, 2).toUpperCase() || 'MT'}
                      </div>
                    ))}
                  </div>
                  {(m.participants?.length || 1) > 3 && (
                    <span className="text-[9px] font-mono text-[var(--text-muted)] font-bold ml-1">
                      +{(m.participants.length || 1) - 3}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
