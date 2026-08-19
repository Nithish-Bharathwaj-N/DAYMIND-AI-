import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Trash2, Search, X, Pin, PinOff, Loader2 } from 'lucide-react';
import { sound } from '../../utils/audio';

const API = 'http://localhost:8080/api/notes';

const NOTE_COLORS = [
  { hex: '#fef9c3', border: 'border-amber-300/50',  bg: 'bg-amber-50 dark:bg-amber-950/20' },
  { hex: '#dbeafe', border: 'border-blue-300/50',   bg: 'bg-blue-50 dark:bg-blue-950/20' },
  { hex: '#f3e8ff', border: 'border-purple-300/50', bg: 'bg-purple-50 dark:bg-purple-950/20' },
  { hex: '#dcfce7', border: 'border-emerald-300/50', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
  { hex: '#ffe4e6', border: 'border-rose-300/50',   bg: 'bg-rose-50 dark:bg-rose-950/20' },
  { hex: '#ffffff', border: 'border-[var(--border-color)]', bg: 'bg-[var(--bg-card)]' },
];

function getColorForNote(note) {
  const colorDef = NOTE_COLORS.find(c => c.hex === note.color) || NOTE_COLORS[NOTE_COLORS.length - 1];
  return colorDef;
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function NotesView({ onShowToast }) {
  const [notes, setNotes]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError]           = useState(null);
  const textareaRef = useRef(null);
  const debounceRef = useRef(null);
  const selectedColorRef = useRef('#ffffff');

  const fetchNotes = useCallback(() => {
    setLoading(true);
    fetch(API)
      .then(r => r.ok ? r.json() : Promise.reject('error'))
      .then(data => { if (data.success) setNotes(data.notes || []); })
      .catch(() => setError('Could not load notes — is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  // Debounced auto-save title + content
  const saveNoteChanges = useCallback(async (id, changes) => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      });
      const data = await res.json();
      if (data.success) {
        setNotes(prev => prev.map(n => n.id === id ? data.note : n));
      }
    } catch {
      setError('Auto-save failed');
    } finally {
      setSaving(false);
    }
  }, []);

  const handleFieldChange = (id, field, value) => {
    // Optimistic local update
    setNotes(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n));
    // Debounce API call
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveNoteChanges(id, { [field]: value }), 600);
  };

  const createNote = async () => {
    sound.playClick?.();
    const colorHex = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)].hex;
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Note', content: '', color: colorHex }),
      });
      const data = await res.json();
      if (data.success) {
        setNotes(prev => [data.note, ...prev]);
        setActiveNote(data.note.id);
        setTimeout(() => textareaRef.current?.focus(), 100);
      }
    } catch {
      setError('Failed to create note');
    }
  };

  const deleteNote = async (id) => {
    sound.playDelete?.();
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      setNotes(prev => prev.filter(n => n.id !== id));
      if (activeNote === id) setActiveNote(null);
    } catch {
      setError('Failed to delete note');
    }
  };

  const togglePin = async (id) => {
    try {
      const res = await fetch(`${API}/${id}/pin`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) setNotes(prev => prev.map(n => n.id === id ? data.note : n));
    } catch {
      setError('Pin failed');
    }
  };

  const searchNotes = async (q) => {
    setSearchQuery(q);
    if (!q.trim()) { fetchNotes(); return; }
    try {
      const res = await fetch(`${API}/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.success) setNotes(data.notes);
    } catch {}
  };

  const active = notes.find(n => n.id === activeNote);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
    </div>
  );

  return (
    <div className="flex gap-5 h-[calc(100vh-10rem)] animate-slide-down">

      {/* Sidebar list */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-3">
        {/* Search + Add */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
            <input
              value={searchQuery}
              onChange={e => searchNotes(e.target.value)}
              placeholder="Search notes..."
              className="theme-input pl-8 py-2 text-xs w-full"
            />
          </div>
          <button
            onClick={createNote}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer transition-all shadow-sm shadow-purple-600/30"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-[10px] flex justify-between">
            {error}
            <button onClick={() => setError(null)}><X className="w-3 h-3" /></button>
          </div>
        )}

        {/* Note list */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {notes.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <p className="text-3xl">📝</p>
              <p className="text-xs text-[var(--text-muted)] font-medium">No notes yet</p>
            </div>
          )}
          {notes.map(note => {
            const colorDef = getColorForNote(note);
            return (
              <button
                key={note.id}
                onClick={() => setActiveNote(note.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer group ${colorDef.border} ${colorDef.bg} ${activeNote === note.id ? 'ring-2 ring-purple-500' : 'hover:ring-1 hover:ring-purple-500/30'}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-[var(--text-primary)] line-clamp-1 flex items-center gap-1">
                    {note.pinned && <Pin className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                    {note.title || 'Untitled'}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/15 text-red-500 transition-all flex-shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] line-clamp-2">
                  {note.content || 'Empty note...'}
                </p>
                <p className="text-[9px] text-[var(--text-muted)] mt-1.5">
                  {formatDate(note.updatedAt || note.createdAt)}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 ui-card p-6 flex flex-col overflow-hidden">
        {active ? (
          <>
            {/* Editor toolbar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                {NOTE_COLORS.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => saveNoteChanges(active.id, { color: c.hex })}
                    className={`w-5 h-5 rounded-full border cursor-pointer transition-all ${active.color === c.hex ? 'ring-2 ring-offset-1 ring-purple-500 scale-110' : 'hover:scale-110'}`}
                    style={{ backgroundColor: c.hex, borderColor: c.hex === '#ffffff' ? '#d1d5db' : 'transparent' }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                {saving && <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Saving...</span>}
                <button
                  onClick={() => togglePin(active.id)}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${active.pinned ? 'bg-amber-500/15 text-amber-500' : 'text-[var(--text-muted)] hover:text-amber-500 hover:bg-amber-500/10'}`}
                >
                  {active.pinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteNote(active.id)}
                  className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title */}
            <input
              value={active.title || ''}
              onChange={e => handleFieldChange(active.id, 'title', e.target.value)}
              className="w-full text-xl font-extrabold bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] mb-3"
              placeholder="Note title..."
            />

            <div className="w-full h-px bg-[var(--border-color)] mb-3" />

            {/* Content */}
            <textarea
              ref={textareaRef}
              value={active.content || ''}
              onChange={e => handleFieldChange(active.id, 'content', e.target.value)}
              className="flex-1 w-full bg-transparent border-none outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none leading-relaxed"
              placeholder="Start typing your note... (supports plain text, bullets, markdown ideas)"
            />

            <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
              <span className="text-[10px] text-[var(--text-muted)]">
                {active.content?.length || 0} chars
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">
                Updated: {formatDate(active.updatedAt || active.createdAt)}
              </span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
              <span className="text-3xl">📝</span>
            </div>
            <div>
              <p className="text-sm font-extrabold text-[var(--text-primary)]">Select a note to edit</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Or click <strong>+</strong> to create a new one</p>
            </div>
            <button
              onClick={createNote}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold transition-all shadow-sm shadow-purple-600/30 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Create Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
