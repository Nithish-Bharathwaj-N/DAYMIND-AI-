import React, { useState, useEffect } from 'react';
import { Terminal, Sparkles, X, ArrowRight, CornerDownLeft, Zap, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

export default function CommandBar({ isOpen, onClose, onTaskCreated, onGenerateRoadmap }) {
  const [prompt, setPrompt] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        sound.playClick();
        onClose(!isOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExecute = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    sound.playClick();
    const input = prompt.trim();
    const lower = input.toLowerCase();

    // Natural Language Parsing Logic
    if (lower.includes('roadmap') || lower.includes('plan') || lower.includes('course') || lower.includes('learn')) {
      if (onGenerateRoadmap) {
        onGenerateRoadmap(input);
        setFeedback('✨ AI Prompt parsed: Synthesizing multi-day learning roadmap...');
        setTimeout(() => {
          setPrompt('');
          setFeedback(null);
          onClose(false);
        }, 1200);
        return;
      }
    }

    // Determine category
    let category = 'WORK';
    if (lower.includes('academic') || lower.includes('java') || lower.includes('study') || lower.includes('exam')) category = 'ACADEMIC';
    if (lower.includes('health') || lower.includes('gym') || lower.includes('workout')) category = 'HEALTH';
    if (lower.includes('urgent') || lower.includes('crash') || lower.includes('emergency') || lower.includes('fix')) category = 'URGENT';
    if (lower.includes('personal') || lower.includes('buy') || lower.includes('clean')) category = 'PERSONAL';

    // Determine day
    let dayOfWeek = 'Monday';
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach((d) => {
      if (lower.includes(d)) dayOfWeek = d.charAt(0).toUpperCase() + d.slice(1);
    });

    // Determine duration
    let duration = 60;
    const durMatch = lower.match(/(\d+)\s*(mins?|minutes?|hrs?|hours?)/);
    if (durMatch) {
      const val = parseInt(durMatch[1], 10);
      if (durMatch[2].startsWith('h')) duration = val * 60;
      else duration = val;
    }

    // Determine hour slot
    let hourSlot = 10;
    const slotMatch = lower.match(/(\d{1,2})\s*(am|pm)/);
    if (slotMatch) {
      let h = parseInt(slotMatch[1], 10);
      if (slotMatch[2] === 'pm' && h < 12) h += 12;
      hourSlot = h;
    }

    const taskPayload = {
      title: input,
      rawPrompt: input,
      userEstimatedMinutes: duration,
      assignedHourSlot: hourSlot,
      dayOfWeek,
      category,
      priority: category === 'URGENT' ? 'URGENT' : 'HIGH',
    };

    onTaskCreated(taskPayload);
    setFeedback(`✨ AI Command Parsed: Created ${category} task on ${dayOfWeek} at ${hourSlot}:00.`);
    
    setTimeout(() => {
      setPrompt('');
      setFeedback(null);
      onClose(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 glass-modal-overlay animate-slide-down">
      <div className="glass-modal-content w-full max-w-2xl p-4 md:p-6 relative border border-amber-500/40 shadow-2xl space-y-4">
        
        {/* Close Button */}
        <button
          onClick={() => onClose(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-[var(--bg-input)] hover:bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Command Bar Header */}
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span>DayMind AI Natural Language Command Terminal</span>
          <span className="ml-auto text-[var(--text-muted)] text-[11px]">Press ESC to close</span>
        </div>

        {/* Form Input */}
        <form onSubmit={handleExecute} className="relative">
          <div className="relative flex items-center">
            <Sparkles className="w-5 h-5 text-purple-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Schedule 90 mins of Java JPA research on Wednesday at 10 AM..."
              autoFocus
              className="w-full bg-[var(--bg-input)] border border-amber-500/40 rounded-2xl pl-12 pr-24 py-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="absolute right-3 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <span>Execute</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* AI Command Feedback Banner */}
        {feedback && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono flex items-center gap-2 animate-slide-down">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Quick Example Prompts */}
        <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
          <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Try typing:</div>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              'Schedule 60 mins of Core Java Study on Monday at 9 AM',
              'Emergency fix for production database on Tuesday at 11 AM',
              'Generate a 5 day Cyber Security learning plan',
            ].map((ex, i) => (
              <button
                key={i}
                onClick={() => setPrompt(ex)}
                className="px-3 py-1.5 rounded-xl bg-[var(--bg-input)] hover:bg-[var(--bg-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-amber-500/30 text-[11px] font-mono transition-all cursor-pointer"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
