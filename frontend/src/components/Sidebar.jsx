import React from 'react';
import { LayoutDashboard, Calendar, CheckSquare, Target, Users, Bot, BarChart2, ShieldCheck, FileText, Crosshair, Settings, Moon, Sun, ChevronRight, Brain, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

export default function Sidebar({ activeTab, onSelectTab, isDarkMode, onToggleDarkMode }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'focus', label: 'Focus Planner', icon: Target },
    { id: 'meetings', label: 'Meetings', icon: Users, badge: 'NEW' },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'insights', label: 'Insights', icon: BarChart2 },
    { id: 'habits', label: 'Habits', icon: ShieldCheck },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'goals', label: 'Goals', icon: Crosshair },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 ui-sidebar min-h-screen p-4 flex flex-col justify-between shrink-0 select-none">
      
      <div className="space-y-6">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight leading-none text-[var(--text-primary)]">
              DayMind AI
            </h1>
            <p className="text-[10px] text-[var(--text-secondary)] font-medium mt-1">
              Plan Smart. Achieve More.
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onSelectTab(item.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-extrabold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-purple-500/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-3 pt-3 border-t border-[var(--border-color)]">
        
        {/* Upgrade to Pro Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-purple-600/15 to-indigo-600/10 border border-purple-500/20 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-purple-600 dark:text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Upgrade to Pro</span>
          </div>
          <p className="text-[10px] text-[var(--text-secondary)] font-medium leading-relaxed">
            Unlock advanced AI insights, unlimited tasks and more.
          </p>
          <button 
            onClick={() => sound.playClick()}
            className="w-full py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold transition-all cursor-pointer shadow-sm shadow-purple-600/30"
          >
            Upgrade Now
          </button>
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-500/5 hover:bg-slate-500/10 transition-all cursor-pointer border border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              NB
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[var(--text-primary)]">Nithish B</div>
              <div className="text-[10px] text-[var(--text-secondary)] font-medium">Premium Plan</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Dark Mode Permanent Indicator */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
          <div className="flex items-center gap-2 text-[11px] font-bold">
            <Moon className="w-3.5 h-3.5 text-purple-400" />
            <span>Dark Mode Active</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        </div>

      </div>

    </aside>
  );
}
