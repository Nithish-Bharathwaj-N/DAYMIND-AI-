import React, { useState } from 'react';
import { X, CheckSquare, FileText, Users, Bell, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

export default function QuickCaptureModal({ isOpen, onClose, initialType = 'Task', onTaskCreated }) {
  const [type, setType] = useState(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('WORK');
  const [duration, setDuration] = useState(60);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playComplete();

    if (onTaskCreated) {
      onTaskCreated({
        title,
        rawPrompt: title,
        userEstimatedMinutes: parseInt(duration, 10),
        assignedHourSlot: 10,
        dayOfWeek: 'Monday',
        category,
        priority: 'HIGH'
      });
    }

    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-overlay animate-slide-down">
      <div className="glass-modal-content w-full max-w-md p-6 relative border border-[var(--border-color)] shadow-2xl space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-base font-extrabold text-[var(--text-primary)]">Quick Capture</h2>
        </div>

        {/* Type Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-500/10 text-xs font-semibold">
          {[
            { label: 'Task', icon: CheckSquare },
            { label: 'Note', icon: FileText },
            { label: 'Meeting', icon: Users },
            { label: 'Reminder', icon: Bell }
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = type === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  sound.playClick();
                  setType(item.label);
                }}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  isSelected ? 'bg-purple-600 text-white font-bold shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-[var(--text-secondary)] block mb-1">Title / Description:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Enter ${type.toLowerCase()} details...`}
              autoFocus
              className="w-full p-3 rounded-xl bg-slate-500/10 border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[var(--text-secondary)] block mb-1">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-500/10 border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-xs focus:outline-none"
              >
                <option value="WORK">Work</option>
                <option value="ACADEMIC">Academic</option>
                <option value="HEALTH">Health</option>
                <option value="LEARNING">Learning</option>
                <option value="PERSONAL">Personal</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[var(--text-secondary)] block mb-1">Duration (Mins):</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-500/10 border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-xs focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-all cursor-pointer shadow-md shadow-purple-600/30 disabled:opacity-50"
          >
            Create {type}
          </button>
        </form>

      </div>
    </div>
  );
}
