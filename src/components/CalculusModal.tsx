/**
 * DSTGH SCIENTIFIC CALCULATOR - Calculus Modal (CALC)
 * Definite Integrals, Numerical Derivatives, and Limit Approximations
 */

import React, { useState } from 'react';
import { X, Sigma, ArrowRight } from 'lucide-react';
import { CalculusEngine } from '../math/calculus';

interface CalculusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToCalculator?: (val: string) => void;
}

export const CalculusModal: React.FC<CalculusModalProps> = ({
  isOpen,
  onClose,
  onInsertToCalculator,
}) => {
  const [calcType, setCalcType] = useState<'integral' | 'derivative' | 'limit'>('integral');

  // Integrals: ∫_a^b f(x) dx
  const [integExpr, setIntegExpr] = useState('x^2');
  const [integA, setIntegA] = useState('0');
  const [integB, setIntegB] = useState('2');

  // Derivatives: d/dx f(x) at x=x0
  const [derivExpr, setDerivExpr] = useState('3*x^2 + 2*x');
  const [derivX0, setDerivX0] = useState('2');

  // Limits: lim_{x->a} f(x)
  const [limitExpr, setLimitExpr] = useState('(sin(x))/x');
  const [limitA, setLimitA] = useState('0');

  const [resultText, setResultText] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCompute = () => {
    setErrorMsg(null);
    setResultText(null);

    try {
      if (calcType === 'integral') {
        const a = parseFloat(integA);
        const b = parseFloat(integB);
        if (isNaN(a) || isNaN(b)) throw new Error('Valid integration limits required');
        const val = CalculusEngine.numericalIntegral(integExpr, a, b);
        setResultText(`∫ [${a} to ${b}] (${integExpr}) dx = ${parseFloat(val.toFixed(8))}`);
      } else if (calcType === 'derivative') {
        const x0 = parseFloat(derivX0);
        if (isNaN(x0)) throw new Error('Valid point x₀ required');
        const val = CalculusEngine.numericalDerivative(derivExpr, x0);
        setResultText(`d/dx [${derivExpr}] at x = ${x0} is ${parseFloat(val.toFixed(8))}`);
      } else {
        const a = parseFloat(limitA);
        if (isNaN(a)) throw new Error('Valid approach point a required');
        const limRes = CalculusEngine.approximateLimit(limitExpr, a);
        if (limRes.limit !== null) {
          setResultText(`lim_{x -> ${a}} [${limitExpr}] ≈ ${parseFloat(limRes.limit.toFixed(8))}`);
        } else {
          setResultText(`lim_{x -> ${a}} [${limitExpr}] does not converge (Left: ${parseFloat(limRes.leftLimit.toFixed(4))}, Right: ${parseFloat(limRes.rightLimit.toFixed(4))})`);
        }
      }
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Calculation error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-900/40 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#082765] text-white flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Sigma className="w-5 h-5 text-blue-300" />
            <h2 className="font-bold text-lg tracking-wide">DSTGH Calculus Engine (d/dx, ∫)</h2>
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
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => { setCalcType('integral'); setResultText(null); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                calcType === 'integral'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Definite Integral (∫)
            </button>
            <button
              onClick={() => { setCalcType('derivative'); setResultText(null); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                calcType === 'derivative'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Derivative (d/dx)
            </button>
            <button
              onClick={() => { setCalcType('limit'); setResultText(null); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                calcType === 'limit'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Limit (lim)
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-700 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {calcType === 'integral' && (
            <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border">
              <span className="text-xs font-bold text-slate-500">Definite Integral: ∫ [a to b] f(x) dx</span>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Function f(x):</label>
                <input
                  type="text"
                  value={integExpr}
                  onChange={(e) => setIntegExpr(e.target.value)}
                  placeholder="e.g. x^2 or sin(x)"
                  className="w-full mt-1 p-2 rounded-lg border font-mono font-bold bg-white dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Lower Limit a:</label>
                  <input
                    type="number"
                    value={integA}
                    onChange={(e) => setIntegA(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border font-mono font-bold bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Upper Limit b:</label>
                  <input
                    type="number"
                    value={integB}
                    onChange={(e) => setIntegB(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border font-mono font-bold bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {calcType === 'derivative' && (
            <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border">
              <span className="text-xs font-bold text-slate-500">Numerical Derivative: d/dx [f(x)] |_(x=x₀)</span>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Function f(x):</label>
                <input
                  type="text"
                  value={derivExpr}
                  onChange={(e) => setDerivExpr(e.target.value)}
                  placeholder="e.g. 3*x^2 + 2*x"
                  className="w-full mt-1 p-2 rounded-lg border font-mono font-bold bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">At point x₀:</label>
                <input
                  type="number"
                  value={derivX0}
                  onChange={(e) => setDerivX0(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border font-mono font-bold bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          )}

          {calcType === 'limit' && (
            <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border">
              <span className="text-xs font-bold text-slate-500">Limit: lim_(x -&gt; a) f(x)</span>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Function f(x):</label>
                <input
                  type="text"
                  value={limitExpr}
                  onChange={(e) => setLimitExpr(e.target.value)}
                  placeholder="e.g. (sin(x))/x"
                  className="w-full mt-1 p-2 rounded-lg border font-mono font-bold bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Approaching point a:</label>
                <input
                  type="number"
                  value={limitA}
                  onChange={(e) => setLimitA(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg border font-mono font-bold bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleCompute}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide shadow-md transition-all active:scale-[0.98]"
          >
            Compute Calculus Expression
          </button>

          {resultText && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-emerald-900 dark:text-emerald-200">
                {resultText}
              </span>
              {onInsertToCalculator && (
                <button
                  onClick={() => {
                    const match = resultText.match(/=\s*([0-9.-]+)/);
                    if (match) onInsertToCalculator(match[1]);
                    onClose();
                  }}
                  className="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                >
                  Insert Result
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
