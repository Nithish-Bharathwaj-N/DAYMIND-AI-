import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Circle, Users, FileText, Bell, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

export default function RemindersWidget({ onOpenQuickCapture, onViewAllMeetings, lastMeetingResult }) {
  const [actionItems, setActionItems] = useState([]);
  const [meetingTitle, setMeetingTitle] = useState(null);
  const [meetingSummary, setMeetingSummary] = useState(null);
  const [keyPoints, setKeyPoints] = useState([]);

  // When parent passes new meeting analysis result, update
  useEffect(() => {
    if (lastMeetingResult) {
      setMeetingTitle(lastMeetingResult.meetingTitle || 'Recent Meeting');
      setMeetingSummary(lastMeetingResult.summary || null);
      setKeyPoints(lastMeetingResult.keyPoints || []);
      const items = (lastMeetingResult.actionItems || []).slice(0, 3).map((item, i) => ({
        id: i + 1,
        title: item.task || item.title || 'Action item',
        owner: item.owner || 'You',
        date: item.dueDate || item.due || 'TBD',
        completed: false,
      }));
      setActionItems(items);
    } else {
      // Try to fetch latest meeting from backend
      fetch('http://localhost:8080/api/meetings')
        .then(r => r.json())
        .then(data => {
          if (data.success && data.meetings && data.meetings.length > 0) {
            const latest = data.meetings[data.meetings.length - 1];
            setMeetingTitle(latest.title);
            setMeetingSummary(latest.summary || null);
          }
        })
        .catch(() => {});
    }
  }, [lastMeetingResult]);

  const toggleItem = (id) => {
    sound.playComplete();
    setActionItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const hasMeetingData = meetingTitle || actionItems.length > 0;

  return (
    <div className="space-y-4">
      
      {/* Meeting Summary Card */}
      <div className="ui-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[var(--text-primary)]">Meeting Summary</h3>
          <button
            onClick={() => { sound.playClick(); onViewAllMeetings && onViewAllMeetings(); }}
            className="text-xs font-bold text-purple-600 hover:text-purple-500 transition-colors cursor-pointer"
          >
            View all
          </button>
        </div>

        {!hasMeetingData ? (
          <div className="py-5 flex flex-col items-center gap-2 text-center">
            <AlertCircle className="w-7 h-7 text-[var(--text-muted)]" />
            <p className="text-xs font-semibold text-[var(--text-secondary)]">No meeting analyzed yet</p>
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
              Go to Meetings → paste a transcript → click Analyze Meeting
            </p>
            <button
              onClick={() => { sound.playClick(); onViewAllMeetings && onViewAllMeetings(); }}
              className="mt-1 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-500/20 hover:bg-purple-500/15 transition-all cursor-pointer"
            >
              Analyze a Meeting →
            </button>
          </div>
        ) : (
          <>
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">{meetingTitle}</div>
            </div>

            {meetingSummary && (
              <div className="p-3 rounded-xl bg-purple-500/8 border border-purple-500/15 text-xs font-medium text-[var(--text-primary)] space-y-1">
                <div className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-300 flex items-center gap-1 mb-1.5">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>AI Summary</span>
                </div>
                <p className="leading-relaxed text-[var(--text-secondary)]">{meetingSummary}</p>
              </div>
            )}

            {keyPoints.length > 0 && (
              <div className="space-y-1 text-xs">
                <span className="font-bold text-[var(--text-primary)] block text-[11px]">Key Points</span>
                <ul className="space-y-1 text-[11px] text-[var(--text-secondary)] font-medium list-disc list-inside">
                  {keyPoints.slice(0, 3).map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {actionItems.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
                <span className="font-bold text-[var(--text-primary)] block text-[11px]">Action Items</span>
                <div className="space-y-2">
                  {actionItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className="flex items-start gap-2.5 text-xs cursor-pointer group"
                    >
                      <button className={`mt-0.5 shrink-0 transition-colors ${item.completed ? 'text-emerald-500' : 'text-[var(--text-muted)] group-hover:text-purple-600'}`}>
                        {item.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                      </button>
                      <div>
                        <span className={`font-semibold ${item.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[var(--text-secondary)] font-mono block">
                          — {item.owner} <span className="opacity-70">(Due {item.date})</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick Capture */}
      <div className="ui-card p-5 space-y-3">
        <h3 className="text-sm font-extrabold text-[var(--text-primary)]">Quick Capture</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Task', icon: CheckCircle2, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
            { label: 'Note', icon: FileText, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
            { label: 'Meeting', icon: Users, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
            { label: 'Reminder', icon: Bell, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
          ].map((qc) => {
            const Icon = qc.icon;
            return (
              <button
                key={qc.label}
                onClick={() => { sound.playClick(); onOpenQuickCapture && onOpenQuickCapture(qc.label); }}
                className="p-3 rounded-2xl bg-[var(--bg-input)] hover:bg-[var(--accent-purple-light)] border border-[var(--border-color)] hover:border-purple-500/30 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
              >
                <div className={`p-2 rounded-xl ${qc.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-[var(--text-primary)]">{qc.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
