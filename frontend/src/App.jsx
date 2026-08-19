import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';
import KpiCards from './components/KpiCards';
import ScheduleTimeline from './components/ScheduleTimeline';
import UpcomingMeetingsWidget from './components/UpcomingMeetingsWidget';
import ProductivityTrendChart from './components/ProductivityTrendChart';
import AiSuggestionsWidget from './components/AiSuggestionsWidget';
import FocusDistributionDonut from './components/FocusDistributionDonut';
import MiniCalendarWidget from './components/MiniCalendarWidget';
import FocusScoreGauge from './components/FocusScoreGauge';
import TodayTasksWidget from './components/TodayTasksWidget';
import RemindersWidget from './components/RemindersWidget';

// Feature Views
import MeetingsView from './features/meetings/MeetingsView';
import AiAssistantView from './features/ai-assistant/AiAssistantView';
import WeeklyCalendar from './components/WeeklyCalendar';
import KanbanBoardView from './components/KanbanBoardView';
import AnalyticsView from './components/AnalyticsView';
import JavaArchitectureModal from './components/JavaArchitectureModal';
import LearningGoalWizardModal from './components/LearningGoalWizardModal';
import FocusTimerModal from './components/FocusTimerModal';
import TaskDetailModal from './components/TaskDetailModal';
import CommandBar from './components/CommandBar';
import OptimizeDayModal from './components/OptimizeDayModal';
import QuickCaptureModal from './components/QuickCaptureModal';
import TaskForm from './components/TaskForm';
import HabitsView from './features/habits/HabitsView';
import NotesView from './features/notes/NotesView';
import GoalsView from './features/goals/GoalsView';
import { sound } from './utils/audio';

