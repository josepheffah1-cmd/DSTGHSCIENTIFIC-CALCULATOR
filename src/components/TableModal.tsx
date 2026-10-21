/**
 * DSTGH SCIENTIFIC CALCULATOR - Table Mode Modal (TABLE)
 * Evaluates function f(x) over [Start, End] with given Step size
 */

import React, { useState } from 'react';
import { X, Table as TableIcon, Play } from 'lucide-react';
import { TableEngine, TableRow } from '../math/table';
import { AngleMode } from '../types';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  angleMode: AngleMode;
}

export const TableModal: React.FC<TableModalProps> = ({ isOpen, onClose, angleMode }) => {
  const [funcExpr, setFuncExpr] = useState('x^2 - 4');
  const [startVal, setStartVal] = useState('-3');
  const [endVal, setEndVal] = useState('3');
  const [stepVal, setStepVal] = useState('1');
  const [rows, setRows] = useState<TableRow[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setErrorMsg(null);
    try {
      const start = parseFloat(startVal);
      const end = parseFloat(endVal);
      const step = parseFloat(stepVal);

      if (isNaN(start) || isNaN(end) || isNaN(step)) {
        throw new Error('Please enter valid numeric boundaries and step size');
      }

      const generated = TableEngine.generateTable(funcExpr, start, end, step, angleMode);
      setRows(generated);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Table generation failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-900/40 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#082765] text-white flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <TableIcon className="w-5 h-5 text-blue-300" />
            <h2 className="font-bold text-lg tracking-wide">DSTGH Function Table Generator (TABLE)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500">Function f(x):</label>
            <input
              type="text"
              value={funcExpr}
              onChange={(e) => setFuncExpr(e.target.value)}
              placeholder="e.g. x^2 - 4 or 2*sin(x)"
              className="w-full p-2.5 rounded-xl border bg-white dark:bg-slate-900 font-mono font-bold text-base"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500">Start X:</label>
              <input
                type="number"
                value={startVal}
                onChange={(e) => setStartVal(e.target.value)}
                className="w-full p-2 rounded-lg border font-mono font-bold bg-white dark:bg-slate-900 text-center"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">End X:</label>
              <input
                type="number"
                value={endVal}
                onChange={(e) => setEndVal(e.target.value)}
                className="w-full p-2 rounded-lg border font-mono font-bold bg-white dark:bg-slate-900 text-center"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">Step Size:</label>
              <input
                type="number"
                value={stepVal}
                onChange={(e) => setStepVal(e.target.value)}
                className="w-full p-2 rounded-lg border font-mono font-bold bg-white dark:bg-slate-900 text-center"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide shadow-md transition-all active:scale-[0.98]"
          >
            <Play className="w-4 h-4" />
            Generate Table Values
          </button>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-700 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {rows.length > 0 && (
            <div className="max-h-60 overflow-y-auto border rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200">
                    <th className="p-2 w-12 text-center">#</th>
                    <th className="p-2">x</th>
                    <th className="p-2">f(x)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.index} className="border-b border-slate-200 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-900">
                      <td className="p-2 text-center text-slate-400 font-bold">{r.index}</td>
                      <td className="p-2 font-bold text-slate-800 dark:text-slate-200">{r.x}</td>
                      <td className="p-2 font-black text-blue-700 dark:text-blue-300">{r.displayFx}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
