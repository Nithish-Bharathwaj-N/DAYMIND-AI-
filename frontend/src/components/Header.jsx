import React, { useState } from 'react';
import { Cpu, BookOpen, Sparkles, CheckCircle2, Calendar as CalendarIcon, Database, LayoutGrid, BarChart3, Play, Terminal, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/audio';

export default function Header({ onOpenJavaModal, onOpenWizard, onOpenFocusTimer, onOpenCommandBar, currentView, onViewChange, taskCount = 0 }) {
  const [isMuted, setIsMuted] = useState(false);

  const toggleAudio = () => {
    sound.muted = !isMuted;
    setIsMuted(!isMuted);
    if (!sound.muted) sound.playClick();
  };

  const handleTabClick = (view) => {
    sound.playClick();
    onViewChange(view);
  };

  return (
    <header className="glass-card p-5 mb-6 sticky top-4 z-40 border border-slate-200 shadow-md space-y-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Left Title & System Status */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-purple-600 to-cyan-500 p-0.5 shadow-md shadow-amber-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Cpu className="w-6 h-6 text-purple-600 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                DayMind AI <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 border border-amber-500/30 font-mono font-bold">Java Spring Boot Edition</span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>Dynamic Planning Fallacy Mitigation Engine</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            </p>
          </div>
        </div>

        {/* View Switcher Tabs (Grid View / Kanban Board / AI Analytics) */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
          <button
            onClick={() => handleTabClick('GRID')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'GRID'
                ? 'bg-amber-500 text-white font-black shadow-md shadow-amber-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Weekly Grid</span>
          </button>

          <button
            onClick={() => handleTabClick('KANBAN')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'KANBAN'
                ? 'bg-purple-600 text-white font-black shadow-md shadow-purple-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Focus Board</span>
          </button>

          <button
            onClick={() => handleTabClick('ANALYTICS')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'ANALYTICS'
                ? 'bg-cyan-600 text-white font-black shadow-md shadow-cyan-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>AI Analytics Matrix</span>
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          
          {/* AI Terminal Command Bar Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCommandBar && onOpenCommandBar(true);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-amber-500/10"
            title="Open Natural Language AI Command Terminal (Cmd + K)"
          >
            <Terminal className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Cmd + K</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleAudio}
            className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
            title={isMuted ? 'Unmute UI Sound Effects' : 'Mute UI Sound Effects'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          <button 
            onClick={() => {
              sound.playClick();
              onOpenFocusTimer && onOpenFocusTimer();
            }}
            className="px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Launch Deep Focus HUD"
          >
            <Play className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
            <span className="hidden sm:inline">Focus HUD</span>
          </button>

          <button 
            onClick={() => {
              sound.playClick();
              onOpenWizard();
            }}
            className="px-3.5 py-2.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-700 border border-purple-500/25 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">Roadmap</span>
          </button>

          <button 
            onClick={() => {
              sound.playClick();
              onOpenJavaModal();
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-white" />
            <span>☕ Java Spec</span>
          </button>
        </div>

      </div>
    </header>
  );
}
