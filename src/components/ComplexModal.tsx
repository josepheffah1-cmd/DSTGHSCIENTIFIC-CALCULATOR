/**
 * DSTGH SCIENTIFIC CALCULATOR - Complex Numbers Modal (CMPLX)
 * Rectangular (a + bi), Polar (r∠θ), Modulus, Argument, Conjugate
 */

import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { ComplexNumber } from '../math/complex';
import { AngleMode } from '../types';

interface ComplexModalProps {
  isOpen: boolean;
  onClose: () => void;
  angleMode: AngleMode;
  onInsertToCalculator?: (val: string) => void;
}

export const ComplexModal: React.FC<ComplexModalProps> = ({
  isOpen,
  onClose,
  angleMode,
  onInsertToCalculator,
}) => {
  const [realA, setRealA] = useState('3');
  const [imagA, setImagA] = useState('4');

  const [realB, setRealB] = useState('1');
  const [imagB, setImagB] = useState('-2');

  const [resultZ, setResultZ] = useState<ComplexNumber | null>(null);
  const [scalarInfo, setScalarInfo] = useState<{ label: string; value: string } | null>(null);

  if (!isOpen) return null;

  const zA = new ComplexNumber(parseFloat(realA) || 0, parseFloat(imagA) || 0);
  const zB = new ComplexNumber(parseFloat(realB) || 0, parseFloat(imagB) || 0);

  const handleOp = (op: string) => {
    setResultZ(null);
    setScalarInfo(null);

    switch (op) {
      case 'add':
        setResultZ(zA.add(zB));
        break;
      case 'sub':
        setResultZ(zA.subtract(zB));
        break;
      case 'mult':
        setResultZ(zA.multiply(zB));
        break;
      case 'div':
        setResultZ(zA.divide(zB));
        break;
      case 'polarA':
        const pol = zA.toPolar(angleMode === 'RAD' ? 'RAD' : 'DEG');
        setScalarInfo({
          label: 'Polar Form of Z₁ (r ∠ θ)',
          value: `${parseFloat(pol.r.toFixed(4))} ∠ ${parseFloat(pol.theta.toFixed(2))}°`,
        });
        break;
      case 'modA':
        setScalarInfo({
          label: '|Z₁| (Modulus / Magnitude)',
          value: parseFloat(zA.abs().toFixed(6)).toString(),
        });
        break;
      case 'conjA':
        setResultZ(zA.conjugate());
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-900/40 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#082765] text-white flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-300" />
            <h2 className="font-bold text-lg tracking-wide">DSTGH Complex Numbers (CMPLX)</h2>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/50">
              <span className="font-bold text-xs text-blue-900 dark:text-blue-300 mb-2 block">
                Z₁ = a₁ + b₁·i
              </span>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={realA}
                  onChange={(e) => setRealA(e.target.value)}
                  placeholder="Real a₁"
                  className="w-full p-2 rounded border font-mono font-bold text-center text-sm bg-white dark:bg-slate-900"
                />
                <input
                  type="number"
                  value={imagA}
                  onChange={(e) => setImagA(e.target.value)}
                  placeholder="Imag b₁"
                  className="w-full p-2 rounded border font-mono font-bold text-center text-sm bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/50">
              <span className="font-bold text-xs text-blue-900 dark:text-blue-300 mb-2 block">
                Z₂ = a₂ + b₂·i
              </span>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={realB}
                  onChange={(e) => setRealB(e.target.value)}
                  placeholder="Real a₂"
                  className="w-full p-2 rounded border font-mono font-bold text-center text-sm bg-white dark:bg-slate-900"
                />
                <input
                  type="number"
                  value={imagB}
                  onChange={(e) => setImagB(e.target.value)}
                  placeholder="Imag b₂"
                  className="w-full p-2 rounded border font-mono font-bold text-center text-sm bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleOp('add')} className="flex-1 py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm">
              Z₁ + Z₂
            </button>
            <button onClick={() => handleOp('sub')} className="flex-1 py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm">
              Z₁ − Z₂
            </button>
            <button onClick={() => handleOp('mult')} className="flex-1 py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm">
              Z₁ × Z₂
            </button>
            <button onClick={() => handleOp('div')} className="flex-1 py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm">
              Z₁ ÷ Z₂
            </button>
            <button onClick={() => handleOp('polarA')} className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm">
              r∠θ (Polar)
            </button>
            <button onClick={() => handleOp('modA')} className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm">
              |Z₁| (Modulus)
            </button>
          </div>

          {resultZ && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 block">Calculated Complex Result:</span>
                <div className="font-mono text-xl font-black text-emerald-800 dark:text-emerald-300 mt-0.5">
                  {resultZ.toString()}
                </div>
              </div>
              {onInsertToCalculator && (
                <button
                  onClick={() => {
                    onInsertToCalculator(resultZ.real.toString());
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                >
                  Insert
                </button>
              )}
            </div>
          )}

          {scalarInfo && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
              <span className="text-xs font-bold text-slate-500 block">{scalarInfo.label}:</span>
              <div className="font-mono text-xl font-black text-emerald-800 dark:text-emerald-300 mt-0.5">
                {scalarInfo.value}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
