/**
 * DSTGH SCIENTIFIC CALCULATOR - Equation Solver Modal (SOLVE)
 * Linear, Quadratic, 2x2 and 3x3 Systems with Step-by-Step Educational Solutions
 */

import React, { useState } from 'react';
import { X, Check, Calculator, BookOpen } from 'lucide-react';
import { EquationSolver } from '../math/equations';
import { EquationSolution } from '../types';

interface EquationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToCalculator?: (expr: string) => void;
}

export const EquationsModal: React.FC<EquationsModalProps> = ({
  isOpen,
  onClose,
  onInsertToCalculator,
}) => {
  const [eqType, setEqType] = useState<'linear' | 'quadratic' | 'cubic' | 'system2' | 'system3'>('quadratic');

  // Quadratic coefficients: ax² + bx + c = 0
  const [quadA, setQuadA] = useState('1');
  const [quadB, setQuadB] = useState('-5');
  const [quadC, setQuadC] = useState('6');

  // Cubic coefficients: ax³ + bx² + cx + d = 0
  const [cubA, setCubA] = useState('1');
  const [cubB, setCubB] = useState('-6');
  const [cubC, setCubC] = useState('11');
  const [cubD, setCubD] = useState('-6');

  // Linear coefficients: ax + b = c
  const [linA, setLinA] = useState('2');
  const [linB, setLinB] = useState('4');
  const [linC, setLinC] = useState('10');

  // System 2x2: a1 x + b1 y = c1
  const [s2a1, setS2a1] = useState('2');
  const [s2b1, setS2b1] = useState('3');
  const [s2c1, setS2c1] = useState('8');
  const [s2a2, setS2a2] = useState('1');
  const [s2b2, setS2b2] = useState('-1');
  const [s2c2, setS2c2] = useState('-1');

  // System 3x3
  const [s3, setS3] = useState({
    a1: '1', b1: '1', c1: '1', d1: '6',
    a2: '0', b2: '2', c2: '5', d2: '-4',
    a3: '2', b3: '5', c3: '-1', d3: '27',
  });

  const [solution, setSolution] = useState<EquationSolution | null>(null);
  const [system2Sol, setSystem2Sol] = useState<{ x: number; y: number; steps: string[]; solvable: boolean } | null>(null);
  const [system3Sol, setSystem3Sol] = useState<{ x: number; y: number; z: number; steps: string[]; solvable: boolean } | null>(null);

  if (!isOpen) return null;

  const handleSolve = () => {
    setSolution(null);
    setSystem2Sol(null);
    setSystem3Sol(null);

    if (eqType === 'quadratic') {
      const a = parseFloat(quadA) || 0;
      const b = parseFloat(quadB) || 0;
      const c = parseFloat(quadC) || 0;
      const sol = EquationSolver.solveQuadratic(a, b, c);
      setSolution(sol);
    } else if (eqType === 'cubic') {
      const a = parseFloat(cubA) || 0;
      const b = parseFloat(cubB) || 0;
      const c = parseFloat(cubC) || 0;
      const d = parseFloat(cubD) || 0;
      const sol = EquationSolver.solveCubic(a, b, c, d);
      setSolution(sol);
    } else if (eqType === 'linear') {
      const a = parseFloat(linA) || 0;
      const b = parseFloat(linB) || 0;
      const c = parseFloat(linC) || 0;
      const sol = EquationSolver.solveLinear(a, b, c);
      setSolution(sol);
    } else if (eqType === 'system2') {
      const sol = EquationSolver.solve2x2System(
        parseFloat(s2a1) || 0, parseFloat(s2b1) || 0, parseFloat(s2c1) || 0,
        parseFloat(s2a2) || 0, parseFloat(s2b2) || 0, parseFloat(s2c2) || 0
      );
      setSystem2Sol(sol);
    } else if (eqType === 'system3') {
      const sol = EquationSolver.solve3x3System(
        parseFloat(s3.a1) || 0, parseFloat(s3.b1) || 0, parseFloat(s3.c1) || 0, parseFloat(s3.d1) || 0,
        parseFloat(s3.a2) || 0, parseFloat(s3.b2) || 0, parseFloat(s3.c2) || 0, parseFloat(s3.d2) || 0,
        parseFloat(s3.a3) || 0, parseFloat(s3.b3) || 0, parseFloat(s3.c3) || 0, parseFloat(s3.d3) || 0
      );
      setSystem3Sol(sol);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-900/40 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#082765] text-white flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-300" />
            <h2 className="font-bold text-lg tracking-wide">DSTGH Equation Solver (SOLVE)</h2>
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
          {/* Equation Type Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => { setEqType('quadratic'); setSolution(null); }}
              className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                eqType === 'quadratic'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Quadratic (ax²+bx+c)
            </button>
            <button
              onClick={() => { setEqType('cubic'); setSolution(null); }}
              className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                eqType === 'cubic'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Cubic (ax³+bx²+cx+d)
            </button>
            <button
              onClick={() => { setEqType('linear'); setSolution(null); }}
              className={`flex-1 min-w-[80px] py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                eqType === 'linear'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Linear (ax+b=c)
            </button>
            <button
              onClick={() => { setEqType('system2'); setSolution(null); }}
              className={`flex-1 min-w-[80px] py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                eqType === 'system2'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              2×2 System
            </button>
            <button
              onClick={() => { setEqType('system3'); setSolution(null); }}
              className={`flex-1 min-w-[80px] py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                eqType === 'system3'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              3×3 System
            </button>
          </div>

          {/* Form Inputs based on equation type */}
          {eqType === 'cubic' && (
            <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Form: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">a·x³ + b·x² + c·x + d = 0</span>
              </span>
              <div className="grid grid-cols-4 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-500">Coef a</label>
                  <input
                    type="number"
                    value={cubA}
                    onChange={(e) => setCubA(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-center font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">Coef b</label>
                  <input
                    type="number"
                    value={cubB}
                    onChange={(e) => setCubB(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-center font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">Coef c</label>
                  <input
                    type="number"
                    value={cubC}
                    onChange={(e) => setCubC(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-center font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">Term d</label>
                  <input
                    type="number"
                    value={cubD}
                    onChange={(e) => setCubD(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-center font-bold text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {eqType === 'quadratic' && (
            <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Form: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">a·x² + b·x + c = 0</span>
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500">Coefficient a</label>
                  <input
                    type="number"
                    value={quadA}
                    onChange={(e) => setQuadA(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">Coefficient b</label>
                  <input
                    type="number"
                    value={quadB}
                    onChange={(e) => setQuadB(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">Constant c</label>
                  <input
                    type="number"
                    value={quadC}
                    onChange={(e) => setQuadC(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-center font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {eqType === 'linear' && (
            <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Form: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">a·x + b = c</span>
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500">Coefficient a</label>
                  <input
                    type="number"
                    value={linA}
                    onChange={(e) => setLinA(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">Term b</label>
                  <input
                    type="number"
                    value={linB}
                    onChange={(e) => setLinB(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">RHS c</label>
                  <input
                    type="number"
                    value={linC}
                    onChange={(e) => setLinC(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-center font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {eqType === 'system2' && (
            <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                2×2 System: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">a·x + b·y = c</span>
              </span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="a₁"
                  value={s2a1}
                  onChange={(e) => setS2a1(e.target.value)}
                  className="p-2 rounded border bg-white dark:bg-slate-900 font-mono text-center"
                />
                <input
                  type="number"
                  placeholder="b₁"
                  value={s2b1}
                  onChange={(e) => setS2b1(e.target.value)}
                  className="p-2 rounded border bg-white dark:bg-slate-900 font-mono text-center"
                />
                <input
                  type="number"
                  placeholder="c₁"
                  value={s2c1}
                  onChange={(e) => setS2c1(e.target.value)}
                  className="p-2 rounded border bg-white dark:bg-slate-900 font-mono text-center"
                />
                <input
                  type="number"
                  placeholder="a₂"
                  value={s2a2}
                  onChange={(e) => setS2a2(e.target.value)}
                  className="p-2 rounded border bg-white dark:bg-slate-900 font-mono text-center"
                />
                <input
                  type="number"
                  placeholder="b₂"
                  value={s2b2}
                  onChange={(e) => setS2b2(e.target.value)}
                  className="p-2 rounded border bg-white dark:bg-slate-900 font-mono text-center"
                />
                <input
                  type="number"
                  placeholder="c₂"
                  value={s2c2}
                  onChange={(e) => setS2c2(e.target.value)}
                  className="p-2 rounded border bg-white dark:bg-slate-900 font-mono text-center"
                />
              </div>
            </div>
          )}

          {eqType === 'system3' && (
            <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                3×3 System: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">a·x + b·y + c·z = d</span>
              </span>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <input type="number" placeholder="a₁" value={s3.a1} onChange={(e) => setS3({ ...s3, a1: e.target.value })} className="p-1.5 rounded border bg-white dark:bg-slate-900 text-center" />
                <input type="number" placeholder="b₁" value={s3.b1} onChange={(e) => setS3({ ...s3, b1: e.target.value })} className="p-1.5 rounded border bg-white dark:bg-slate-900 text-center" />
                <input type="number" placeholder="c₁" value={s3.c1} onChange={(e) => setS3({ ...s3, c1: e.target.value })} className="p-1.5 rounded border bg-white dark:bg-slate-900 text-center" />
                <input type="number" placeholder="d₁" value={s3.d1} onChange={(e) => setS3({ ...s3, d1: e.target.value })} className="p-1.5 rounded border bg-white dark:bg-slate-900 text-center" />

                <input type="number" placeholder="a₂" value={s3.a2} onChange={(e) => setS3({ ...s3, a2: e.target.value })} className="p-1.5 rounded border bg-white dark:bg-slate-900 text-center" />
                <input type="number" placeholder="b₂" value={s3.b2} onChange={(e) => setS3({ ...s3, b2: e.target.value })} className="p-1.5 rounded border bg-white dark:bg-slate-900 text-center" />
                <input type="number" placeholder="c₂" value={s3.c2} onChange={(e) => setS3({ ...s3, c2: e.target.value })} className="p-1.5 rounded border bg-white dark:bg-slate-900 text-center" />
                <input type="number" placeholder="d₂" value={s3.d2} onChange={(e) => setS3({ ...s3, d2: e.target.value })} className="p-1.5 rounded border bg-white dark:bg-slate-900 text-center" />

                <input type="number" placeholder="a₃" value={s3.a3} onChange={(e) => setS3({ ...s3, a3: e.target.value })} className="p-1.5 rounded border bg-white dark:bg-slate-900 text-center" />
                <input type="number" placeholder="b₃" value={s3.b3} onChange={(e) => setS3({ ...s3, b3: e.target.value })} className="p-1.5 rounded border bg-white dark:bg-slate-900 text-center" />
                <input type="number" placeholder="c₃" value={s3.c3} onChange={(e) => setS3({ ...s3, c3: e.target.value })} className="p-1.5 rounded border bg-white dark:bg-slate-900 text-center" />
                <input type="number" placeholder="d₃" value={s3.d3} onChange={(e) => setS3({ ...s3, d3: e.target.value })} className="p-1.5 rounded border bg-white dark:bg-slate-900 text-center" />
              </div>
            </div>
          )}

          {/* Solve Action Button */}
          <button
            onClick={handleSolve}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide shadow-md transition-all active:scale-[0.98]"
          >
            Solve Equation
          </button>

          {/* Solution & Educational Steps Display */}
          {solution && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">
                  {solution.title}
                </span>
                {solution.roots.length > 0 && onInsertToCalculator && (
                  <button
                    onClick={() => {
                      onInsertToCalculator(solution.roots[0].real.toString());
                      onClose();
                    }}
                    className="text-xs font-semibold px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Insert x₁ into Calc
                  </button>
                )}
              </div>

              {/* Roots List */}
              <div className="flex flex-wrap gap-4 py-1">
                {solution.roots.map((r, i) => (
                  <div key={i} className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 font-mono text-base font-bold text-emerald-800 dark:text-emerald-300">
                    x{solution.roots.length > 1 ? i + 1 : ''} = {r.real}
                    {r.imag ? ` ± ${Math.abs(r.imag)}i` : ''}
                  </div>
                ))}
              </div>

              {/* Educational Steps */}
              <div className="mt-1 p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 font-mono text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <div className="font-sans font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  Educational Step-by-Step Breakdown:
                </div>
                {solution.steps.map((st, i) => (
                  <p key={i} className="leading-relaxed whitespace-pre-wrap">{st}</p>
                ))}
              </div>
            </div>
          )}

          {system2Sol && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-col gap-3">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">
                2×2 System Results
              </span>
              {system2Sol.solvable ? (
                <div className="flex gap-4">
                  <div className="px-3 py-1.5 rounded bg-white dark:bg-slate-900 font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    x = {parseFloat(system2Sol.x.toFixed(6))}
                  </div>
                  <div className="px-3 py-1.5 rounded bg-white dark:bg-slate-900 font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    y = {parseFloat(system2Sol.y.toFixed(6))}
                  </div>
                </div>
              ) : (
                <span className="text-amber-700 font-bold text-xs">No unique solution</span>
              )}
              <div className="mt-1 p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 font-mono text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {system2Sol.steps.map((st, i) => (
                  <p key={i}>{st}</p>
                ))}
              </div>
            </div>
          )}

          {system3Sol && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-col gap-3">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">
                3×3 System Results
              </span>
              {system3Sol.solvable ? (
                <div className="flex gap-4">
                  <div className="px-3 py-1 rounded bg-white dark:bg-slate-900 font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    x = {parseFloat(system3Sol.x.toFixed(6))}
                  </div>
                  <div className="px-3 py-1 rounded bg-white dark:bg-slate-900 font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    y = {parseFloat(system3Sol.y.toFixed(6))}
                  </div>
                  <div className="px-3 py-1 rounded bg-white dark:bg-slate-900 font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    z = {parseFloat(system3Sol.z.toFixed(6))}
                  </div>
                </div>
              ) : (
                <span className="text-amber-700 font-bold text-xs">Matrix is singular</span>
              )}
              <div className="mt-1 p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 font-mono text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {system3Sol.steps.map((st, i) => (
                  <p key={i}>{st}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
