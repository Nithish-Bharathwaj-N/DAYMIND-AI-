import React from 'react';
import { X, Code2, Cpu, CheckCircle2, Shield, Layers, Database, Sparkles } from 'lucide-react';

export default function JavaArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-overlay animate-slide-down">
      <div className="glass-modal-content w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative border border-white/20 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
            <Cpu className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Java Project Based Learning (PBL) Architecture</h2>
            <p className="text-xs text-amber-300 font-mono mt-0.5">Core Java OOP Concepts, Design Patterns & Spring Boot Specifications</p>
          </div>
        </div>

        {/* Architecture Specs Breakdown */}
        <div className="space-y-6 text-sm text-slate-300">
          
          {/* Section 1: Abstraction & Encapsulation */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10">
            <div className="flex items-center gap-3 mb-3 text-amber-400 font-bold">
              <Layers className="w-5 h-5" />
              <h3 className="text-base text-white">1. Abstraction & Encapsulation (`BaseTask.java`)</h3>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              The foundation of the task domain is an abstract base class `BaseTask` with strict encapsulation (private fields with accessor methods) and abstract methods that mandate polymorphic behavior across concrete task subclasses.
            </p>
            <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-amber-300 border border-white/10 space-y-1">
              <p className="text-slate-500">// Abstract Class Definition</p>
              <p><span className="text-purple-400">public abstract class</span> <span className="text-amber-400">BaseTask</span> &#123;</p>
              <p className="pl-4 text-slate-400"><span className="text-purple-400">private</span> Long id;</p>
              <p className="pl-4 text-slate-400"><span className="text-purple-400">private</span> String title;</p>
              <p className="pl-4 text-slate-400"><span className="text-purple-400">private int</span> userEstimatedMinutes;</p>
              <p className="pl-4 text-slate-400"><span className="text-purple-400">private int</span> predictedDurationMinutes;</p>
              <p className="pl-4 text-slate-400"><span className="text-purple-400">private double</span> flexibilityScore;</p>
              <p className="pl-4 text-slate-500 mt-2">// Abstract Methods for Polymorphism</p>
              <p className="pl-4 text-amber-300"><span className="text-purple-400">public abstract double</span> <span className="text-blue-400">getCategoryMultiplier</span>();</p>
              <p className="pl-4 text-amber-300"><span className="text-purple-400">public abstract double</span> <span className="text-blue-400">getPriorityWeight</span>();</p>
              <p className="pl-4 text-amber-300"><span className="text-purple-400">public abstract double</span> <span className="text-blue-400">calculateFlexibilityScore</span>(<span className="text-purple-400">double</span> completionProbability);</p>
              <p>&#125;</p>
            </div>
          </div>

          {/* Section 2: Inheritance & Polymorphism */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10">
            <div className="flex items-center gap-3 mb-3 text-purple-400 font-bold">
              <Code2 className="w-5 h-5" />
              <h3 className="text-base text-white">2. Inheritance & Polymorphism (Concrete Task Subclasses)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25">
                <span className="font-extrabold text-amber-300">AcademicTask</span>
                <p className="text-slate-400 text-[11px] mt-1">Overrides multiplier = <span className="text-amber-400 font-mono font-bold">1.25</span> (+25% bias correction for academic complexity).</p>
              </div>
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25">
                <span className="font-extrabold text-cyan-300">WorkTask</span>
                <p className="text-slate-400 text-[11px] mt-1">Overrides multiplier = <span className="text-cyan-400 font-mono font-bold">1.15</span> (+15% bias correction for corporate tasks).</p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <span className="font-extrabold text-emerald-300">HealthTask</span>
                <p className="text-slate-400 text-[11px] mt-1">Overrides multiplier = <span className="text-emerald-400 font-mono font-bold">1.30</span> (+30% bias correction for health/wellness).</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-500/10 border border-slate-500/25">
                <span className="font-extrabold text-slate-300">PersonalTask</span>
                <p className="text-slate-400 text-[11px] mt-1">Overrides multiplier = <span className="text-slate-300 font-mono font-bold">0.95</span> (-5% adjustment for routine errands).</p>
              </div>
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/25">
                <span className="font-extrabold text-purple-300">LearningTask</span>
                <p className="text-slate-400 text-[11px] mt-1">Overrides multiplier = <span className="text-purple-400 font-mono font-bold">1.20</span> (+20% skill ramp up multiplier).</p>
              </div>
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25">
                <span className="font-extrabold text-red-300">UrgentTask</span>
                <p className="text-slate-400 text-[11px] mt-1">Overrides priority weight = <span className="text-red-400 font-mono font-bold">1.00</span> (top priority slot preemption).</p>
              </div>
            </div>
          </div>

          {/* Section 3: Design Patterns */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10">
            <div className="flex items-center gap-3 mb-3 text-cyan-400 font-bold">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base text-white">3. Design Patterns: Factory & Strategy</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-cyan-300">Factory Pattern (`TaskFactory.java`):</span>
                <p className="text-slate-400 mt-1">
                  Decouples task creation logic by dynamically instantiating concrete `BaseTask` subclasses based on category enums and priority ratings.
                </p>
              </div>
              <div>
                <span className="font-bold text-cyan-300">Strategy Pattern (`FlexibilityBumpingStrategy.java`):</span>
                <p className="text-slate-400 mt-1">
                  Implements `SchedulingStrategy` interface utilizing the flexibility formula:
                </p>
                <div className="p-3 rounded-xl bg-slate-950 font-mono text-purple-300 border border-purple-500/20 mt-2 text-center">
                  Flexibility Score = (1.0 - PriorityWeight) / Math.max(CompletionProbability, 0.01)
                </div>
                <p className="text-slate-400 text-[11px] mt-2">
                  When a slot conflict occurs, tasks with lower flexibility scores claim the slot while higher flexibility score tasks are preempted and rescheduled.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>Understood & Close</span>
          </button>
        </div>

      </div>
    </div>
  );
}
