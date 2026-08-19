import React, { useState } from 'react';
import { Users, FileText, Sparkles, CheckCircle2, Calendar, Clock, ArrowRight, Upload, Play, Check } from 'lucide-react';
import { sound } from '../../utils/audio';

export default function MeetingsView({ onScheduleConvertedTasks }) {
  const [meetingTitle, setMeetingTitle] = useState('Brainstorming Call');
  const [rawTranscript, setRawTranscript] = useState(`Nithish: Let's finalize the Q2 roadmap today. We need user flow drafts ready by May 14.
Sarah: I can take on the market research and competitor matrix. I'll need until May 15.
Nithish: Perfect. We also decided to adopt the new glassmorphic UI design system and approve 90-minute focus blocks for deep work.`);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  const handleAnalyzeMeeting = async () => {
    setIsAnalyzing(true);
    setScheduledSuccess(false);
    sound.playClick();

    try {
      const res = await fetch('http://localhost:8080/api/meetings/analyze-raw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: meetingTitle, transcript: rawTranscript })
      });
      const data = await res.json();
      if (data.success) {
        sound.playComplete();
        setAnalysisResult(data);
      }
    } catch (err) {
      console.error('Error analyzing meeting:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConvertToPlan = async () => {
    sound.playComplete();
    try {
      const res = await fetch('http://localhost:8080/api/meetings/convert-action-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisResult)
      });
      const data = await res.json();
      if (data.success) {
        setScheduledSuccess(true);
        if (onScheduleConvertedTasks) onScheduleConvertedTasks();
      }
    } catch (err) {
      console.error('Error converting action items:', err);
    }
  };

  return (
    <div className="space-y-6 animate-slide-down">
      
      {/* Module Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            <span>AI Meeting Capture & Action Item Pipeline</span>
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-medium mt-1">
            Upload or paste meeting transcripts to extract summaries, decisions, and automatic calendar tasks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Transcript Input Form (5 cols) */}
        <div className="lg:col-span-5 ui-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <span className="text-sm font-extrabold text-[var(--text-primary)]">Meeting Input</span>
            <span className="text-[10px] font-mono font-bold text-purple-600 px-2 py-0.5 rounded bg-purple-500/15">
              AI NLP Engine Ready
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-[var(--text-secondary)] block mb-1">Meeting Title:</label>
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-500/10 border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--text-secondary)] block mb-1">Paste Transcript / Notes:</label>
              <textarea
                rows={8}
                value={rawTranscript}
                onChange={(e) => setRawTranscript(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-500/10 border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30 leading-relaxed"
                placeholder="Paste meeting transcript or raw notes..."
              />
            </div>

            <button
              onClick={handleAnalyzeMeeting}
              disabled={isAnalyzing || !rawTranscript.trim()}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-600/30 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Processing Transcript with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Analyze Meeting Transcript</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Analysis & Action Item Calendar Converter (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {analysisResult ? (
            <div className="ui-card p-6 space-y-5 animate-slide-down">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-wider">AI Meeting Summary</span>
                  <h3 className="text-base font-extrabold text-[var(--text-primary)]">{analysisResult.meetingTitle}</h3>
                </div>

                <button
                  onClick={handleConvertToPlan}
                  disabled={scheduledSuccess}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    scheduledSuccess
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                  }`}
                >
                  {scheduledSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Converted & Scheduled!</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Convert Action Items to Plan</span>
                    </>
                  )}
                </button>
              </div>

              {/* Summary Text */}
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-[var(--text-primary)] leading-relaxed">
                {analysisResult.summary}
              </div>

              {/* Key Points & Decisions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-500/5 border border-[var(--border-color)] space-y-2">
                  <span className="font-bold text-[var(--text-primary)] block">Key Discussion Points:</span>
                  <ul className="space-y-1 list-disc list-inside text-[var(--text-secondary)] font-medium">
                    {analysisResult.keyPoints?.map((kp, i) => (
                      <li key={i}>{kp}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-500/5 border border-[var(--border-color)] space-y-2">
                  <span className="font-bold text-[var(--text-primary)] block">Key Decisions:</span>
                  <ul className="space-y-1 list-disc list-inside text-[var(--text-secondary)] font-medium">
                    {analysisResult.decisions?.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Extracted Action Items Matrix */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold text-[var(--text-primary)] block">
                  Extracted Action Items & Suggested Calendar Blocks:
                </span>

                <div className="space-y-3">
                  {analysisResult.actionItems?.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl bg-slate-500/5 border border-[var(--border-color)] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-bold text-[var(--text-primary)]">{item.task}</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold">
                          Owner: {item.owner} • Due: {item.dueDate}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-[var(--text-secondary)] flex items-center justify-between pt-1">
                        <span>Suggested Slot: <strong className="text-purple-600 dark:text-purple-300">{item.suggestedSlot}</strong> ({item.estimatedMinutes}m)</span>
                        <span className="text-emerald-500 font-bold">Reason: {item.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="ui-card p-12 text-center space-y-3 border-dashed">
              <Sparkles className="w-10 h-10 text-purple-500 mx-auto animate-pulse" />
              <h3 className="text-base font-extrabold text-[var(--text-primary)]">Ready for Meeting Analysis</h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto font-medium">
                Click "Analyze Meeting Transcript" on the left to extract key discussion points, decisions, and automatically scheduled action items.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
