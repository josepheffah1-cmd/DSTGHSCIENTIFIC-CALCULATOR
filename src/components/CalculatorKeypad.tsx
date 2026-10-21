/**
 * DSTGH SCIENTIFIC CALCULATOR - Keypad Component
 * Inspired by physical professional scientific calculators with dual-shift labels,
 * tactile depth, responsive grid, and complete 417+ function mapping.
 */

import React from 'react';
import { soundManager } from '../math/audio';
import { DpadController } from './DpadController';

interface CalculatorKeypadProps {
  onInput: (char: string) => void;
  onClear: () => void;
  onDelete: () => void;
  onEquals: () => void;
  isShiftActive: boolean;
  isAlphaActive: boolean;
  onToggleShift: () => void;
  onToggleAlpha: () => void;
  onCursorLeft: () => void;
  onCursorRight: () => void;
  onHistoryUp: () => void;
  onHistoryDown: () => void;
  onOpenModeSetup: () => void;
  onToggleFractionView: () => void;
  onMemoryAdd: () => void;
  onMemorySub: () => void;
  onMemoryRecall: () => void;
  onMemoryStore: (varName: string) => void;
  onMemoryClear: () => void;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

interface KeyConfig {
  id: string;
  label: string;
  shiftLabel?: string;
  alphaLabel?: string;
  type: 'function' | 'scientific' | 'numeric' | 'operator' | 'danger' | 'primary';
  action: () => void;
}

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  onInput,
  onClear,
  onDelete,
  onEquals,
  isShiftActive,
  isAlphaActive,
  onToggleShift,
  onToggleAlpha,
  onCursorLeft,
  onCursorRight,
  onHistoryUp,
  onHistoryDown,
  onOpenModeSetup,
  onToggleFractionView,
  onMemoryAdd,
  onMemorySub,
  onMemoryRecall,
  onMemoryStore,
  onMemoryClear,
  soundEnabled,
  hapticEnabled,
}) => {
  const handleKeyClick = (config: KeyConfig) => {
    if (soundEnabled) {
      if (config.type === 'danger') soundManager.playClearClick();
      else if (config.type === 'primary') soundManager.playActionClick();
      else soundManager.playKeyClick(config.type === 'numeric' ? 520 : 640);
    }
    if (hapticEnabled) {
      soundManager.triggerHaptic(10);
    }

    // Execute logic based on Shift/Alpha states
    if (isShiftActive && config.shiftLabel) {
      onToggleShift(); // consume shift
      handleShiftAction(config.id);
      return;
    }

    if (isAlphaActive && config.alphaLabel) {
      onToggleAlpha(); // consume alpha
      handleAlphaAction(config.alphaLabel);
      return;
    }

    config.action();
  };

  const handleShiftAction = (keyId: string) => {
    switch (keyId) {
      case 'sin':
        onInput('sin⁻¹(');
        break;
      case 'cos':
        onInput('cos⁻¹(');
        break;
      case 'tan':
        onInput('tan⁻¹(');
        break;
      case 'sqrt':
        onInput('³√(');
        break;
      case 'pow':
        onInput('^(1/');
        break;
      case 'sqr':
        onInput('^3');
        break;
      case 'log':
        onInput('10^(');
        break;
      case 'ln':
        onInput('e^(');
        break;
      case 'hyp':
        onInput('asinh(');
        break;
      case 'fact':
        onInput('⁻¹');
        break;
      case 'exp':
        onInput('π');
        break;
      case 'ans':
        onInput('%');
        break;
      case 'mplus':
        onMemorySub();
        break;
      case 'rcl':
        onMemoryStore('M');
        break;
      case 'paren_open':
        onInput('%');
        break;
      case 'paren_close':
        onInput(',');
        break;
      case 'pi':
        onInput('π');
        break;
      case 'calc':
        onEquals();
        break;
      case 'sd':
        onToggleFractionView();
        break;
      case 'mode':
        onOpenModeSetup();
        break;
      case 'del':
        onDelete();
        break;
      case 'ac':
        onClear();
        break;
      case 'eng':
        onInput('i');
        break;
      case 'mult':
        onInput('nPr');
        break;
      case 'div':
        onInput('nCr');
        break;
      case 'dot':
        onInput(Math.random().toFixed(3));
        break;
      case '0':
        onInput('Rnd(');
        break;
      case 'add':
        onInput('Pol(');
        break;
      case 'sub':
        onInput('Rec(');
        break;
      case 'frac':
        onInput(' 믐 ');
        break;
      default:
        break;
    }
  };

  const handleAlphaAction = (alphaChar: string) => {
    if (alphaChar.toLowerCase() === 'e') {
      onInput('e');
    } else if (['A', 'B', 'C', 'D', 'X', 'Y', 'M', 'E', 'F'].includes(alphaChar.toUpperCase())) {
      onInput(alphaChar.toUpperCase());
    } else if (alphaChar === '=') {
      onInput('=');
    } else if (alphaChar === ':') {
      onInput(' : ');
    }
  };

  // Scientific row definitions
  const scientificRow1: KeyConfig[] = [
    {
      id: 'calc',
      label: 'CALC',
      shiftLabel: 'SOLVE',
      alphaLabel: '=',
      type: 'scientific',
      action: () => onEquals(),
    },
    {
      id: 'frac',
      label: '믐',
      shiftLabel: 'a b/c',
      type: 'scientific',
      action: () => onInput('/'),
    },
    {
      id: 'sqrt',
      label: '√',
      shiftLabel: '³√',
      type: 'scientific',
      action: () => onInput('√('),
    },
    {
      id: 'sqr',
      label: 'x²',
      shiftLabel: 'x³',
      type: 'scientific',
      action: () => onInput('²'),
    },
    {
      id: 'pow',
      label: 'xʸ',
      shiftLabel: 'ⁿ√',
      type: 'scientific',
      action: () => onInput('^'),
    },
    {
      id: 'log',
      label: 'log',
      shiftLabel: '10ˣ',
      type: 'scientific',
      action: () => onInput('log('),
    },
    {
      id: 'ln',
      label: 'ln',
      shiftLabel: 'eˣ',
      type: 'scientific',
      action: () => onInput('ln('),
    },
  ];

  const scientificRow2: KeyConfig[] = [
    {
      id: 'neg',
      label: '(-)',
      alphaLabel: 'A',
      type: 'scientific',
      action: () => onInput('-'),
    },
    {
      id: 'fact',
      label: 'x!',
      shiftLabel: 'x⁻¹',
      alphaLabel: 'B',
      type: 'scientific',
      action: () => onInput('!'),
    },
    {
      id: 'hyp',
      label: 'hyp',
      alphaLabel: 'C',
      type: 'scientific',
      action: () => onInput('sinh('),
    },
    {
      id: 'sin',
      label: 'sin',
      shiftLabel: 'sin⁻¹',
      alphaLabel: 'D',
      type: 'scientific',
      action: () => onInput('sin('),
    },
    {
      id: 'cos',
      label: 'cos',
      shiftLabel: 'cos⁻¹',
      alphaLabel: 'E',
      type: 'scientific',
      action: () => onInput('cos('),
    },
    {
      id: 'tan',
      label: 'tan',
      shiftLabel: 'tan⁻¹',
      alphaLabel: 'F',
      type: 'scientific',
      action: () => onInput('tan('),
    },
  ];

  const scientificRow3: KeyConfig[] = [
    {
      id: 'rcl',
      label: 'RCL',
      shiftLabel: 'STO',
      type: 'scientific',
      action: () => onMemoryRecall(),
    },
    {
      id: 'eng',
      label: 'ENG',
      shiftLabel: 'i',
      type: 'scientific',
      action: () => onInput('×10^'),
    },
    {
      id: 'paren_open',
      label: '(',
      shiftLabel: '%',
      alphaLabel: 'X',
      type: 'scientific',
      action: () => onInput('('),
    },
    {
      id: 'paren_close',
      label: ')',
      shiftLabel: ',',
      alphaLabel: 'Y',
      type: 'scientific',
      action: () => onInput(')'),
    },
    {
      id: 'sd',
      label: 'S↔D',
      type: 'scientific',
      action: () => onToggleFractionView(),
    },
    {
      id: 'mplus',
      label: 'M+',
      shiftLabel: 'M−',
      alphaLabel: 'M',
      type: 'scientific',
      action: () => onMemoryAdd(),
    },
  ];

  // Numeric & Arithmetic Grid
  const primaryRows: KeyConfig[][] = [
    [
      { id: '7', label: '7', type: 'numeric', action: () => onInput('7') },
      { id: '8', label: '8', type: 'numeric', action: () => onInput('8') },
      { id: '9', label: '9', type: 'numeric', action: () => onInput('9') },
      { id: 'del', label: 'DEL', shiftLabel: 'INS', type: 'danger', action: () => onDelete() },
      { id: 'ac', label: 'AC', shiftLabel: 'OFF', type: 'danger', action: () => onClear() },
    ],
    [
      { id: '4', label: '4', type: 'numeric', action: () => onInput('4') },
      { id: '5', label: '5', type: 'numeric', action: () => onInput('5') },
      { id: '6', label: '6', type: 'numeric', action: () => onInput('6') },
      { id: 'mult', label: '×', shiftLabel: 'nPr', type: 'operator', action: () => onInput('×') },
      { id: 'div', label: '÷', shiftLabel: 'nCr', type: 'operator', action: () => onInput('÷') },
    ],
    [
      { id: '1', label: '1', type: 'numeric', action: () => onInput('1') },
      { id: '2', label: '2', type: 'numeric', action: () => onInput('2') },
      { id: '3', label: '3', type: 'numeric', action: () => onInput('3') },
      { id: 'add', label: '+', shiftLabel: 'Pol', type: 'operator', action: () => onInput('+') },
      { id: 'sub', label: '−', shiftLabel: 'Rec', type: 'operator', action: () => onInput('−') },
    ],
    [
      { id: '0', label: '0', shiftLabel: 'Rnd', type: 'numeric', action: () => onInput('0') },
      { id: 'dot', label: '.', shiftLabel: 'Ran#', type: 'numeric', action: () => onInput('.') },
      { id: 'exp', label: '×10ˣ', shiftLabel: 'π', alphaLabel: 'e', type: 'operator', action: () => onInput('×10^') },
      { id: 'ans', label: 'Ans', shiftLabel: '%', type: 'operator', action: () => onInput('Ans') },
      { id: 'equals', label: '=', type: 'primary', action: () => onEquals() },
    ],
  ];

  const renderKey = (k: KeyConfig) => {
    let bgClasses = '';
    let textClasses = 'text-[#111827] dark:text-white font-bold';

    switch (k.type) {
      case 'function':
        bgClasses =
          'bg-[#374151] hover:bg-[#4b5563] active:bg-[#1f2937] text-white shadow-xs border border-[#4b5563]/40';
        textClasses = 'text-white font-bold text-xs';
        break;
      case 'scientific':
        bgClasses =
          'bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 active:bg-gray-100 dark:active:bg-slate-900 shadow-xs border border-slate-200/90 dark:border-slate-700';
        textClasses = 'text-[#111827] dark:text-slate-100 font-bold text-xs sm:text-sm';
        break;
      case 'numeric':
        bgClasses =
          'bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 active:bg-gray-100 dark:active:bg-slate-900 shadow-md border border-slate-200/90 dark:border-slate-700';
        textClasses = 'text-[#111827] dark:text-white font-bold text-xl sm:text-2xl';
        break;
      case 'operator':
        bgClasses =
          'bg-[#F2F4F7] dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 active:bg-gray-300 dark:active:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-600';
        textClasses = 'text-[#111827] dark:text-blue-200 font-bold text-lg sm:text-2xl';
        break;
      case 'danger':
        bgClasses =
          'bg-[#E85D04] hover:opacity-90 active:scale-95 text-white shadow-md border border-amber-800/40';
        textClasses = 'text-white font-bold text-base sm:text-lg';
        break;
      case 'primary':
        bgClasses =
          'bg-[#2459D6] hover:bg-[#123EA8] active:scale-95 text-white shadow-lg border border-blue-400/30';
        textClasses = 'text-white font-medium text-2xl sm:text-3xl';
        break;
    }

    return (
      <div key={k.id} className="relative flex flex-col items-center">
        {/* Dual Top Labels: Yellow Shift & Pink Alpha */}
        <div className="w-full flex items-center justify-between px-1 h-3.5 mb-0.5 pointer-events-none select-none">
          <span className="text-[9px] font-bold text-[#EAB308] dark:text-[#FFD21F] truncate drop-shadow-xs">
            {k.shiftLabel || ''}
          </span>
          <span className="text-[9px] font-bold text-pink-500 truncate drop-shadow-xs">
            {k.alphaLabel || ''}
          </span>
        </div>

        {/* Clean Minimalism Calculator Button */}
        <button
          id={`key-${k.id}`}
          onClick={() => handleKeyClick(k)}
          className={`w-full h-10 sm:h-12 rounded-md sm:rounded-lg flex items-center justify-center select-none transition-all active:translate-y-0.5 active:shadow-xs ${bgClasses} ${textClasses}`}
        >
          {k.label}
        </button>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-2.5 select-none" id="calculator-keypad">
      {/* Top Header Row: SHIFT, ALPHA, D-PAD, MODE, ON */}
      <div className="w-full flex items-center justify-between gap-2 px-1">
        {/* Left Side: Shift & Alpha */}
        <div className="flex flex-col gap-2 w-20 sm:w-24">
          <button
            id="key-shift"
            onClick={onToggleShift}
            className={`h-9 sm:h-10 rounded-lg font-bold text-xs tracking-wider shadow-sm transition-all active:translate-y-0.5 ${
              isShiftActive
                ? 'bg-yellow-400 text-[#082765] border border-yellow-500 shadow-md ring-2 ring-yellow-400'
                : 'bg-[#374151] hover:bg-[#4b5563] text-white border border-gray-600'
            }`}
          >
            SHIFT
          </button>
          <button
            id="key-alpha"
            onClick={onToggleAlpha}
            className={`h-9 sm:h-10 rounded-lg font-bold text-xs tracking-wider shadow-sm transition-all active:translate-y-0.5 ${
              isAlphaActive
                ? 'bg-pink-600 text-white border border-pink-400 shadow-md ring-2 ring-pink-500'
                : 'bg-[#374151] hover:bg-[#4b5563] text-[#FFD21F] border border-gray-600'
            }`}
          >
            ALPHA
          </button>
        </div>

        {/* Center: Physical Circular D-Pad */}
        <div className="flex-1 flex justify-center">
          <DpadController
            onCursorLeft={onCursorLeft}
            onCursorRight={onCursorRight}
            onHistoryUp={onHistoryUp}
            onHistoryDown={onHistoryDown}
            onCenterClick={onEquals}
          />
        </div>

        {/* Right Side: MODE & ON */}
        <div className="flex flex-col gap-2 w-20 sm:w-24">
          <button
            id="key-mode"
            onClick={onOpenModeSetup}
            className="h-9 sm:h-10 rounded-lg font-bold text-xs uppercase tracking-wider bg-[#374151] hover:bg-[#4b5563] text-white border border-gray-600 shadow-sm transition-all active:translate-y-0.5"
          >
            MODE
          </button>
          <button
            id="key-on"
            onClick={onClear}
            className="h-9 sm:h-10 rounded-lg font-bold text-xs uppercase tracking-wider bg-[#374151] hover:bg-[#4b5563] text-white border border-gray-600 shadow-sm transition-all active:translate-y-0.5"
          >
            SETUP
          </button>
        </div>
      </div>

      {/* Scientific Function Keys Section */}
      <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-[#F2F4F7] dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {scientificRow1.map(renderKey)}
        </div>
        <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
          {scientificRow2.map(renderKey)}
        </div>
        <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
          {scientificRow3.map(renderKey)}
        </div>
      </div>

      {/* Quick Scientific Math Bar: π, e, %, sin⁻¹, cos⁻¹, tan⁻¹, √, x! */}
      <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 rounded-xl bg-[#082765]/5 dark:bg-slate-900/40 border border-[#082765]/10 dark:border-slate-800">
        <span className="text-[10px] font-black text-[#082765] dark:text-blue-400 font-mono pl-1 hidden sm:inline uppercase tracking-wider">
          Quick:
        </span>
        <div className="grid grid-cols-6 sm:flex sm:flex-wrap items-center gap-1 sm:gap-1.5 flex-1">
          <button
            type="button"
            onClick={() => onInput('π')}
            className="flex-1 min-w-[34px] py-1 px-1 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#082765] dark:text-blue-300 font-mono text-center font-bold text-xs shadow-xs border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95 transition-all"
            title="Pi constant (π ≈ 3.14159...)"
          >
            π
          </button>
          <button
            type="button"
            onClick={() => onInput('e')}
            className="flex-1 min-w-[34px] py-1 px-1 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#082765] dark:text-blue-300 font-mono text-center font-bold italic text-xs shadow-xs border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95 transition-all"
            title="Euler's constant (e ≈ 2.71828...)"
          >
            e
          </button>
          <button
            type="button"
            onClick={() => onInput('%')}
            className="flex-1 min-w-[34px] py-1 px-1 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#082765] dark:text-blue-300 font-mono text-center font-bold text-xs shadow-xs border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95 transition-all"
            title="Percentage (%)"
          >
            %
          </button>
          <button
            type="button"
            onClick={() => onInput('sin⁻¹(')}
            className="flex-1 min-w-[42px] py-1 px-1 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#082765] dark:text-blue-300 font-mono text-center font-bold text-[11px] shadow-xs border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95 transition-all"
            title="Inverse Sine (sin⁻¹ / arcsin)"
          >
            sin⁻¹
          </button>
          <button
            type="button"
            onClick={() => onInput('cos⁻¹(')}
            className="flex-1 min-w-[42px] py-1 px-1 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#082765] dark:text-blue-300 font-mono text-center font-bold text-[11px] shadow-xs border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95 transition-all"
            title="Inverse Cosine (cos⁻¹ / arccos)"
          >
            cos⁻¹
          </button>
          <button
            type="button"
            onClick={() => onInput('tan⁻¹(')}
            className="flex-1 min-w-[42px] py-1 px-1 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#082765] dark:text-blue-300 font-mono text-center font-bold text-[11px] shadow-xs border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95 transition-all"
            title="Inverse Tangent (tan⁻¹ / arctan)"
          >
            tan⁻¹
          </button>
        </div>
      </div>

      {/* Numeric & Arithmetic Primary Keypad */}
      <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-[#F2F4F7] dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
        {primaryRows.map((row, idx) => (
          <div key={idx} className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {row.map(renderKey)}
          </div>
        ))}
      </div>
    </div>
  );
};
