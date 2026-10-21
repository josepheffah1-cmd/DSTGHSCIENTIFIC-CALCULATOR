/**
 * DSTGH SCIENTIFIC CALCULATOR - Statistics & Regression Module (STAT)
 * Comprehensive 1-Variable Statistics & 2-Variable Regression Models
 * Accurate to Casio fx-991 / NIST standards
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  BarChart3,
  Plus,
  Trash2,
  TrendingUp,
  RotateCcw,
  Copy,
  Check,
  Calculator,
  SlidersHorizontal,
  Table as TableIcon,
  Sparkles,
} from 'lucide-react';
import { StatisticsEngine } from '../math/statistics';
import { RegressionSummary, StatSummary } from '../types';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToCalculator?: (val: string) => void;
}

interface Row1Var {
  id: string;
  x: string;
  freq: string;
}

interface Row2Var {
  id: string;
  x: string;
  y: string;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({
  isOpen,
  onClose,
  onInsertToCalculator,
}) => {
  const [activeTab, setActiveTab] = useState<'1var' | 'regression'>('1var');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 1-Var States
  const [isFreqEnabled, setIsFreqEnabled] = useState<boolean>(false);
  const [inputMode1Var, setInputMode1Var] = useState<'table' | 'bulk'>('table');
  const [bulkText1Var, setBulkText1Var] = useState<string>('5, 8, 10, 12, 15');
  const [tableData1Var, setTableData1Var] = useState<Row1Var[]>([
    { id: '1', x: '5', freq: '1' },
    { id: '2', x: '8', freq: '1' },
    { id: '3', x: '10', freq: '1' },
    { id: '4', x: '12', freq: '1' },
    { id: '5', x: '15', freq: '1' },
  ]);
  const [statResult, setStatResult] = useState<StatSummary | null>(() => {
    try {
      return StatisticsEngine.calculate1Var([5, 8, 10, 12, 15]);
    } catch {
      return null;
    }
  });

  // 2-Var Regression States
  const [regType, setRegType] = useState<'linear' | 'quadratic' | 'exponential' | 'logarithmic' | 'power'>('linear');
  const [regData, setRegData] = useState<Row2Var[]>([
    { id: '1', x: '1', y: '2.1' },
    { id: '2', x: '2', y: '4.0' },
    { id: '3', x: '3', y: '6.2' },
    { id: '4', x: '4', y: '8.1' },
    { id: '5', x: '5', y: '9.9' },
  ]);
  const [regResult, setRegResult] = useState<RegressionSummary | null>(() => {
    try {
      return StatisticsEngine.linearRegression([
        { x: 1, y: 2.1 },
        { x: 2, y: 4.0 },
        { x: 3, y: 6.2 },
        { x: 4, y: 8.1 },
        { x: 5, y: 9.9 },
      ]);
    } catch {
      return null;
    }
  });

  // Prediction widget
  const [predictX, setPredictX] = useState<string>('6');
  const [predictedY, setPredictedY] = useState<number | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyOrInsert = (val: string, key: string) => {
    if (onInsertToCalculator) {
      onInsertToCalculator(val);
    } else {
      navigator.clipboard?.writeText(val);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  // --- 1-VAR Handlers ---
  const handleAddRow1Var = () => {
    setTableData1Var((prev) => [
      ...prev,
      { id: Date.now().toString(), x: '', freq: '1' },
    ]);
  };

  const handleUpdateRow1Var = (id: string, field: 'x' | 'freq', val: string) => {
    setTableData1Var((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const handleRemoveRow1Var = (id: string) => {
    setTableData1Var((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClear1Var = () => {
    setTableData1Var([
      { id: '1', x: '', freq: '1' },
      { id: '2', x: '', freq: '1' },
    ]);
    setStatResult(null);
  };

  const handleLoadBulkToTable1Var = () => {
    setErrorMsg(null);
    const parts = bulkText1Var
      .split(/[\s,;\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !isNaN(Number(s)))
      .map(Number);

    if (parts.length === 0) {
      setErrorMsg('No valid numbers found in text');
      return;
    }

    const rows: Row1Var[] = parts.map((n, idx) => ({
      id: `${Date.now()}_${idx}`,
      x: n.toString(),
      freq: '1',
    }));

    setTableData1Var(rows);
    setInputMode1Var('table');
    handleCalculate1VarDirect(rows, isFreqEnabled);
  };

  const handleCalculate1Var = () => {
    handleCalculate1VarDirect(tableData1Var, isFreqEnabled);
  };

  const handleCalculate1VarDirect = (rows: Row1Var[], freqOn: boolean) => {
    setErrorMsg(null);
    try {
      const items = rows
        .map((r) => {
          const x = parseFloat(r.x);
          const f = freqOn ? Math.max(1, parseInt(r.freq, 10) || 1) : 1;
          return { x, freq: f };
        })
        .filter((item) => !isNaN(item.x));

      if (items.length === 0) {
        throw new Error('Please enter at least one valid numerical observation.');
      }

      const res = StatisticsEngine.calculate1Var(items);
      setStatResult(res);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : '1-Var calculation error');
    }
  };

  const loadPreset1Var = (type: 'standard' | 'exam' | 'freq') => {
    setErrorMsg(null);
    if (type === 'standard') {
      const rows: Row1Var[] = [
        { id: '1', x: '5', freq: '1' },
        { id: '2', x: '8', freq: '1' },
        { id: '3', x: '10', freq: '1' },
        { id: '4', x: '12', freq: '1' },
        { id: '5', x: '15', freq: '1' },
      ];
      setTableData1Var(rows);
      setIsFreqEnabled(false);
      handleCalculate1VarDirect(rows, false);
    } else if (type === 'exam') {
      const nums = [72, 85, 90, 68, 85, 92, 78, 88, 95, 84];
      const rows: Row1Var[] = nums.map((n, i) => ({
        id: i.toString(),
        x: n.toString(),
        freq: '1',
      }));
      setTableData1Var(rows);
      setIsFreqEnabled(false);
      handleCalculate1VarDirect(rows, false);
    } else {
      const freqSet = [
        { x: '10', freq: '3' },
        { x: '20', freq: '7' },
        { x: '30', freq: '12' },
        { x: '40', freq: '4' },
      ];
      const rows: Row1Var[] = freqSet.map((item, i) => ({
        id: i.toString(),
        x: item.x,
        freq: item.freq,
      }));
      setTableData1Var(rows);
      setIsFreqEnabled(true);
      handleCalculate1VarDirect(rows, true);
    }
  };

  // --- REGRESSION Handlers ---
  const handleAddRow2Var = () => {
    setRegData((prev) => [
      ...prev,
      { id: Date.now().toString(), x: '', y: '' },
    ]);
  };

  const handleUpdateRow2Var = (id: string, field: 'x' | 'y', val: string) => {
    setRegData((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const handleRemoveRow2Var = (id: string) => {
    setRegData((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClear2Var = () => {
    setRegData([
      { id: '1', x: '', y: '' },
      { id: '2', x: '', y: '' },
    ]);
    setRegResult(null);
  };

  const handleCalculateRegression = (selectedType = regType, dataRows = regData) => {
    setErrorMsg(null);
    try {
      const points = dataRows
        .map((r) => ({ x: parseFloat(r.x), y: parseFloat(r.y) }))
        .filter((p) => !isNaN(p.x) && !isNaN(p.y));

      if (selectedType === 'quadratic') {
        if (points.length < 3) {
          throw new Error('Quadratic regression requires at least 3 distinct (x, y) points.');
        }
      } else {
        if (points.length < 2) {
          throw new Error('Regression requires at least 2 valid (x, y) points.');
        }
      }

      let res: RegressionSummary;
      switch (selectedType) {
        case 'linear':
          res = StatisticsEngine.linearRegression(points);
          break;
        case 'quadratic':
          res = StatisticsEngine.quadraticRegression(points);
          break;
        case 'exponential':
          res = StatisticsEngine.exponentialRegression(points);
          break;
        case 'logarithmic':
          res = StatisticsEngine.logarithmicRegression(points);
          break;
        case 'power':
          res = StatisticsEngine.powerRegression(points);
          break;
        default:
          res = StatisticsEngine.linearRegression(points);
      }

      setRegResult(res);

      // Run prediction for current predictX
      const px = parseFloat(predictX);
      if (!isNaN(px)) {
        setPredictedY(StatisticsEngine.predictY(res, px));
      }
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Regression calculation error');
    }
  };

  const loadPreset2Var = (preset: 'linear' | 'quadratic' | 'exponential') => {
    setErrorMsg(null);
    if (preset === 'linear') {
      const rows: Row2Var[] = [
        { id: '1', x: '1', y: '2.1' },
        { id: '2', x: '2', y: '4.0' },
        { id: '3', x: '3', y: '6.2' },
        { id: '4', x: '4', y: '8.1' },
        { id: '5', x: '5', y: '9.9' },
      ];
      setRegType('linear');
      setRegData(rows);
      handleCalculateRegression('linear', rows);
    } else if (preset === 'quadratic') {
      // Parabolic projectile data: y = -4.9x^2 + 25x + 2
      const rows: Row2Var[] = [
        { id: '1', x: '0', y: '2.0' },
        { id: '2', x: '1', y: '22.1' },
        { id: '3', x: '2', y: '32.4' },
        { id: '4', x: '3', y: '32.9' },
        { id: '5', x: '4', y: '23.6' },
        { id: '6', x: '5', y: '4.5' },
      ];
      setRegType('quadratic');
      setRegData(rows);
      handleCalculateRegression('quadratic', rows);
    } else {
      // Exponential population data: y = 50 * e^(0.4x)
      const rows: Row2Var[] = [
        { id: '1', x: '0', y: '50.0' },
        { id: '2', x: '1', y: '74.6' },
        { id: '3', x: '2', y: '111.3' },
        { id: '4', x: '3', y: '166.0' },
        { id: '5', x: '4', y: '247.7' },
        { id: '6', x: '5', y: '369.5' },
      ];
      setRegType('exponential');
      setRegData(rows);
      handleCalculateRegression('exponential', rows);
    }
  };

  const handlePredict = () => {
    if (!regResult) return;
    const px = parseFloat(predictX);
    if (!isNaN(px)) {
      setPredictedY(StatisticsEngine.predictY(regResult, px));
    }
  };

  return (
    <div
      id="dstgh-stats-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="dstgh-stats-modal-container"
        className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-900/40 overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#082765] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600/60 border border-blue-400/30">
              <BarChart3 className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm sm:text-base tracking-wide uppercase">
                  DSTGH Statistics Module
                </h2>
                <span className="text-[10px] font-mono bg-blue-500/40 px-2 py-0.5 rounded text-blue-200 border border-blue-400/30">
                  STAT-SC991
                </span>
              </div>
              <p className="text-[11px] text-blue-200/80">
                1-Variable Statistics & Multi-Model Regression
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex p-1 bg-slate-200/70 dark:bg-slate-900 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => {
                setActiveTab('1var');
                setErrorMsg(null);
              }}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === '1var'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              1-Variable (1-VAR)
            </button>
            <button
              onClick={() => {
                setActiveTab('regression');
                setErrorMsg(null);
              }}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'regression'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Regression (REG)
            </button>
          </div>

          <div className="hidden sm:flex items-center text-[11px] text-slate-500 font-mono">
            {activeTab === '1var' ? 'Mean • Variance • StdDev • Σx' : 'Linear • Quadratic • Exponential'}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-between animate-in fade-in">
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700">✕</button>
            </div>
          )}

          {/* ===================== TAB 1: 1-VARIABLE STATISTICS ===================== */}
          {activeTab === '1var' && (
            <div className="flex flex-col gap-4">
              {/* Presets & Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                    Presets:
                  </span>
                  <button
                    onClick={() => loadPreset1Var('standard')}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
                  >
                    Casio [5, 8, 10, 12, 15]
                  </button>
                  <button
                    onClick={() => loadPreset1Var('exam')}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
                  >
                    10 Exam Scores
                  </button>
                  <button
                    onClick={() => loadPreset1Var('freq')}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
                  >
                    Frequency Table
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const next = !isFreqEnabled;
                      setIsFreqEnabled(next);
                      handleCalculate1VarDirect(tableData1Var, next);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                      isFreqEnabled
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    FREQ: {isFreqEnabled ? 'ON' : 'OFF'}
                  </button>

                  <button
                    onClick={() => setInputMode1Var(inputMode1Var === 'table' ? 'bulk' : 'table')}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50"
                  >
                    {inputMode1Var === 'table' ? 'Bulk Paste' : 'Table View'}
                  </button>
                </div>
              </div>

              {/* Data Input Area */}
              {inputMode1Var === 'bulk' ? (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Paste or enter numeric values (separated by commas, spaces, or lines):
                  </label>
                  <textarea
                    rows={3}
                    value={bulkText1Var}
                    onChange={(e) => setBulkText1Var(e.target.value)}
                    className="w-full p-2 rounded-lg font-mono text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                    placeholder="e.g. 12, 15, 18, 22, 25, 30"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleLoadBulkToTable1Var}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                    >
                      Load into Editor & Calculate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800/30">
                  <div className="max-h-48 overflow-y-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold sticky top-0 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="p-2 w-12 text-center">#</th>
                          <th className="p-2">X Value</th>
                          {isFreqEnabled && <th className="p-2 w-28">Frequency (f)</th>}
                          <th className="p-2 w-12 text-center">Del</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-mono">
                        {tableData1Var.map((row, idx) => (
                          <tr key={row.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/40">
                            <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                            <td className="p-1">
                              <input
                                type="number"
                                step="any"
                                value={row.x}
                                onChange={(e) => handleUpdateRow1Var(row.id, 'x', e.target.value)}
                                placeholder="Value"
                                className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-bold"
                              />
                            </td>
                            {isFreqEnabled && (
                              <td className="p-1">
                                <input
                                  type="number"
                                  min="1"
                                  step="1"
                                  value={row.freq}
                                  onChange={(e) => handleUpdateRow1Var(row.id, 'freq', e.target.value)}
                                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-bold text-center"
                                />
                              </td>
                            )}
                            <td className="p-1 text-center">
                              {tableData1Var.length > 1 && (
                                <button
                                  onClick={() => handleRemoveRow1Var(row.id)}
                                  className="p-1 text-slate-400 hover:text-rose-500 rounded"
                                  title="Delete row"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-2 bg-slate-100/80 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddRow1Var}
                        className="px-3 py-1.5 rounded-lg border border-dashed border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Observation
                      </button>
                      <button
                        onClick={handleClear1Var}
                        className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-bold flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Clear
                      </button>
                    </div>

                    <button
                      onClick={handleCalculate1Var}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
                    >
                      Calculate 1-VAR
                    </button>
                  </div>
                </div>
              )}

              {/* 1-VAR Results Display */}
              {statResult && (
                <div className="flex flex-col gap-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#082765] dark:text-blue-300">
                      1-Variable Analysis Summary (n = {statResult.n})
                    </h3>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Click any metric to insert into calculator
                    </span>
                  </div>

                  {/* Primary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    {/* Mean */}
                    <div
                      onClick={() => handleCopyOrInsert(statResult.mean.toString(), 'mean')}
                      className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-500 cursor-pointer transition-all group relative"
                    >
                      <span className="text-[10px] text-slate-500 block font-sans font-bold">Mean (x̄)</span>
                      <span className="text-base font-black text-blue-600 dark:text-blue-400">
                        {parseFloat(statResult.mean.toFixed(6))}
                      </span>
                      <div className="text-[9px] text-slate-400 mt-0.5">Arithmetic average</div>
                      {copiedKey === 'mean' && (
                        <span className="absolute top-1 right-1 text-[9px] text-emerald-500 font-bold font-sans">Copied!</span>
                      )}
                    </div>

                    {/* Median */}
                    <div
                      onClick={() => handleCopyOrInsert(statResult.median.toString(), 'med')}
                      className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-500 cursor-pointer transition-all group relative"
                    >
                      <span className="text-[10px] text-slate-500 block font-sans font-bold">Median (Med)</span>
                      <span className="text-base font-black text-slate-800 dark:text-slate-100">
                        {parseFloat(statResult.median.toFixed(6))}
                      </span>
                      <div className="text-[9px] text-slate-400 mt-0.5">50th percentile</div>
                      {copiedKey === 'med' && (
                        <span className="absolute top-1 right-1 text-[9px] text-emerald-500 font-bold font-sans">Copied!</span>
                      )}
                    </div>

                    {/* Mode */}
                    <div
                      onClick={() =>
                        statResult.mode.length > 0 &&
                        handleCopyOrInsert(statResult.mode[0].toString(), 'mode')
                      }
                      className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-500 cursor-pointer transition-all group relative"
                    >
                      <span className="text-[10px] text-slate-500 block font-sans font-bold">Mode</span>
                      <span className="text-base font-black text-slate-800 dark:text-slate-100">
                        {statResult.mode.length > 0 ? statResult.mode.join(', ') : 'None'}
                      </span>
                      <div className="text-[9px] text-slate-400 mt-0.5">Most frequent</div>
                      {copiedKey === 'mode' && (
                        <span className="absolute top-1 right-1 text-[9px] text-emerald-500 font-bold font-sans">Copied!</span>
                      )}
                    </div>

                    {/* Range */}
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                      <span className="text-[10px] text-slate-500 block font-sans font-bold">Range</span>
                      <span className="text-base font-black text-slate-800 dark:text-slate-100">
                        {statResult.range}
                      </span>
                      <div className="text-[9px] text-slate-400 mt-0.5">[{statResult.min} to {statResult.max}]</div>
                    </div>
                  </div>

                  {/* Population vs Sample Statistics Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Population Card */}
                    <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900 flex flex-col gap-2 font-mono">
                      <div className="flex items-center justify-between pb-1.5 border-b border-blue-200/60 dark:border-blue-900/60">
                        <span className="font-sans font-bold text-xs text-blue-900 dark:text-blue-300">
                          Population Statistics (N = {statResult.n})
                        </span>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400">Denominator: N</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div
                          onClick={() => handleCopyOrInsert(statResult.popStdDev.toString(), 'sigma')}
                          className="p-2 bg-white dark:bg-slate-900 rounded border hover:border-blue-400 cursor-pointer"
                        >
                          <span className="text-[10px] text-slate-500 block font-sans">Std Dev (σx)</span>
                          <span className="font-bold text-sm text-blue-700 dark:text-blue-300">
                            {parseFloat(statResult.popStdDev.toFixed(6))}
                          </span>
                        </div>
                        <div
                          onClick={() => handleCopyOrInsert(statResult.variance.toString(), 'sigma2')}
                          className="p-2 bg-white dark:bg-slate-900 rounded border hover:border-blue-400 cursor-pointer"
                        >
                          <span className="text-[10px] text-slate-500 block font-sans">Variance (σ²x)</span>
                          <span className="font-bold text-sm text-blue-700 dark:text-blue-300">
                            {parseFloat(statResult.variance.toFixed(6))}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sample Card */}
                    <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900 flex flex-col gap-2 font-mono">
                      <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200/60 dark:border-emerald-900/60">
                        <span className="font-sans font-bold text-xs text-emerald-900 dark:text-emerald-300">
                          Sample Statistics (n = {statResult.n})
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Denominator: n - 1</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div
                          onClick={() => handleCopyOrInsert(statResult.sampleStdDev.toString(), 's')}
                          className="p-2 bg-white dark:bg-slate-900 rounded border hover:border-emerald-400 cursor-pointer"
                        >
                          <span className="text-[10px] text-slate-500 block font-sans">Sample Std Dev (sx)</span>
                          <span className="font-bold text-sm text-emerald-700 dark:text-emerald-300">
                            {parseFloat(statResult.sampleStdDev.toFixed(6))}
                          </span>
                        </div>
                        <div
                          onClick={() => handleCopyOrInsert(statResult.sampleVariance.toString(), 's2')}
                          className="p-2 bg-white dark:bg-slate-900 rounded border hover:border-emerald-400 cursor-pointer"
                        >
                          <span className="text-[10px] text-slate-500 block font-sans">Sample Variance (s²x)</span>
                          <span className="font-bold text-sm text-emerald-700 dark:text-emerald-300">
                            {parseFloat(statResult.sampleVariance.toFixed(6))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sums & Quartiles */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div
                      onClick={() => handleCopyOrInsert(statResult.sumX.toString(), 'sumX')}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border hover:border-blue-400 cursor-pointer"
                    >
                      <span className="text-[10px] text-slate-500 block font-sans">Sum of Values (Σx)</span>
                      <span className="font-bold text-sm">{parseFloat(statResult.sumX.toFixed(6))}</span>
                    </div>
                    <div
                      onClick={() => handleCopyOrInsert(statResult.sumX2.toString(), 'sumX2')}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border hover:border-blue-400 cursor-pointer"
                    >
                      <span className="text-[10px] text-slate-500 block font-sans">Sum of Squares (Σx²)</span>
                      <span className="font-bold text-sm">{parseFloat(statResult.sumX2.toFixed(6))}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border">
                      <span className="text-[10px] text-slate-500 block font-sans">Quartiles (Q1 / Q3)</span>
                      <span className="font-bold text-sm">
                        {statResult.q1 ?? '—'} / {statResult.q3 ?? '—'}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border">
                      <span className="text-[10px] text-slate-500 block font-sans">Std Error (SE)</span>
                      <span className="font-bold text-sm">
                        {statResult.stdError ? parseFloat(statResult.stdError.toFixed(6)) : '0'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 2: REGRESSION ===================== */}
          {activeTab === 'regression' && (
            <div className="flex flex-col gap-4">
              {/* Regression Model Selector & Presets */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Model:
                  </span>
                  <button
                    onClick={() => {
                      setRegType('linear');
                      handleCalculateRegression('linear');
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                      regType === 'linear'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    Linear (y = a + bx)
                  </button>
                  <button
                    onClick={() => {
                      setRegType('quadratic');
                      handleCalculateRegression('quadratic');
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                      regType === 'quadratic'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    Quadratic (ax² + bx + c)
                  </button>
                  <button
                    onClick={() => {
                      setRegType('exponential');
                      handleCalculateRegression('exponential');
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                      regType === 'exponential'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    Exponential (a·e^bx)
                  </button>
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">
                    Preset:
                  </span>
                  <button
                    onClick={() => loadPreset2Var('linear')}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-700 border hover:bg-slate-50 text-slate-600 dark:text-slate-300"
                  >
                    Hooke (Linear)
                  </button>
                  <button
                    onClick={() => loadPreset2Var('quadratic')}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-700 border hover:bg-slate-50 text-slate-600 dark:text-slate-300"
                  >
                    Projectile (Quad)
                  </button>
                  <button
                    onClick={() => loadPreset2Var('exponential')}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-700 border hover:bg-slate-50 text-slate-600 dark:text-slate-300"
                  >
                    Growth (Exp)
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800/30">
                <div className="max-h-48 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold sticky top-0 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2 w-12 text-center">#</th>
                        <th className="p-2">X Independent</th>
                        <th className="p-2">Y Dependent</th>
                        <th className="p-2 w-12 text-center">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-mono">
                      {regData.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/40">
                          <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                          <td className="p-1">
                            <input
                              type="number"
                              step="any"
                              value={row.x}
                              onChange={(e) => handleUpdateRow2Var(row.id, 'x', e.target.value)}
                              placeholder="x"
                              className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-bold"
                            />
                          </td>
                          <td className="p-1">
                            <input
                              type="number"
                              step="any"
                              value={row.y}
                              onChange={(e) => handleUpdateRow2Var(row.id, 'y', e.target.value)}
                              placeholder="y"
                              className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-bold"
                            />
                          </td>
                          <td className="p-1 text-center">
                            {regData.length > 2 && (
                              <button
                                onClick={() => handleRemoveRow2Var(row.id)}
                                className="p-1 text-slate-400 hover:text-rose-500 rounded"
                                title="Delete row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-2 bg-slate-100/80 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddRow2Var}
                      className="px-3 py-1.5 rounded-lg border border-dashed border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Coordinate (X, Y)
                    </button>
                    <button
                      onClick={handleClear2Var}
                      className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-bold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Clear
                    </button>
                  </div>

                  <button
                    onClick={() => handleCalculateRegression()}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
                  >
                    Fit {regType.toUpperCase()} Model
                  </button>
                </div>
              </div>

              {/* Regression Fitted Model Results */}
              {regResult && (
                <div className="flex flex-col gap-3 animate-in fade-in">
                  {/* Fitted Equation Card */}
                  <div className="p-4 rounded-xl bg-slate-900 text-white shadow-md border border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                        {regResult.type.toUpperCase()} REGRESSION EQUATION
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyOrInsert(regResult.formula, 'eq')}
                          className="text-[11px] text-blue-300 hover:text-white flex items-center gap-1 font-mono"
                        >
                          <Copy className="w-3 h-3" />
                          Insert
                        </button>
                      </div>
                    </div>

                    <div className="font-mono text-base sm:text-lg font-bold text-[#4ade80] py-1 select-all">
                      {regResult.formula}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Correlation (r)</span>
                        <span className="font-bold text-sm text-emerald-300">
                          {parseFloat(regResult.r.toFixed(6))}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Determination (R²)</span>
                        <span className="font-bold text-sm text-emerald-300">
                          {parseFloat(regResult.r2.toFixed(6))} ({(regResult.r2 * 100).toFixed(2)}%)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Primary Param a</span>
                        <span className="font-bold text-sm">
                          {parseFloat(regResult.params.a.toFixed(6))}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Secondary Param b</span>
                        <span className="font-bold text-sm">
                          {parseFloat(regResult.params.b.toFixed(6))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bivariate Sum Statistics (Casio fx-991 Style) */}
                  {regResult.sumStats && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 font-sans">
                        Bivariate Sums & Means (n = {regResult.sumStats.n})
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs font-mono">
                        <div className="p-1.5 bg-white dark:bg-slate-900 rounded border">
                          <span className="text-[10px] text-slate-400 block font-sans">Σx</span>
                          <span className="font-bold">{parseFloat(regResult.sumStats.sumX.toFixed(4))}</span>
                        </div>
                        <div className="p-1.5 bg-white dark:bg-slate-900 rounded border">
                          <span className="text-[10px] text-slate-400 block font-sans">Σy</span>
                          <span className="font-bold">{parseFloat(regResult.sumStats.sumY.toFixed(4))}</span>
                        </div>
                        <div className="p-1.5 bg-white dark:bg-slate-900 rounded border">
                          <span className="text-[10px] text-slate-400 block font-sans">Σx²</span>
                          <span className="font-bold">{parseFloat(regResult.sumStats.sumX2.toFixed(4))}</span>
                        </div>
                        <div className="p-1.5 bg-white dark:bg-slate-900 rounded border">
                          <span className="text-[10px] text-slate-400 block font-sans">Σy²</span>
                          <span className="font-bold">{parseFloat(regResult.sumStats.sumY2.toFixed(4))}</span>
                        </div>
                        <div className="p-1.5 bg-white dark:bg-slate-900 rounded border">
                          <span className="text-[10px] text-slate-400 block font-sans">Σxy</span>
                          <span className="font-bold">{parseFloat(regResult.sumStats.sumXY.toFixed(4))}</span>
                        </div>
                        <div className="p-1.5 bg-white dark:bg-slate-900 rounded border">
                          <span className="text-[10px] text-slate-400 block font-sans">x̄, ȳ</span>
                          <span className="font-bold">
                            {parseFloat(regResult.sumStats.meanX.toFixed(2))}, {parseFloat(regResult.sumStats.meanY.toFixed(2))}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Interactive Estimation / Prediction Tool */}
                  <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        Predict ŷ for x =
                      </span>
                      <input
                        type="number"
                        step="any"
                        value={predictX}
                        onChange={(e) => {
                          setPredictX(e.target.value);
                          const px = parseFloat(e.target.value);
                          if (!isNaN(px) && regResult) {
                            setPredictedY(StatisticsEngine.predictY(regResult, px));
                          } else {
                            setPredictedY(null);
                          }
                        }}
                        className="w-24 px-2 py-1 rounded border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-center"
                      />
                    </div>

                    {predictedY !== null && !isNaN(predictedY) && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Estimated ŷ =</span>
                        <span className="font-mono font-black text-sm text-blue-700 dark:text-blue-300">
                          {parseFloat(predictedY.toFixed(6))}
                        </span>
                        <button
                          onClick={() => handleCopyOrInsert(predictedY.toString(), 'pred')}
                          className="px-2 py-1 rounded bg-blue-600 text-white text-[10px] font-bold hover:bg-blue-700"
                        >
                          Insert
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