// Toast notification component
function Toast({ message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-fade-in-up">
      <div className="glass-modal-content px-4 py-3 rounded-2xl flex items-center gap-3 shadow-xl max-w-sm">
        <span className="text-lg">✨</span>
        <p className="text-xs font-semibold text-[var(--text-primary)] leading-snug">{message}</p>
        <button onClick={onDismiss} className="ml-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs font-bold cursor-pointer">✕</button>
      </div>
    </div>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [tasks, setTasks] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastMeetingResult, setLastMeetingResult] = useState(null);

  // Modals & Drawers
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [isOptimizeModalOpen, setIsOptimizeModalOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [quickCaptureType, setQuickCaptureType] = useState('Task');
  const [isJavaModalOpen, setIsJavaModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);
  const [focusTask, setFocusTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Force Dark theme class to root HTML element
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('daymind-theme', 'dark');
  }, []);

  // Global keyboard shortcut: Cmd+K / Ctrl+K → command bar
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandBarOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const showToast = useCallback((msg) => setToastMessage(msg), []);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:8080/api/schedule/slots');
      const data = await res.json();
      if (data.success && data.tasks) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.warn('Backend not connected:', err.message);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleTaskCreated = async (taskPayload) => {
    setIsSubmitting(true);
    sound.playClick();
    try {
      const res = await fetch('http://localhost:8080/api/schedule/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskPayload),
      });
      const data = await res.json();
      if (data.success && data.task) {
        if (data.task.bumpedNotice) {
          sound.playPreempt();
          showToast(data.task.bumpedNotice);
        } else {
          sound.playComplete();
          showToast(`✅ "${data.task.title}" scheduled at ${data.task.assignedHourSlot}:00`);
        }
        fetchTasks();
      }
    } catch (err) {
      showToast('⚠️ Could not reach backend. Check if Spring Boot is running on port 8080.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (taskId) => {
    sound.playComplete();
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
    try {
      const res = await fetch(`http://localhost:8080/api/schedule/task/${taskId}/complete`, { method: 'PUT' });
      const data = await res.json();
      if (!data.success) fetchTasks(); // revert on failure
    } catch {
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    sound.playDelete();
    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await fetch(`http://localhost:8080/api/schedule/task/${taskId}`, { method: 'DELETE' });
    } catch {
      fetchTasks();
    }
  };

  const handleOptimizeTask = async (taskId) => {
    sound.playPreempt();
    try {
      const res = await fetch(`http://localhost:8080/api/schedule/task/${taskId}/optimize`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        showToast(data.task?.bumpedNotice || '✨ Task rescheduled to your peak focus hours.');
        fetchTasks();
      }
    } catch {
      showToast('⚠️ Could not optimize task. Backend not reachable.');
    }
  };

  const handleOpenQuickCapture = (captureType = 'Task') => {
    setQuickCaptureType(captureType);
    setIsQuickCaptureOpen(true);
  };

  const handleMeetingAnalyzed = (result) => {
    setLastMeetingResult(result);
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
      
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 max-w-[1650px] overflow-y-auto">
        
        <HeaderBar
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onOpenCommandBar={setIsCommandBarOpen}
        />

        {/* ─── 1. Dashboard ─── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-slide-down">
            <KpiCards tasks={tasks} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-5 space-y-6">
                <ScheduleTimeline
                  backendTasks={tasks}
                  onToggleComplete={handleToggleComplete}
                  onDeleteTask={handleDeleteTask}
                  onSelectTask={(task) => { setSelectedTask(task); setIsDetailModalOpen(true); }}
                  onOptimizeClick={() => setIsOptimizeModalOpen(true)}
                  onStartFocus={(task) => { setFocusTask(task); setIsFocusTimerOpen(true); }}
                />
                <UpcomingMeetingsWidget onViewCalendar={() => setActiveTab('calendar')} />
              </div>

              <div className="lg:col-span-4 space-y-6">
                <ProductivityTrendChart tasks={tasks} />
                <FocusDistributionDonut tasks={tasks} />
                <AiSuggestionsWidget
                  tasks={tasks}
                  onOptimizeClick={() => setIsOptimizeModalOpen(true)}
                  onViewAllInsights={() => setActiveTab('insights')}
                />
              </div>

              <div className="lg:col-span-3 space-y-6">
                <MiniCalendarWidget />
                <FocusScoreGauge tasks={tasks} />
                <TodayTasksWidget
                  tasks={tasks}
                  onToggleComplete={handleToggleComplete}
                  onViewAll={() => setActiveTab('tasks')}
                />
                <RemindersWidget
                  onOpenQuickCapture={handleOpenQuickCapture}
                  onViewAllMeetings={() => setActiveTab('meetings')}
                  lastMeetingResult={lastMeetingResult}
                />
              </div>

            </div>
          </div>
        )}

        {/* ─── 2. Calendar ─── */}
        {activeTab === 'calendar' && (
          <div className="space-y-6 animate-slide-down">
            <TaskForm onTaskCreated={handleTaskCreated} isSubmitting={isSubmitting} />
            <WeeklyCalendar
              tasks={tasks}
              notificationNotice={null}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onSelectTask={(t) => { setSelectedTask(t); setIsDetailModalOpen(true); }}
            />
          </div>
        )}

        {/* ─── 3. Tasks ─── */}
        {activeTab === 'tasks' && (
          <div className="space-y-6 animate-slide-down">
            <TaskForm onTaskCreated={handleTaskCreated} isSubmitting={isSubmitting} />
            <KanbanBoardView
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
              onOpenFocusTimer={(t) => { setFocusTask(t); setIsFocusTimerOpen(true); }}
              onSelectTask={(t) => { setSelectedTask(t); setIsDetailModalOpen(true); }}
            />
          </div>
        )}

        {/* ─── 4. Focus Planner ─── */}
        {activeTab === 'focus' && (
          <div className="space-y-6 animate-slide-down">
            <div className="ui-card p-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-purple-500/10 mx-auto flex items-center justify-center">
                <span className="text-4xl">🎯</span>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Deep Focus Mode</h2>
                <p className="text-sm text-[var(--text-secondary)] font-medium mt-1">Launch a Pomodoro session with ambient audio & distraction shield.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    const firstPending = tasks.find(t => !t.isCompleted);
                    setFocusTask(firstPending || null);
                    setIsFocusTimerOpen(true);
                  }}
                  className="px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm cursor-pointer shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] flex items-center gap-2 justify-center"
                >
                  🚀 Launch Focus Room HUD
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="px-8 py-3.5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-secondary)] font-bold text-sm cursor-pointer transition-all hover:border-purple-500/40"
                >
                  View Task Queue
                </button>
              </div>
              {tasks.filter(t => !t.isCompleted).length > 0 && (
                <p className="text-xs text-[var(--text-secondary)] font-mono">
                  {tasks.filter(t => !t.isCompleted).length} pending tasks — Focus session will start with the highest-priority item
                </p>
              )}
            </div>

            {tasks.filter(t => !t.isCompleted).slice(0, 5).length > 0 && (
              <div className="ui-card p-5 space-y-4">
                <h3 className="text-sm font-extrabold text-[var(--text-primary)]">📋 Focus Queue</h3>
                <div className="space-y-2">
                  {tasks.filter(t => !t.isCompleted).slice(0, 5).map((t, i) => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] hover:border-purple-500/30 transition-all group">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-black flex items-center justify-center">{i + 1}</span>
                        <span className="text-xs font-semibold text-[var(--text-primary)]">{t.title}</span>
                      </div>
                      <button
                        onClick={() => { setFocusTask(t); setIsFocusTimerOpen(true); }}
                        className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[11px] font-bold border border-purple-500/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        Focus →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── 5. Meetings ─── */}
        {activeTab === 'meetings' && (
          <MeetingsView
            onScheduleConvertedTasks={fetchTasks}
            onMeetingAnalyzed={handleMeetingAnalyzed}
          />
        )}

        {/* ─── 6. AI Assistant ─── */}
        {activeTab === 'assistant' && (
          <AiAssistantView tasks={tasks} />
        )}

        {/* ─── 7. Insights ─── */}
        {activeTab === 'insights' && (
          <div className="animate-slide-down">
            <AnalyticsView tasks={tasks} />
          </div>
        )}

        {/* ─── 8. Habits ─── */}
        {activeTab === 'habits' && <HabitsView />}

        {/* ─── 9. Notes ─── */}
        {activeTab === 'notes' && (
          <NotesView onTaskCreated={handleTaskCreated} onShowToast={showToast} />
        )}

        {/* ─── 10. Goals ─── */}
        {activeTab === 'goals' && (
          <GoalsView tasks={tasks} onTaskCreated={handleTaskCreated} onShowToast={showToast} />
        )}

        {/* ─── 11. Settings ─── */}
        {activeTab === 'settings' && (
          <div className="ui-card p-8 space-y-6 animate-slide-down">
            <div>
              <h2 className="text-xl font-extrabold text-[var(--text-primary)]">System Preferences</h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Configure AI providers, integrations, and appearance</p>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Active AI Provider', value: 'Google Gemini 2.0 Flash (Live API)', color: 'text-purple-600 dark:text-purple-400 font-bold' },
                { label: 'Spring Boot Backend', value: 'http://localhost:8080', color: 'text-blue-600 dark:text-blue-400' },
                { label: 'Database', value: 'H2 In-Memory · Persisted in session', color: 'text-[var(--text-secondary)]' },
              ].map(item => (
                <div key={item.label} className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-secondary)]">{item.label}</span>
                  <span className={`text-xs font-mono font-semibold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsJavaModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold text-xs cursor-pointer shadow-sm hover:bg-purple-500 transition-all"
              >
                ☕ View Backend Architecture
              </button>
              <a
                href="http://localhost:8080/h2-console"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-secondary)] font-bold text-xs cursor-pointer hover:border-purple-500/40 transition-all"
              >
                🗄️ Open H2 Console
              </a>
            </div>
          </div>
        )}

      </div>

      {/* ─── Modals ─── */}
      <CommandBar
        isOpen={isCommandBarOpen}
        onClose={setIsCommandBarOpen}
        onTaskCreated={handleTaskCreated}
        onGenerateRoadmap={() => setIsWizardOpen(true)}
      />
      <OptimizeDayModal
        isOpen={isOptimizeModalOpen}
        onClose={() => setIsOptimizeModalOpen(false)}
        onApplyChanges={() => { fetchTasks(); showToast('✨ Schedule optimized! Tasks moved to peak focus hours.'); }}
      />
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        initialType={quickCaptureType}
        onTaskCreated={handleTaskCreated}
      />
      <JavaArchitectureModal isOpen={isJavaModalOpen} onClose={() => setIsJavaModalOpen(false)} />
      <LearningGoalWizardModal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} onBatchScheduled={fetchTasks} />
      <FocusTimerModal isOpen={isFocusTimerOpen} onClose={() => setIsFocusTimerOpen(false)} task={focusTask} onCompleteTask={handleToggleComplete} />
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        task={selectedTask}
        onToggleComplete={handleToggleComplete}
        onDeleteTask={handleDeleteTask}
        onOptimizeTask={handleOptimizeTask}
      />

      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}

    </div>
  );
}
