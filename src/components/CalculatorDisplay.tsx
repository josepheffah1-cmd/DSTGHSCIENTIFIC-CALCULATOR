/**
 * DSTGH SCIENTIFIC CALCULATOR - Display Component
 * LCD Screen with Status Indicators, Expression Line, Cursor, and Large Result
 */

import React, { useRef, useEffect } from 'react';
import { AngleMode } from '../types';
import { Copy, Check, ArrowLeftRight, AlertTriangle } from 'lucide-react';

interface CalculatorDisplayProps {
  expression: string;
  cursorPosition: number;
  result: string;
  fractionResult?: string;
  mixedFractionResult?: string;
  fractionViewMode?: 'decimal' | 'fraction' | 'mixed';
  isFractionView?: boolean;
  isComplex?: boolean;
  onToggleFractionView: () => void;
  angleMode: AngleMode;
  onSelectAngleMode?: (mode: AngleMode) => void;
  isShiftActive: boolean;
  isAlphaActive: boolean;
  isMemoryActive: boolean;
  isStatActive: boolean;
  isBaseActive: boolean;
  error?: string;
  onClearError?: () => void;
  ansValue?: number;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  cursorPosition,
  result,
  fractionResult,
  mixedFractionResult,
  fractionViewMode = 'decimal',
  isFractionView = false,
  isComplex = false,
  onToggleFractionView,
  angleMode,
  onSelectAngleMode,
  isShiftActive,
  isAlphaActive,
  isMemoryActive,
  isStatActive,
  isBaseActive,
  error,
  onClearError,
  ansValue,
}) => {
  const exprContainerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Auto-scroll expression to cursor or end
  useEffect(() => {
    if (exprContainerRef.current) {
      exprContainerRef.current.scrollLeft = exprContainerRef.current.scrollWidth;
    }
  }, [expression, cursorPosition]);

  const displayResult = (() => {
    if (fractionViewMode === 'fraction' && fractionResult) return fractionResult;
    if (fractionViewMode === 'mixed' && mixedFractionResult) return mixedFractionResult;
    if (isFractionView && fractionResult) return fractionResult;
    return result;
  })();

  const handleCopy = () => {
    const textToCopy = displayResult;
    if (textToCopy && textToCopy !== '0') {
      navigator.clipboard?.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Render expression with blinking cursor
  const renderExpression = () => {
    if (!expression) {
      return (
        <span className="text-white/40 font-mono tracking-wider">
          0<span className="inline-block w-1.5 h-4.5 bg-[#4ade80] animate-pulse ml-1 align-middle" />
        </span>
      );
    }

    const before = expression.slice(0, cursorPosition);
    const after = expression.slice(cursorPosition);

    return (
      <span className="font-mono tracking-tight text-white/80 whitespace-pre">
        {before}
        <span className="inline-block w-1.5 h-4.5 bg-[#4ade80] animate-pulse -mb-0.5 align-middle" />
        {after}
      </span>
    );
  };

  return (
    <div
      id="dstgh-display-container"
      className="relative w-full bg-[#0A0D14] rounded-2xl p-4 sm:p-6 shadow-inner mb-2 sm:mb-4 border-b-4 border-white/10 select-text transition-colors duration-200"
    >
      {/* Status Bar Indicators */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#4ade80] pb-2 mb-1 border-b border-white/10 opacity-90 uppercase tracking-widest">
        <div className="flex items-center gap-3">
          {/* Active Angle Mode selector (DEG / RAD / GRAD) */}
          <div className="flex items-center gap-0.5 bg-white/5 p-0.5 rounded border border-[#4ade80]/30" title="Angle Mode: Click to switch between DEG, RAD, GRAD">
            {(['DEG', 'RAD', 'GRAD'] as AngleMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onSelectAngleMode?.(mode)}
                className={`px-1.5 py-0.5 rounded font-extrabold text-[9px] transition-all cursor-pointer ${
                  angleMode === mode
                    ? 'bg-[#4ade80] text-[#0A0D14] shadow-xs'
                    : 'text-[#4ade80]/60 hover:text-[#4ade80] hover:bg-white/10'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* SHIFT indicator */}
          {isShiftActive && (
            <span className="px-1.5 py-0.5 rounded bg-yellow-400 text-[#082765] font-black text-[10px] animate-pulse">
              SHIFT
            </span>
          )}

          {/* ALPHA indicator */}
          {isAlphaActive && (
            <span className="px-1.5 py-0.5 rounded bg-pink-500 text-white font-black text-[10px] animate-pulse">
              ALPHA
            </span>
          )}

          {/* MEM indicator */}
          {isMemoryActive && (
            <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px]">
              M
            </span>
          )}

          {/* STAT indicator */}
          {isStatActive && (
            <span className="text-[#4ade80] font-bold">
              STAT
            </span>
          )}

          {/* BASE indicator */}
          {isBaseActive && (
            <span className="text-[#4ade80] font-bold">
              BASE
            </span>
          )}

          {/* CMPLX indicator */}
          {isComplex && (
            <span className="px-1.5 py-0.5 rounded bg-purple-600 text-white font-black text-[9px]">
              CMPLX
            </span>
          )}

          {/* Fraction Form indicator (d/c or a b/c) */}
          {fractionViewMode === 'fraction' && (
            <span className="px-1.5 py-0.5 rounded bg-[#4ade80]/20 text-[#4ade80] font-bold text-[9px]">
              d/c
            </span>
          )}
          {fractionViewMode === 'mixed' && (
            <span className="px-1.5 py-0.5 rounded bg-[#4ade80]/20 text-[#4ade80] font-bold text-[9px]">
              a b/c
            </span>
          )}

          <span className="text-[#4ade80]/70 font-semibold text-[10px]">
            MATH
          </span>
        </div>

        {/* Quick controls: S<=>D and Copy */}
        <div className="flex items-center gap-2">
          {(fractionResult || mixedFractionResult) && (
            <button
              onClick={onToggleFractionView}
              title="Toggle Fraction / Decimal / Mixed Display (S↔D)"
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[#4ade80] border border-[#4ade80]/30 text-[10px] font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <ArrowLeftRight className="w-2.5 h-2.5" />
              <span>S↔D</span>
              <span className="text-[8px] opacity-70">
                {fractionViewMode === 'decimal' ? '→Frac' : fractionViewMode === 'fraction' ? (mixedFractionResult ? '→Mixed' : '→Dec') : '→Dec'}
              </span>
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Copy Result"
            className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#4ade80]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expression Line with Horizontal Scrolling */}
      <div
        ref={exprContainerRef}
        className="w-full overflow-x-auto overflow-y-hidden text-right py-1.5 text-base sm:text-xl min-h-[2.2rem] scrollbar-none font-mono text-white/60 tracking-tight"
        style={{ scrollbarWidth: 'none' }}
      >
        {renderExpression()}
      </div>

      {/* Result Display Line */}
      <div className="w-full flex items-baseline justify-between pt-1">
        {/* Previous Answer Badge or fraction note */}
        <div className="text-xs font-mono text-white/40 font-semibold select-none">
          {ansValue !== undefined && ansValue !== 0 && !error && (
            <span>Ans = {ansValue}</span>
          )}
          {(fractionResult || mixedFractionResult) && (
            <span className="ml-2 text-[10px] text-[#4ade80]">
              {fractionViewMode === 'fraction'
                ? '[Improper d/c]'
                : fractionViewMode === 'mixed'
                ? '[Mixed a b/c]'
                : '[Decimal]'}
            </span>
          )}
        </div>

        {/* Big Answer / Error */}
        <div className="text-right">
          {error ? (
            <div className="flex items-center justify-end gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-xl sm:text-2xl font-bold font-mono tracking-wide">{error}</span>
              {onClearError && (
                <button
                  onClick={onClearError}
                  className="ml-2 px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
                >
                  OK
                </button>
              )}
            </div>
          ) : (
            <div
              id="calculator-main-result"
              className="font-mono text-3xl sm:text-5xl font-medium tracking-tighter text-white overflow-x-auto scrollbar-none"
            >
              {displayResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
