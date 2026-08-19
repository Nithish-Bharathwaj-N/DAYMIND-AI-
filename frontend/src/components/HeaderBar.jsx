import React from 'react';
import { Search, Bell, Sun, Moon, Calendar as CalendarIcon } from 'lucide-react';
import { sound } from '../utils/audio';
import { getTodayFormatted } from '../utils/dateUtils';

export default function HeaderBar({ isDarkMode, onToggleDarkMode, onOpenCommandBar }) {
  const todayString = getTodayFormatted();

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      
      {/* Greeting Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] flex items-center gap-2">
          Good Morning, Nithish! <span className="animate-bounce inline-block">👋</span>
        </h1>
        <div className="flex items-center gap-3 mt-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-mono font-bold">
            <CalendarIcon className="w-3 h-3 text-purple-500" />
            {todayString}
          </span>
          <span className="text-xs text-[var(--text-secondary)] font-medium">
            Stay consistent, small progress leads to big results.
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        
        {/* Search Bar */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenCommandBar && onOpenCommandBar(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-500/10 hover:bg-slate-500/15 border border-[var(--border-color)] text-xs text-[var(--text-secondary)] transition-all cursor-pointer w-full md:w-64"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="truncate">Search tasks, events, notes...</span>
          <kbd className="ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-500/20 text-slate-400">⌘K</kbd>
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => sound.playClick()}
          className="relative p-2.5 rounded-2xl bg-slate-500/10 hover:bg-slate-500/15 border border-[var(--border-color)] text-[var(--text-primary)] transition-all cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-purple-600 text-white font-mono text-[9px] font-bold flex items-center justify-center border-2 border-[var(--bg-main)]">
            3
          </span>
        </button>



      </div>

    </header>
  );
}
