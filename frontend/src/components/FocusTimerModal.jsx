import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, CheckCircle2, Zap, Sparkles, Save } from 'lucide-react';

const AMBIENT_OPTIONS = [
  { key: 'RAIN',        label: '🌧 Rain',      emoji: '🌧' },
  { key: 'COFFEE_SHOP', label: '☕ Café',       emoji: '☕' },
  { key: 'OCEAN',       label: '🌊 Ocean',     emoji: '🌊' },
  { key: 'WHITE_NOISE', label: '〰️ Noise',     emoji: '〰️' },
  { key: 'SILENCE',     label: '🔇 Silence',   emoji: '🔇' },
];

export default function FocusTimerModal({ isOpen, onClose, task, onCompleteTask }) {
  const plannedMins = task?.predictedDurationMinutes || 25;

  const [secondsLeft, setSecondsLeft] = useState(plannedMins * 60);
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [isActive, setIsActive]       = useState(false);
  const [ambientSound, setAmbientSound] = useState('RAIN');
  const [sessionLogged, setSessionLogged] = useState(false);
  const [logStatus, setLogStatus] = useState(null); // null | 'logging' | 'ok' | 'err'

  const startTimeRef = useRef(null);

  useEffect(() => {
    setSecondsLeft(plannedMins * 60);
    setElapsedSecs(0);
    setIsActive(false);
    setSessionLogged(false);
    setLogStatus(null);
  }, [task]);

  useEffect(() => {
    let timer = null;
    if (isActive && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
        setElapsedSecs(prev => prev + 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, secondsLeft]);

  const toggleTimer = () => {
    if (!isActive && !startTimeRef.current) {
      startTimeRef.current = new Date();
    }
    setIsActive(prev => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(plannedMins * 60);
    setElapsedSecs(0);
    startTimeRef.current = null;
  };

  const logSession = useCallback(async (taskCompleted = false) => {
    if (sessionLogged || elapsedSecs < 30) return; // require at least 30s
    setLogStatus('logging');
    try {
      const res = await fetch('http://localhost:8080/api/focus-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId:       task?.id    ?? null,
          taskTitle:    task?.title ?? 'Free Focus',
          taskCategory: task?.category ?? 'OTHER',
          plannedMinutes: plannedMins,
          actualMinutes:  Math.round(elapsedSecs / 60),
          completed:      taskCompleted,
        }),
      });
      if (res.ok) {
        setSessionLogged(true);
        setLogStatus('ok');
      } else {
        setLogStatus('err');
      }
    } catch {
      setLogStatus('err');
    }
  }, [sessionLogged, elapsedSecs, task, plannedMins]);

  const handleComplete = async () => {
    setIsActive(false);
    await logSession(true);
    onCompleteTask?.(task?.id);
    onClose();
  };

  const handleClose = async () => {
    setIsActive(false);
    if (elapsedSecs >= 30 && !sessionLogged) {
      await logSession(false);
    }
    onClose();
  };

  if (!isOpen) return null;

  const minutes   = Math.floor(secondsLeft / 60);
  const seconds   = secondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const elapsed   = `${Math.floor(elapsedSecs / 60)}m ${elapsedSecs % 60}s`;
  const pct       = Math.max(0, Math.min(100, ((plannedMins * 60 - secondsLeft) / (plannedMins * 60)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-overlay animate-slide-down">
      <div className="glass-modal-content w-full max-w-xl p-6 md:p-8 relative border border-purple-500/30 shadow-2xl text-center space-y-6">

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>AI Deep Focus Timer</span>
          </div>
          <h2 className="text-xl font-black text-white pt-1">
            {task ? task.title : 'Deep Focus Session'}
          </h2>
          <p className="text-xs text-slate-400">
            Category: <span className="text-amber-400 font-bold">{task?.category || 'General'}</span>
            {' '}• Target: <span className="text-purple-300 font-bold">{plannedMins} mins</span>
            {' '}• Elapsed: <span className="text-emerald-400 font-bold">{elapsed}</span>
          </p>
        </div>

        {/* Timer display */}
        <div className="py-8 px-6 rounded-3xl bg-slate-950/90 border border-purple-500/30 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-amber-500/10 opacity-50 pointer-events-none" />

          {/* Circular progress ring */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#6c5ce7" strokeWidth="1.5" strokeDasharray="289" strokeDashoffset={`${289 - (289 * pct / 100)}`} strokeLinecap="round" transform="rotate(-90 50 50)" />
          </svg>

          <div className="text-6xl md:text-7xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-300 to-cyan-400">
            {formatted}
          </div>
          <div className="text-xs font-mono text-slate-400 mt-2">
            {isActive ? '⚡ DEEP FOCUS SESSION ACTIVE' : secondsLeft === 0 ? '✅ SESSION COMPLETE' : 'PAUSED • PRESS START TO BEGIN'}
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-600 to-amber-400 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleTimer}
            className={`px-8 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
            }`}
          >
            {isActive ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5 fill-white" /> Start Focus</>}
          </button>
          <button
            onClick={resetTimer}
            className="p-3 rounded-2xl bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Sound */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <Volume2 className="w-4 h-4 text-purple-400" />
            <span>Ambient Focus Audio</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs flex-wrap">
            {AMBIENT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => setAmbientSound(opt.key)}
                className={`px-3 py-1.5 rounded-xl border font-mono font-bold text-[11px] transition-all cursor-pointer ${
                  ambientSound === opt.key
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                    : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Session log status */}
        {logStatus === 'ok' && (
          <div className="py-2 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Session logged to your productivity history
          </div>
        )}

        {/* Complete Task */}
        {task && onCompleteTask && (
          <div className="pt-2">
            <button
              onClick={handleComplete}
              className="w-full py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Mark Task Complete &amp; Log Session
            </button>
          </div>
        )}

        {!task && elapsedSecs >= 30 && !sessionLogged && (
          <div className="pt-2">
            <button
              onClick={() => logSession(false)}
              disabled={logStatus === 'logging'}
              className="w-full py-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {logStatus === 'logging' ? 'Logging...' : 'Log This Session'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
