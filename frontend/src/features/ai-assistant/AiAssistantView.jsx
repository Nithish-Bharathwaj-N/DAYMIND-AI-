import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { sound } from '../../utils/audio';

const QUICK_PROMPTS = [
  { icon: '🎯', text: 'What should I focus on right now?' },
  { icon: '📅', text: 'Optimize my schedule for today.' },
  { icon: '⚡', text: 'What are my peak productivity hours?' },
  { icon: '🧠', text: 'How can I reduce cognitive load today?' },
  { icon: '📊', text: 'Give me a productivity summary.' },
  { icon: '🔋', text: 'How do I improve my focus score?' },
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-purple-500/60 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export default function AiAssistantView({ tasks = [] }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `👋 Hello! I'm your **DayMind AI** assistant.\n\nI can help you:\n• Optimize your schedule and prioritize tasks\n• Analyze your productivity patterns\n• Summarize meetings and extract action items\n• Suggest your best focus windows based on your data\n\nYou currently have **${tasks.length} tasks** in your system. What would you like to work on?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Re-greet when task count changes significantly
  useEffect(() => {
    if (tasks.length > 0) {
      setMessages(prev => prev.map((m, i) =>
        i === 0
          ? { ...m, text: `👋 Hello! I'm your **DayMind AI** assistant.\n\nI can help you optimize your schedule, summarize meetings, and identify your best focus windows.\n\nYou currently have **${tasks.length} task${tasks.length !== 1 ? 's' : ''}** — ${tasks.filter(t => !t.isCompleted).length} pending, ${tasks.filter(t => t.isCompleted).length} completed. How can I help you today?` }
          : m
      ));
    }
  }, [tasks.length]);

  const formatText = (text) => {
    // Simple markdown-like formatting
    return text
      .split('\n')
      .map((line, i) => {
        const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        if (line.startsWith('•')) return <div key={i} className="flex gap-2"><span className="text-purple-500 shrink-0">•</span><span dangerouslySetInnerHTML={{ __html: bold.replace('• ', '') }} /></div>;
        return <div key={i} dangerouslySetInnerHTML={{ __html: bold || '&nbsp;' }} />;
      });
  };

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    sound.playClick();
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: query, timestamp: ts }]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    try {
      // Build context from tasks
      const taskContext = tasks.length > 0
        ? `User has ${tasks.length} tasks: ${tasks.slice(0, 5).map(t => `"${t.title}" (${t.priority}, ${t.isCompleted ? 'done' : 'pending'})`).join(', ')}${tasks.length > 5 ? '...' : ''}.`
        : 'User has no tasks yet.';

      const res = await fetch('http://localhost:8080/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query, message: query }),
      });
      const data = await res.json();
      const reply = data.reply || data.response || "I couldn't process that. Please try again.";
      sound.playComplete();
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: '⚠️ Spring Boot backend not reachable on port 8080. Start the backend server and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    sound.playClick();
    setMessages([{
      id: Date.now(),
      sender: 'ai',
      text: `Chat cleared. You have **${tasks.length} tasks** ready. How can I help you be more productive?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  return (
    <div className="flex flex-col gap-4 animate-slide-down max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-2">
              DayMind AI
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-[11px] text-[var(--text-secondary)] font-medium">
              Connected to your {tasks.length} tasks · Spring Boot backend
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)] transition-all cursor-pointer"
          title="Clear chat"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="ui-card p-5 min-h-[380px] max-h-[500px] overflow-y-auto flex flex-col gap-4 scrollbar-none">
        {messages.map(msg => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
              msg.sender === 'user'
                ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white'
                : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl text-xs leading-relaxed shadow-sm space-y-0.5 ${
              msg.sender === 'user'
                ? 'bg-purple-600 text-white px-4 py-3 rounded-tr-none'
                : msg.isError
                ? 'bg-red-500/8 border border-red-500/20 text-red-700 dark:text-red-300 px-4 py-3 rounded-tl-none'
                : 'bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] px-4 py-3 rounded-tl-none'
            }`}>
              <div className="font-medium space-y-1">
                {msg.sender === 'user' ? msg.text : formatText(msg.text)}
              </div>
              <div className={`text-[9px] font-mono mt-1.5 ${msg.sender === 'user' ? 'text-white/60 text-right' : 'text-[var(--text-muted)]'}`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl rounded-tl-none">
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Prompt Chips */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider font-bold">Quick prompts:</span>
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((qp, i) => (
            <button
              key={i}
              onClick={() => { handleSend(qp.text); }}
              disabled={isTyping}
              className="px-3 py-1.5 rounded-xl bg-[var(--bg-input)] hover:bg-[var(--accent-purple-light)] border border-[var(--border-color)] hover:border-purple-500/40 text-xs font-semibold text-[var(--text-secondary)] hover:text-purple-700 dark:hover:text-purple-300 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>{qp.icon}</span>
              <span>{qp.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
        <input
          ref={inputRef}
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Ask DayMind AI anything about your productivity..."
          disabled={isTyping}
          className="theme-input flex-1 py-3 pr-4 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm shadow-purple-600/30"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
