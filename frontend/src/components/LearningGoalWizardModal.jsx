import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Calendar, CheckCircle2, ArrowRight, ArrowLeft, Loader2, Layers } from 'lucide-react';

export default function LearningGoalWizardModal({ isOpen, onClose, onBatchScheduled }) {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState('Mastering Core Java & Spring Boot Microservices');
  const [targetDays, setTargetDays] = useState(5);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isScheduling, setIsScheduling] = useState(false);

  if (!isOpen) return null;

  const handleGeneratePlan = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('http://localhost:8080/api/generate-learning-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, targetDays: Number(targetDays), hoursPerDay: Number(hoursPerDay), skillLevel })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedPlan(data.plan);
        setStep(2);
      }
    } catch (err) {
      console.error('Error generating learning plan:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBatchSchedule = async () => {
    if (!generatedPlan || !generatedPlan.modules) return;
    setIsScheduling(true);
    try {
      const batchPayload = {
        tasks: generatedPlan.modules.map((m) => ({
          title: m.moduleTitle,
          rawPrompt: m.description,
          userEstimatedMinutes: m.durationMinutes,
          assignedHourSlot: m.suggestedHourSlot,
          dayOfWeek: m.dayOfWeek,
          category: 'LEARNING',
          priority: 'HIGH'
        }))
      };

      const res = await fetch('http://localhost:8080/api/tasks/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchPayload)
      });
      const data = await res.json();
      if (data.success) {
        setStep(3);
        if (onBatchScheduled) onBatchScheduled(data.tasks);
      }
    } catch (err) {
      console.error('Error batch scheduling tasks:', err);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setGeneratedPlan(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-slide-down">
      <div className="glass-modal w-full max-w-3xl p-6 md:p-8 relative border border-white/20">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Multi-Day Learning Roadmap Wizard</h2>
            <p className="text-xs text-purple-300 font-mono mt-0.5">Java Engine AI Syllabus Generator & Batch Calendar Scheduler</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 px-4">
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? 'text-amber-400' : 'text-slate-600'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono ${step >= 1 ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'}`}>1</span>
            Goal & Budget
          </div>
          <div className="flex-1 h-0.5 bg-slate-800 mx-4"></div>
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? 'text-purple-400' : 'text-slate-600'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono ${step >= 2 ? 'bg-purple-500 text-black' : 'bg-slate-800 text-slate-400'}`}>2</span>
            Syllabus Preview
          </div>
          <div className="flex-1 h-0.5 bg-slate-800 mx-4"></div>
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 3 ? 'text-emerald-400' : 'text-slate-600'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono ${step >= 3 ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'}`}>3</span>
            Batch Scheduled
          </div>
        </div>

        {/* STEP 1: Form Inputs */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                What do you want to learn?
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Mastering Java & Spring Boot Microservices..."
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-all font-sans"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Target Days (1 - 7)
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={targetDays}
                  onChange={(e) => setTargetDays(Number(e.target.value))}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Daily Budget (Hours/Day)
                </label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Target Proficiency
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all font-sans"
                >
                  <option value="Beginner" className="bg-slate-900">Beginner</option>
                  <option value="Intermediate" className="bg-slate-900">Intermediate</option>
                  <option value="Advanced" className="bg-slate-900">Advanced / Enterprise</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleGeneratePlan}
                disabled={isGenerating || !topic.trim()}
                className="btn-primary text-xs shadow-purple-500/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Java Roadmap...</span>
                  </>
                ) : (
                  <>
                    <span>Synthesize Multi-Day Syllabus</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Syllabus Preview */}
        {step === 2 && generatedPlan && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs">
              <p className="font-bold text-purple-300">{generatedPlan.roadmapSummary}</p>
            </div>

            <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1">
              {generatedPlan.modules?.map((mod, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] border border-purple-500/30">
                        {mod.dayOfWeek}
                      </span>
                      <h4 className="font-bold text-sm text-white">{mod.moduleTitle}</h4>
                    </div>
                    <p className="text-xs text-slate-400">{mod.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-amber-400">{mod.durationMinutes} mins</div>
                    <div className="text-[10px] text-slate-500 font-mono">Suggested: {mod.suggestedHourSlot}:00</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary text-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Edit Parameters</span>
              </button>

              <button
                onClick={handleBatchSchedule}
                disabled={isScheduling}
                className="btn-primary text-xs shadow-emerald-500/20 bg-gradient-to-r from-emerald-500 to-teal-600"
              >
                {isScheduling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Batch Rescheduling...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Batch Schedule All Modules into Calendar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 3 && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">Learning Roadmap Batch Scheduled!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              All {generatedPlan?.totalModules} modules have been processed through the Core Java OOP Engine and allocated into your weekly calendar slots with polymorphic duration bias correction (+20% skill ramp).
            </p>
            <div className="pt-4">
              <button onClick={handleResetAndClose} className="btn-primary text-xs">
                <span>Return to Calendar Dashboard</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
