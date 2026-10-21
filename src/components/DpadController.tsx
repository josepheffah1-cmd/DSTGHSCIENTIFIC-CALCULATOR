/**
 * DSTGH SCIENTIFIC CALCULATOR - D-pad / Replay Controller
 * Circular physical navigation pad for expression cursor & calculation history
 */

import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { soundManager } from '../math/audio';

interface DpadControllerProps {
  onCursorLeft: () => void;
  onCursorRight: () => void;
  onHistoryUp: () => void;
  onHistoryDown: () => void;
  onCenterClick?: () => void;
}

export const DpadController: React.FC<DpadControllerProps> = ({
  onCursorLeft,
  onCursorRight,
  onHistoryUp,
  onHistoryDown,
  onCenterClick,
}) => {
  const trigger = (action: () => void) => {
    soundManager.playKeyClick(700, 0.015);
    soundManager.triggerHaptic(8);
    action();
  };

  return (
    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-200/90 dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-700 shadow-md flex items-center justify-center p-1 select-none">
      {/* Up Button */}
      <button
        onClick={() => trigger(onHistoryUp)}
        title="Previous Calculation (History Up)"
        aria-label="Previous history"
        className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#123EA8] hover:bg-[#2459D6] text-white shadow-md flex items-center justify-center active:scale-95 transition-all"
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      {/* Down Button */}
      <button
        onClick={() => trigger(onHistoryDown)}
        title="Next Calculation (History Down)"
        aria-label="Next history"
        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#123EA8] hover:bg-[#2459D6] text-white shadow-md flex items-center justify-center active:scale-95 transition-all"
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Left Button */}
      <button
        onClick={() => trigger(onCursorLeft)}
        title="Move Cursor Left"
        aria-label="Move cursor left"
        className="absolute left-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#123EA8] hover:bg-[#2459D6] text-white shadow-md flex items-center justify-center active:scale-95 transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Right Button */}
      <button
        onClick={() => trigger(onCursorRight)}
        title="Move Cursor Right"
        aria-label="Move cursor right"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#123EA8] hover:bg-[#2459D6] text-white shadow-md flex items-center justify-center active:scale-95 transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Center Label / REPLAY */}
      <div
        onClick={() => onCenterClick && trigger(onCenterClick)}
        className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-inner flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
      >
        <span className="text-[8px] font-black tracking-widest text-[#123EA8] dark:text-blue-400">
          REPLAY
        </span>
      </div>
    </div>
  );
};
