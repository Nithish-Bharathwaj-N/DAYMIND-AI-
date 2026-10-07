import React from 'react';
import { X, Code2, Cpu, CheckCircle2, Shield, Layers, Database, Sparkles } from 'lucide-react';

export default function JavaArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-overlay animate-slide-down">
      <div className="glass-modal-content w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative border border-slate-200 shadow-xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-md shadow-amber-500/10">
            <Cpu className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Java Project Based Learning (PBL) Architecture</h2>
            <p className="text-xs text-amber-700 font-mono font-semibold mt-0.5">Core Java OOP Concepts, Design Patterns & Spring Boot Specifications</p>
          </div>
        </div>

        {/* Architecture Specs Breakdown */}
        <div className="space-y-6 text-sm text-slate-700">
          
          {/* Section 1: Abstraction & Encapsulation */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3 mb-3 text-amber-700 font-bold">
              <Layers className="w-5 h-5 text-amber-600" />
              <h3 className="text-base text-slate-900 font-bold">1. Abstraction & Encapsulation (`BaseTask.java`)</h3>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              The foundation of the task domain is an abstract base class `BaseTask` with strict encapsulation (private fields with accessor methods) and abstract methods that mandate polymorphic behavior across concrete task subclasses.
            </p>
            <div className="p-4 rounded-xl bg-slate-100 font-mono text-xs text-slate-800 border border-slate-300 space-y-1">
              <p className="text-slate-500">// Abstract Class Definition</p>
              <p><span className="text-purple-700 font-bold">public abstract class</span> <span className="text-amber-800 font-bold">BaseTask</span> &#123;</p>
              <p className="pl-4 text-slate-700"><span className="text-purple-700 font-bold">private</span> Long id;</p>
              <p className="pl-4 text-slate-700"><span className="text-purple-700 font-bold">private</span> String title;</p>
              <p className="pl-4 text-slate-700"><span className="text-purple-700 font-bold">private int</span> userEstimatedMinutes;</p>
              <p className="pl-4 text-slate-700"><span className="text-purple-700 font-bold">private int</span> predictedDurationMinutes;</p>
              <p className="pl-4 text-slate-700"><span className="text-purple-700 font-bold">private double</span> flexibilityScore;</p>
              <p className="pl-4 text-slate-500 mt-2">// Abstract Methods for Polymorphism</p>
              <p className="pl-4 text-amber-900"><span className="text-purple-700 font-bold">public abstract double</span> <span className="text-blue-700 font-bold">getCategoryMultiplier</span>();</p>
              <p className="pl-4 text-amber-900"><span className="text-purple-700 font-bold">public abstract double</span> <span className="text-blue-700 font-bold">getPriorityWeight</span>();</p>
              <p className="pl-4 text-amber-900"><span className="text-purple-700 font-bold">public abstract double</span> <span className="text-blue-700 font-bold">calculateFlexibilityScore</span>(<span className="text-purple-700 font-bold">double</span> completionProbability);</p>
              <p>&#125;</p>
            </div>
          </div>

          {/* Section 2: Inheritance & Polymorphism */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3 mb-3 text-purple-700 font-bold">
              <Code2 className="w-5 h-5 text-purple-600" />
              <h3 className="text-base text-slate-900 font-bold">2. Inheritance & Polymorphism (Concrete Task Subclasses)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="font-extrabold text-amber-900">AcademicTask</span>
                <p className="text-slate-600 text-[11px] mt-1">Overrides multiplier = <span className="text-amber-700 font-mono font-bold">1.25</span> (+25% bias correction for academic complexity).</p>
              </div>
              <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-200">
                <span className="font-extrabold text-cyan-900">WorkTask</span>
                <p className="text-slate-600 text-[11px] mt-1">Overrides multiplier = <span className="text-cyan-700 font-mono font-bold">1.15</span> (+15% bias correction for corporate tasks).</p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="font-extrabold text-emerald-900">HealthTask</span>
                <p className="text-slate-600 text-[11px] mt-1">Overrides multiplier = <span className="text-emerald-700 font-mono font-bold">1.30</span> (+30% bias correction for health/wellness).</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200">
                <span className="font-extrabold text-slate-800">PersonalTask</span>
                <p className="text-slate-600 text-[11px] mt-1">Overrides multiplier = <span className="text-slate-700 font-mono font-bold">0.95</span> (-5% adjustment for routine errands).</p>
              </div>
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200">
                <span className="font-extrabold text-purple-900">LearningTask</span>
                <p className="text-slate-600 text-[11px] mt-1">Overrides multiplier = <span className="text-purple-700 font-mono font-bold">1.20</span> (+20% skill ramp up multiplier).</p>
              </div>
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200">
                <span className="font-extrabold text-red-900">UrgentTask</span>
                <p className="text-slate-600 text-[11px] mt-1">Overrides priority weight = <span className="text-red-700 font-mono font-bold">1.00</span> (top priority slot preemption).</p>
              </div>
            </div>
          </div>

          {/* Section 3: Design Patterns */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3 mb-3 text-cyan-700 font-bold">
              <Sparkles className="w-5 h-5 text-cyan-600" />
              <h3 className="text-base text-slate-900 font-bold">3. Design Patterns: Factory & Strategy</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-cyan-900">Factory Pattern (`TaskFactory.java`):</span>
                <p className="text-slate-600 mt-1">
                  Decouples task creation logic by dynamically instantiating concrete `BaseTask` subclasses based on category enums and priority ratings.
                </p>
              </div>
              <div>
                <span className="font-bold text-cyan-900">Strategy Pattern (`FlexibilityBumpingStrategy.java`):</span>
                <p className="text-slate-600 mt-1">
                  Implements `SchedulingStrategy` interface utilizing the flexibility formula:
                </p>
                <div className="p-3 rounded-xl bg-purple-50 font-mono text-purple-900 border border-purple-200 mt-2 text-center font-bold">
                  Flexibility Score = (1.0 - PriorityWeight) / Math.max(CompletionProbability, 0.01)
                </div>
                <p className="text-slate-600 text-[11px] mt-2">
                  When a slot conflict occurs, tasks with lower flexibility scores claim the slot while higher flexibility score tasks are preempted and rescheduled.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Understood & Close</span>
          </button>
        </div>

      </div>
    </div>
  );
}
