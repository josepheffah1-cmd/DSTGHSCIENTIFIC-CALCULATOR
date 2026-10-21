/**
 * DSTGH SCIENTIFIC CALCULATOR - Study Mode Explainer Component
 * Educational Step-by-Step Breakdown Dialog
 */

import React from 'react';
import { X, GraduationCap, CheckCircle2, Sparkles } from 'lucide-react';
import { StudyExplanation } from '../math/studyMode';

interface StudyModeExplainerProps {
  explanation: StudyExplanation | null;
  onClose: () => void;
}

export const StudyModeExplainer: React.FC<StudyModeExplainerProps> = ({
  explanation,
  onClose,
}) => {
  if (!explanation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-amber-500/50 flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-200" />
            <div>
              <h2 className="font-bold text-base tracking-wide">DSTGH Study Mode Explainer</h2>
              <p className="text-[11px] text-amber-100 font-medium">
                Concept: {explanation.topic}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          {/* Main summary card */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex flex-col gap-1">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
              Expression & Summary
            </span>
            <div className="font-mono text-base font-black text-slate-900 dark:text-white">
              {explanation.summary}
            </div>
          </div>

          {/* Sequential Step by step Breakdown */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Step-by-Step Educational Breakdown:
            </span>

            <div className="flex flex-col gap-2.5">
              {explanation.steps.map((st, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed">
                    {st}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={onClose}
            className="mt-2 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
          >
            Got It, Back to Calculator
          </button>
        </div>
      </div>
    </div>
  );
};
