/**
 * DSTGH SCIENTIFIC CALCULATOR - Main Application
 * Brand: DSTGH | Model: DSTGH-SC991 | Tagline: "Your Smart Partner for Study"
 * 417+ Functions • Natural Display • High-Precision Math Engine • Offline PWA
 */

import React, { useState, useEffect, useCallback } from 'react';
import { CalculatorDisplay } from './components/CalculatorDisplay';
import { CalculatorKeypad } from './components/CalculatorKeypad';
import { EquationsModal } from './components/EquationsModal';
import { StatisticsModal } from './components/StatisticsModal';
import { CalculusModal } from './components/CalculusModal';
import { MatrixModal } from './components/MatrixModal';
import { VectorModal } from './components/VectorModal';
import { BaseNModal } from './components/BaseNModal';
import { UnitConverterModal } from './components/UnitConverterModal';
import { TableModal } from './components/TableModal';
import { ComplexModal } from './components/ComplexModal';
import { FormulaLibraryModal } from './components/FormulaLibraryModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { StudyModeExplainer } from './components/StudyModeExplainer';
import { SettingsModal } from './components/SettingsModal';
import { SelfTestRunner } from './components/SelfTestRunner';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { AdminPortalModal } from './components/AdminPortalModal';
import { ShareModal } from './components/ShareModal';

import { MathEvaluator } from './math/evaluator';
import { StorageManager } from './math/storage';
import { StudyModeEngine, StudyExplanation } from './math/studyMode';
import { soundManager } from './math/audio';
import { ActiveNavTab, CalculatorSettings, HistoryItem, MemoryBank } from './types';
import {
  Calculator as CalcIcon,
  HelpCircle,
  Binary,
  Grid3X3,
  Navigation,
  Sigma,
  BarChart3,
  Ruler,
  Table as TableIcon,
  Sparkles,
  BookOpen,
  History,
  Settings,
} from 'lucide-react';

export default function App() {
  // Settings & Memory from Persistent Storage
  const [settings, setSettings] = useState<CalculatorSettings>(() => StorageManager.getSettings());
  const [memory, setMemory] = useState<MemoryBank>(() => StorageManager.getMemory());
  const [history, setHistory] = useState<HistoryItem[]>(() => StorageManager.getHistory());

  // Calculator Engine State
  const [expression, setExpression] = useState<string>('');
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [result, setResult] = useState<string>('0');
  const [fractionResult, setFractionResult] = useState<string | undefined>(undefined);
  const [mixedFractionResult, setMixedFractionResult] = useState<string | undefined>(undefined);
  const [fractionViewMode, setFractionViewMode] = useState<'decimal' | 'fraction' | 'mixed'>('decimal');
  const [isComplexResult, setIsComplexResult] = useState<boolean>(false);
  const [isFractionView, setIsFractionView] = useState<boolean>(false);
  const [lastNumericValue, setLastNumericValue] = useState<number>(0);
  const [error, setError] = useState<string | undefined>(undefined);

  // Keypad Modifier States
  const [isShiftActive, setIsShiftActive] = useState<boolean>(false);
  const [isAlphaActive, setIsAlphaActive] = useState<boolean>(false);

  // History Browsing with D-Pad
  const [historyPointer, setHistoryPointer] = useState<number>(-1);

  // Active Modals & Views
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('calculator');
  const [isModeSetupOpen, setIsModeSetupOpen] = useState<boolean>(false);
  const [studyExplanation, setStudyExplanation] = useState<StudyExplanation | null>(null);
  const [isSelfTestOpen, setIsSelfTestOpen] = useState<boolean>(false);

  // Theme Synchronizer
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System match
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Persist settings, memory, history on changes
  useEffect(() => {
    StorageManager.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    StorageManager.saveMemory(memory);
  }, [memory]);

  useEffect(() => {
    StorageManager.saveHistory(history);
  }, [history]);

  // Update Settings helper
  const handleUpdateSettings = (partial: Partial<CalculatorSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  // Expression Insertion at Cursor
  const handleInsertInput = useCallback(
    (inputStr: string) => {
      setError(undefined);
      setHistoryPointer(-1);

      setExpression((prev) => {
        const before = prev.slice(0, cursorPosition);
        const after = prev.slice(cursorPosition);
        const next = before + inputStr + after;
        setCursorPosition(before.length + inputStr.length);
        return next;
      });
    },
    [cursorPosition]
  );

  // Clear / All Clear (AC)
  const handleClear = useCallback(() => {
    setError(undefined);
    setExpression('');
    setCursorPosition(0);
    setResult('0');
    setFractionResult(undefined);
    setMixedFractionResult(undefined);
    setFractionViewMode('decimal');
    setIsComplexResult(false);
    setIsFractionView(false);
    setIsShiftActive(false);
    setIsAlphaActive(false);
    setHistoryPointer(-1);
  }, []);

  // Backspace / Delete (DEL)
  const handleDelete = useCallback(() => {
    setError(undefined);
    setExpression((prev) => {
      if (cursorPosition === 0) return prev;
      const before = prev.slice(0, cursorPosition - 1);
      const after = prev.slice(cursorPosition);
      setCursorPosition(cursorPosition - 1);
      return before + after;
    });
  }, [cursorPosition]);

  // Cursor Navigation
  const handleCursorLeft = useCallback(() => {
    setCursorPosition((pos) => Math.max(0, pos - 1));
  }, []);

  const handleCursorRight = useCallback(() => {
    setCursorPosition((pos) => Math.min(expression.length, pos + 1));
  }, [expression.length]);

  // History Navigation using D-Pad Up / Down
  const handleHistoryUp = useCallback(() => {
    if (history.length === 0) return;
    const nextPtr = Math.min(history.length - 1, historyPointer + 1);
    setHistoryPointer(nextPtr);
    const item = history[nextPtr];
    if (item) {
      setExpression(item.expression);
      setCursorPosition(item.expression.length);
      setResult(item.result);
      setFractionResult(item.fractionResult);
    }
  }, [history, historyPointer]);

  const handleHistoryDown = useCallback(() => {
    if (historyPointer <= 0) {
      setHistoryPointer(-1);
      setExpression('');
      setCursorPosition(0);
      setResult('0');
      return;
    }
    const nextPtr = historyPointer - 1;
    setHistoryPointer(nextPtr);
    const item = history[nextPtr];
    if (item) {
      setExpression(item.expression);
      setCursorPosition(item.expression.length);
      setResult(item.result);
      setFractionResult(item.fractionResult);
    }
  }, [history, historyPointer]);

  // Evaluate Equation (=)
  const handleEquals = useCallback(() => {
    if (!expression.trim()) return;

    setError(undefined);
    setIsShiftActive(false);
    setIsAlphaActive(false);

    try {
      const evaluator = new MathEvaluator(
        settings.angleMode,
        memory,
        settings.decimalPrecision
      );

      const evalRes = evaluator.evaluate(expression);

      if (evalRes.error) {
        setError(evalRes.error);
        if (settings.soundEnabled) soundManager.playErrorTone();
        return;
      }

      setResult(evalRes.displayText);
      setFractionResult(evalRes.fractionValue);
      setMixedFractionResult(evalRes.mixedFractionValue);
      setFractionViewMode('decimal');
      setIsComplexResult(!!evalRes.isComplex);
      setLastNumericValue(evalRes.numericValue);

      // Update Ans variable in memory
      setMemory((prev) => ({ ...prev, Ans: isNaN(evalRes.numericValue) ? prev.Ans : evalRes.numericValue }));

      // Add to History
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        expression,
        result: evalRes.displayText,
        fractionResult: evalRes.fractionValue,
        mixedFractionResult: evalRes.mixedFractionValue,
        isComplex: evalRes.isComplex,
        complexResult: evalRes.complexValue?.polar,
        timestamp: Date.now(),
        angleMode: settings.angleMode,
      };
      setHistory((prev) => [newHistoryItem, ...prev]);

      // If Study Mode is active, generate step-by-step breakdown
      if (settings.studyModeEnabled) {
        const explanation = StudyModeEngine.explain(
          expression,
          evalRes.displayText,
          evalRes.numericValue
        );
        if (explanation) {
          setStudyExplanation(explanation);
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Math ERROR';
      setError(msg);
      if (settings.soundEnabled) soundManager.playErrorTone();
    }
  }, [expression, settings, memory]);

  // S<=>D Toggle (Cycles: Decimal -> Improper Fraction -> Mixed Fraction -> Decimal, or Rectangular -> Polar)
  const handleToggleFractionView = useCallback(() => {
    if (mixedFractionResult) {
      setFractionViewMode((prev) => {
        if (prev === 'decimal') return 'fraction';
        if (prev === 'fraction') return 'mixed';
        return 'decimal';
      });
    } else if (fractionResult) {
      setFractionViewMode((prev) => (prev === 'decimal' ? 'fraction' : 'decimal'));
    }
  }, [fractionResult, mixedFractionResult]);

  // Memory Functions: M+, M-, RCL, STO
  const handleMemoryAdd = useCallback(() => {
    setMemory((prev) => ({ ...prev, M: prev.M + lastNumericValue }));
    handleInsertInput('');
  }, [lastNumericValue, handleInsertInput]);

  const handleMemorySub = useCallback(() => {
    setMemory((prev) => ({ ...prev, M: prev.M - lastNumericValue }));
  }, [lastNumericValue]);

  const handleMemoryRecall = useCallback(() => {
    handleInsertInput(memory.M.toString());
  }, [memory.M, handleInsertInput]);

  const handleMemoryStore = useCallback(
    (varName: string) => {
      setMemory((prev) => ({ ...prev, [varName]: lastNumericValue }));
    },
    [lastNumericValue]
  );

  const handleClearMemory = useCallback(() => {
    setMemory({ A: 0, B: 0, C: 0, D: 0, X: 0, Y: 0, M: 0, Ans: 0 });
  }, []);

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing inside modal inputs
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleInsertInput(e.key);
      } else if (['+', '-', '*', '/', '^', '(', ')', '.'].includes(e.key)) {
        e.preventDefault();
        const map: Record<string, string> = {
          '*': '×',
          '/': '÷',
          '-': '−',
        };
        handleInsertInput(map[e.key] || e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleCursorLeft();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleCursorRight();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleHistoryUp();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleHistoryDown();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleInsertInput,
    handleEquals,
    handleDelete,
    handleClear,
    handleCursorLeft,
    handleCursorRight,
    handleHistoryUp,
    handleHistoryDown,
  ]);

  // Modes definitions for MODE button menu
  const modeMenuItems = [
    { id: 'calculator', name: '1: COMP', desc: 'Standard Scientific & Arithmetic Computation', icon: CalcIcon },
    { id: 'complex', name: '2: CMPLX', desc: 'Complex Numbers & Polar Forms (a+bi, r∠θ)', icon: Sparkles },
    { id: 'statistics', name: '3: STAT', desc: '1-Var Statistics & 2-Var Regression', icon: BarChart3 },
    { id: 'baseN', name: '4: BASE-N', desc: 'DEC / BIN / OCT / HEX & Bitwise Logic', icon: Binary },
    { id: 'equations', name: '5: EQN / SOLVE', desc: 'Linear, Quadratic & 2×2, 3×3 Systems', icon: CalcIcon },
    { id: 'matrix', name: '6: MATRIX', desc: '2×2 and 3×3 Matrix Algebra & Determinants', icon: Grid3X3 },
    { id: 'table', name: '7: TABLE', desc: 'f(x) Function Table Generator', icon: TableIcon },
    { id: 'vector', name: '8: VECTOR', desc: '2D & 3D Vector Math, Dot & Cross Products', icon: Navigation },
    { id: 'calculus', name: '9: CALCULUS', desc: 'Numerical Derivatives & Definite Integrals', icon: Sigma },
    { id: 'converter', name: '10: CONVERT', desc: '14 Comprehensive Unit Categories', icon: Ruler },
    { id: 'formulas', name: '11: FORMULAS', desc: 'Academic & Professional Reference Library', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F2F4F7] dark:bg-[#0A0E1A] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 font-sans">
      {/* PWA offline & Install Notification */}
      <PWAInstallBanner />

      {/* Clean Minimalism Main Enclosure Frame */}
      <div className="w-full max-w-6xl bg-white dark:bg-slate-900 rounded-[28px] sm:rounded-[40px] shadow-2xl border-[6px] sm:border-[10px] md:border-[12px] border-[#123EA8] flex flex-col md:flex-row overflow-hidden my-auto">
        {/* Aside Navigation Column (Clean Minimalism Sidebar) */}
        <aside className="w-full md:w-72 bg-[#082765] p-5 sm:p-6 flex flex-col text-white shrink-0 justify-between">
          <div>
            <div className="mb-6 flex items-center justify-between md:block">
              <div>
                <div className="text-2xl sm:text-3xl font-black tracking-tighter text-white">DSTGH</div>
                <div className="text-[10px] uppercase tracking-widest text-blue-200/60 font-semibold mt-0.5">Digital Solution Ghana</div>
              </div>
              <div className="md:hidden flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('history')}
                  title="History"
                  className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <History className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  title="Settings"
                  className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            <nav className="space-y-2 md:space-y-3">
              {[
                { id: 'calculator', label: '🧮 CALCULATOR' },
                { id: 'statistics', label: '📊 STATISTICS' },
                { id: 'equations', label: '📐 EQUATIONS' },
                { id: 'converter', label: '🔄 CONVERTER' },
                { id: 'formulas', label: '📚 FORMULAS' },
                { id: 'calculus', label: '⚡ CALCULUS' },
                { id: 'matrix', label: '🔢 MATRIX & VECTOR' },
                { id: 'baseN', label: '🧬 BASE-N' },
                { id: 'admin', label: '🛡️ PORTAL & ADMIN' },
                { id: 'share', label: '🔗 SHARE & SOCIAL' },
              ].map((item) => {
                const isActive =
                  activeTab === item.id ||
                  (item.id === 'matrix' && activeTab === 'vector');
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveTab(item.id as ActiveNavTab)}
                    className={`p-2.5 sm:p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all select-none ${
                      isActive
                        ? 'bg-white/15 text-white font-semibold shadow-xs'
                        : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isActive ? 'bg-yellow-400' : 'bg-transparent border border-white/40'
                      }`}
                    />
                    <span className="text-xs sm:text-sm tracking-wide truncate">{item.label}</span>
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="mt-6 md:mt-8 space-y-3">
            {/* Quick Actions for History & Settings on Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setActiveTab('history')}
                className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <History className="w-3.5 h-3.5" />
                <span>History ({history.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
                title="Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Study Mode Interactive Card */}
            <div
              onClick={() =>
                handleUpdateSettings({ studyModeEnabled: !settings.studyModeEnabled })
              }
              className="p-3.5 sm:p-4 bg-yellow-400 rounded-2xl text-[#082765] cursor-pointer hover:bg-yellow-300 transition-colors shadow-sm select-none"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-black uppercase tracking-wide">Study Mode</div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  settings.studyModeEnabled ? 'bg-[#082765] text-yellow-400' : 'bg-[#082765]/20 text-[#082765]'
                }`}>
                  {settings.studyModeEnabled ? 'ACTIVE' : 'OFF'}
                </span>
              </div>
              <p className="text-[10px] leading-tight opacity-85 font-medium">
                Explanations enabled for equations and complex functions.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-[#F2F4F7] dark:bg-slate-950 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {/* Header */}
          <header className="flex justify-between items-start mb-4 sm:mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#123EA8] dark:text-blue-400 leading-none">
                DSTGH
              </h1>
              <h2 className="text-xs font-bold text-[#082765] dark:text-blue-200 tracking-[0.2em] mt-1">
                SCIENTIFIC CALCULATOR <span className="ml-2 text-gray-400 dark:text-gray-500 font-normal">SC991</span>
              </h2>
              <div className="text-[11px] font-bold text-blue-700 dark:text-blue-300 tracking-wide mt-0.5">
                Digital Solution Tech Ghana
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="bg-[#123EA8] text-white px-3 py-1 rounded-full text-[10px] font-bold inline-block mb-1 shadow-xs">
                417+ FUNCTIONS
              </div>
              <div className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 font-medium italic">
                "Your Smart Partner for Study"
              </div>
            </div>
          </header>

          {/* Calculator Screen & Controls */}
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-3">
            {/* LCD Display */}
            <CalculatorDisplay
              expression={expression}
              cursorPosition={cursorPosition}
              result={result}
              fractionResult={fractionResult}
              mixedFractionResult={mixedFractionResult}
              fractionViewMode={fractionViewMode}
              isComplex={isComplexResult}
              isFractionView={fractionViewMode !== 'decimal'}
              onToggleFractionView={handleToggleFractionView}
              angleMode={settings.angleMode}
              onSelectAngleMode={(mode) => handleUpdateSettings({ angleMode: mode })}
              isShiftActive={isShiftActive}
              isAlphaActive={isAlphaActive}
              isMemoryActive={memory.M !== 0}
              isStatActive={activeTab === 'statistics'}
              isBaseActive={activeTab === 'baseN'}
              error={error}
              onClearError={() => setError(undefined)}
              ansValue={memory.Ans}
            />

            {/* Keypad */}
            <CalculatorKeypad
              onInput={handleInsertInput}
              onClear={handleClear}
              onDelete={handleDelete}
              onEquals={handleEquals}
              isShiftActive={isShiftActive}
              isAlphaActive={isAlphaActive}
              onToggleShift={() => setIsShiftActive((prev) => !prev)}
              onToggleAlpha={() => setIsAlphaActive((prev) => !prev)}
              onCursorLeft={handleCursorLeft}
              onCursorRight={handleCursorRight}
              onHistoryUp={handleHistoryUp}
              onHistoryDown={handleHistoryDown}
              onOpenModeSetup={() => setIsModeSetupOpen(true)}
              onToggleFractionView={handleToggleFractionView}
              onMemoryAdd={handleMemoryAdd}
              onMemorySub={handleMemorySub}
              onMemoryRecall={handleMemoryRecall}
              onMemoryStore={handleMemoryStore}
              onMemoryClear={handleClearMemory}
              soundEnabled={settings.soundEnabled}
              hapticEnabled={settings.hapticEnabled}
            />
          </div>

          {/* Quick Mode Switch Pills */}
          <div className="w-full max-w-2xl mx-auto mt-4 flex flex-wrap justify-center gap-1.5 px-2 pt-2">
            <button
              onClick={() => setActiveTab('equations')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition-all"
            >
              Solve Equations
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition-all"
            >
              Statistics & Reg
            </button>
            <button
              onClick={() => setActiveTab('calculus')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition-all"
            >
              d/dx & ∫
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition-all"
            >
              Matrix
            </button>
            <button
              onClick={() => setActiveTab('vector')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition-all"
            >
              Vector
            </button>
            <button
              onClick={() => setActiveTab('baseN')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition-all"
            >
              Base-N
            </button>
            <button
              onClick={() => setActiveTab('converter')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition-all"
            >
              Unit Converter
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition-all"
            >
              Table f(x)
            </button>
            <button
              onClick={() => setActiveTab('formulas')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition-all"
            >
              Formulas
            </button>
          </div>
        </main>
      </div>

      {/* MODE / SETUP Popover Modal */}
      {isModeSetupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-900/40 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-[#082765] text-white flex items-center justify-between">
              <h3 className="font-bold text-base tracking-wide">DSTGH MODE / SETUP</h3>
              <button
                onClick={() => setIsModeSetupOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex flex-col gap-1.5 max-h-[70vh] overflow-y-auto">
              {modeMenuItems.map((m) => {
                const IconComponent = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setIsModeSetupOpen(false);
                      setActiveTab(m.id as ActiveNavTab);
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-blue-300 group"
                  >
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {m.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {m.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Specialized Mode Modals */}
      <EquationsModal
        isOpen={activeTab === 'equations'}
        onClose={() => setActiveTab('calculator')}
        onInsertToCalculator={handleInsertInput}
      />

      <StatisticsModal
        isOpen={activeTab === 'statistics'}
        onClose={() => setActiveTab('calculator')}
        onInsertToCalculator={handleInsertInput}
      />

      <CalculusModal
        isOpen={activeTab === 'calculus'}
        onClose={() => setActiveTab('calculator')}
        onInsertToCalculator={handleInsertInput}
      />

      <MatrixModal
        isOpen={activeTab === 'matrix'}
        onClose={() => setActiveTab('calculator')}
      />

      <VectorModal
        isOpen={activeTab === 'vector'}
        onClose={() => setActiveTab('calculator')}
      />

      <BaseNModal
        isOpen={activeTab === 'baseN'}
        onClose={() => setActiveTab('calculator')}
        onInsertToCalculator={handleInsertInput}
      />

      <UnitConverterModal
        isOpen={activeTab === 'converter'}
        onClose={() => setActiveTab('calculator')}
        onInsertToCalculator={handleInsertInput}
      />

      <TableModal
        isOpen={activeTab === 'table'}
        onClose={() => setActiveTab('calculator')}
        angleMode={settings.angleMode}
      />

      <ComplexModal
        isOpen={activeTab === 'complex'}
        onClose={() => setActiveTab('calculator')}
        angleMode={settings.angleMode}
        onInsertToCalculator={handleInsertInput}
      />

      <FormulaLibraryModal
        isOpen={activeTab === 'formulas'}
        onClose={() => setActiveTab('calculator')}
        onInsertToCalculator={handleInsertInput}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={activeTab === 'history'}
        onClose={() => setActiveTab('calculator')}
        history={history}
        onSelectExpression={(expr) => {
          setExpression(expr);
          setCursorPosition(expr.length);
        }}
        onSelectResult={(res) => handleInsertInput(res)}
        onExplainItem={(item) => {
          const exp = StudyModeEngine.explain(
            item.expression,
            item.result,
            parseFloat(item.result) || 0
          );
          if (exp) setStudyExplanation(exp);
        }}
        onClearHistory={() => setHistory([])}
        onDeleteItem={(id) => setHistory((prev) => prev.filter((h) => h.id !== id))}
      />

      {/* Study Mode Explainer Dialog */}
      <StudyModeExplainer
        explanation={studyExplanation}
        onClose={() => setStudyExplanation(null)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={activeTab === 'settings'}
        onClose={() => setActiveTab('calculator')}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        memory={memory}
        onClearMemory={handleClearMemory}
        onLaunchSelfTest={() => setIsSelfTestOpen(true)}
      />

      {/* Administration, Servers & Payments Portal */}
      <AdminPortalModal
        isOpen={activeTab === 'admin'}
        onClose={() => setActiveTab('calculator')}
      />

      {/* Social Media & Link Sharing with Web App UI Image */}
      <ShareModal
        isOpen={activeTab === 'share'}
        onClose={() => setActiveTab('calculator')}
      />

      {/* Automated Comprehensive Self-Test Runner */}
      <SelfTestRunner
        isOpen={isSelfTestOpen}
        onClose={() => setIsSelfTestOpen(false)}
      />
    </div>
  );
}
