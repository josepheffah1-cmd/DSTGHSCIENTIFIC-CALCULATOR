/**
 * DSTGH SCIENTIFIC CALCULATOR - Matrix Modal (MAT)
 * Professional 2×2 and 3×3 Linear Algebra Engine:
 * - Determinant, Inverse, Transpose, Trace, Rank, Powers (A², A³), Adjugate
 * - Arithmetic: Addition (A+B), Subtraction (A-B), Multiplication (A×B, B×A), Scalar (k·A)
 * - Characteristic Polynomial & Eigenvalues
 * - Copy result to Matrix A / B or insert into Calculator
 */

import React, { useState } from 'react';
import { X, Grid3X3, Copy, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { MatrixMath, EigenResult } from '../math/matrix';
import { Fraction } from '../math/fraction';

interface MatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToCalculator?: (val: string) => void;
}

export const MatrixModal: React.FC<MatrixModalProps> = ({
  isOpen,
  onClose,
  onInsertToCalculator,
}) => {
  const [size, setSize] = useState<2 | 3>(2);

  // Matrix A
  const [matA, setMatA] = useState<number[][]>([
    [1, 2],
    [3, 4],
  ]);

  // Matrix B
  const [matB, setMatB] = useState<number[][]>([
    [2, 0],
    [1, 3],
  ]);

  const [scalarK, setScalarK] = useState('2');
  const [resultMat, setResultMat] = useState<number[][] | null>(null);
  const [resultScalar, setResultScalar] = useState<{ label: string; value: number } | null>(null);
  const [eigenResult, setEigenResult] = useState<EigenResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [viewFraction, setViewFraction] = useState(true);

  if (!isOpen) return null;

  const handleResize = (newSize: 2 | 3) => {
    setSize(newSize);
    setResultMat(null);
    setResultScalar(null);
    setEigenResult(null);
    setErrorMsg(null);
    if (newSize === 2) {
      setMatA([
        [1, 2],
        [3, 4],
      ]);
      setMatB([
        [2, 0],
        [1, 3],
      ]);
    } else {
      setMatA([
        [1, 2, 3],
        [0, 1, 4],
        [5, 6, 0],
      ]);
      setMatB([
        [2, 0, -1],
        [1, 3, 2],
        [0, -2, 1],
      ]);
    }
  };

  const updateCell = (matrix: 'A' | 'B', r: number, c: number, val: string) => {
    const num = parseFloat(val) || 0;
    if (matrix === 'A') {
      const next = matA.map((row, ri) =>
        row.map((col, ci) => (ri === r && ci === c ? num : col))
      );
      setMatA(next);
    } else {
      const next = matB.map((row, ri) =>
        row.map((col, ci) => (ri === r && ci === c ? num : col))
      );
      setMatB(next);
    }
  };

  const setPreset = (matrix: 'A' | 'B', preset: 'identity' | 'zero' | 'sample') => {
    let m: number[][];
    if (preset === 'identity') {
      m = MatrixMath.identity(size);
    } else if (preset === 'zero') {
      m = Array.from({ length: size }, () => Array(size).fill(0));
    } else {
      if (size === 2) {
        m = matrix === 'A' ? [[3, 1], [2, 2]] : [[1, -1], [2, 3]];
      } else {
        m =
          matrix === 'A'
            ? [
                [2, -1, 0],
                [-1, 2, -1],
                [0, -1, 2],
              ]
            : [
                [1, 0, 2],
                [2, -1, 3],
                [4, 1, 8],
              ];
      }
    }

    if (matrix === 'A') setMatA(m);
    else setMatB(m);
  };

  const executeOp = (op: string) => {
    setErrorMsg(null);
    setResultMat(null);
    setResultScalar(null);
    setEigenResult(null);

    try {
      switch (op) {
        case 'detA':
          setResultScalar({ label: 'det(MatA)', value: MatrixMath.determinant(matA) });
          break;
        case 'detB':
          setResultScalar({ label: 'det(MatB)', value: MatrixMath.determinant(matB) });
          break;
        case 'trA':
          setResultScalar({ label: 'tr(MatA)', value: MatrixMath.trace(matA) });
          break;
        case 'rankA':
          setResultScalar({ label: 'rank(MatA)', value: MatrixMath.rank(matA) });
          break;
        case 'invA':
          setResultMat(MatrixMath.inverse(matA));
          break;
        case 'invB':
          setResultMat(MatrixMath.inverse(matB));
          break;
        case 'transA':
          setResultMat(MatrixMath.transpose(matA));
          break;
        case 'transB':
          setResultMat(MatrixMath.transpose(matB));
          break;
        case 'adjA':
          setResultMat(MatrixMath.adjugate(matA));
          break;
        case 'powA2':
          setResultMat(MatrixMath.power(matA, 2));
          break;
        case 'powA3':
          setResultMat(MatrixMath.power(matA, 3));
          break;
        case 'add':
          setResultMat(MatrixMath.add(matA, matB));
          break;
        case 'sub':
          setResultMat(MatrixMath.subtract(matA, matB));
          break;
        case 'multAB':
          setResultMat(MatrixMath.multiply(matA, matB));
          break;
        case 'multBA':
          setResultMat(MatrixMath.multiply(matB, matA));
          break;
        case 'scaleA':
          setResultMat(MatrixMath.scale(matA, parseFloat(scalarK) || 1));
          break;
        case 'eigenA':
          setEigenResult(MatrixMath.eigenvalues(matA));
          break;
      }
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Matrix calculation error');
    }
  };

  const formatMatrixCell = (val: number): string => {
    if (!viewFraction) return parseFloat(val.toFixed(4)).toString();
    const frac = Fraction.fromDecimal(val);
    if (frac && frac.denominator !== 1n && frac.denominator < 10000n) {
      return frac.toProperString();
    }
    return parseFloat(val.toFixed(4)).toString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-900/40 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#082765] text-white flex items-center justify-between rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-blue-300" />
            <div>
              <h2 className="font-bold text-base sm:text-lg tracking-wide">
                DSTGH Matrix Calculator (MAT)
              </h2>
              <p className="text-[11px] text-blue-200">
                2×2 & 3×3 Matrices • Determinants • Inverses • Eigenvalues
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
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          {/* Dimension Selector & Formatting */}
          <div className="flex items-center justify-between flex-wrap gap-2 p-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Dimension:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleResize(2)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    size === 2
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  2 × 2
                </button>
                <button
                  onClick={() => handleResize(3)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    size === 3
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  3 × 3
                </button>
              </div>
            </div>

            <button
              onClick={() => setViewFraction((prev) => !prev)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Format: {viewFraction ? 'Fraction (a/b)' : 'Decimal (.xxx)'}
            </button>
          </div>

          {/* Matrices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matrix A */}
            <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-blue-900 dark:text-blue-300">
                  Matrix A ({size}×{size})
                </span>
                <div className="flex gap-1 text-[10px]">
                  <button
                    onClick={() => setPreset('A', 'identity')}
                    className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Identity
                  </button>
                  <button
                    onClick={() => setPreset('A', 'zero')}
                    className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Zero
                  </button>
                  <button
                    onClick={() => setPreset('A', 'sample')}
                    className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Sample
                  </button>
                </div>
              </div>

              <div
                className="grid gap-1.5 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800"
                style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
              >
                {matA.map((row, r) =>
                  row.map((val, c) => (
                    <input
                      key={`${r}-${c}`}
                      type="number"
                      step="any"
                      value={val}
                      onChange={(e) => updateCell('A', r, c, e.target.value)}
                      className="w-full p-2 text-center rounded border border-slate-300 dark:border-slate-700 font-mono font-bold text-sm bg-slate-50 dark:bg-slate-800"
                    />
                  ))
                )}
              </div>
            </div>

            {/* Matrix B */}
            <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-purple-900 dark:text-purple-300">
                  Matrix B ({size}×{size})
                </span>
                <div className="flex gap-1 text-[10px]">
                  <button
                    onClick={() => setPreset('B', 'identity')}
                    className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Identity
                  </button>
                  <button
                    onClick={() => setPreset('B', 'zero')}
                    className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Zero
                  </button>
                  <button
                    onClick={() => setPreset('B', 'sample')}
                    className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Sample
                  </button>
                </div>
              </div>

              <div
                className="grid gap-1.5 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800"
                style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
              >
                {matB.map((row, r) =>
                  row.map((val, c) => (
                    <input
                      key={`${r}-${c}`}
                      type="number"
                      step="any"
                      value={val}
                      onChange={(e) => updateCell('B', r, c, e.target.value)}
                      className="w-full p-2 text-center rounded border border-slate-300 dark:border-slate-700 font-mono font-bold text-sm bg-slate-50 dark:bg-slate-800"
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Operations Toolbar */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col gap-2.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Matrix Operations:
            </span>

            {/* Matrix A individual ops */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 py-1 mr-1">MatA:</span>
              <button
                onClick={() => executeOp('detA')}
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                det(A)
              </button>
              <button
                onClick={() => executeOp('invA')}
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                A⁻¹
              </button>
              <button
                onClick={() => executeOp('transA')}
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Aᵀ
              </button>
              <button
                onClick={() => executeOp('trA')}
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                tr(A)
              </button>
              <button
                onClick={() => executeOp('rankA')}
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                rank(A)
              </button>
              <button
                onClick={() => executeOp('powA2')}
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                A²
              </button>
              <button
                onClick={() => executeOp('powA3')}
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                A³
              </button>
              <button
                onClick={() => executeOp('adjA')}
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                adj(A)
              </button>
              <button
                onClick={() => executeOp('eigenA')}
                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Eigenvalues
              </button>
            </div>

            {/* Arithmetic between A and B */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] font-bold text-slate-500 py-1 mr-1">Binary Ops:</span>
              <button
                onClick={() => executeOp('add')}
                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                A + B
              </button>
              <button
                onClick={() => executeOp('sub')}
                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                A − B
              </button>
              <button
                onClick={() => executeOp('multAB')}
                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                A × B
              </button>
              <button
                onClick={() => executeOp('multBA')}
                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                B × A
              </button>

              <div className="flex items-center gap-1 ml-auto">
                <span className="text-xs font-bold text-slate-500">k =</span>
                <input
                  type="number"
                  value={scalarK}
                  onChange={(e) => setScalarK(e.target.value)}
                  className="w-14 p-1 rounded border text-xs font-bold text-center bg-white dark:bg-slate-900"
                />
                <button
                  onClick={() => executeOp('scaleA')}
                  className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs"
                >
                  k · A
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* Scalar Result Display */}
          {resultScalar && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {resultScalar.label}:
                </span>
                <div className="font-mono font-black text-emerald-800 dark:text-emerald-300 text-lg">
                  {formatMatrixCell(resultScalar.value)}
                </div>
              </div>
              {onInsertToCalculator && (
                <button
                  onClick={() => {
                    onInsertToCalculator(resultScalar.value.toString());
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                >
                  Insert Result
                </button>
              )}
            </div>
          )}

          {/* Eigenvalues & Characteristic Poly */}
          {eigenResult && (
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 flex flex-col gap-2">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                Characteristic Polynomial:
              </span>
              <div className="font-mono font-bold text-slate-900 dark:text-white text-xs sm:text-sm bg-white dark:bg-slate-900 p-2 rounded border">
                {eigenResult.characteristicPoly}
              </div>
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300 mt-1">
                Eigenvalues:
              </span>
              <div className="flex flex-col gap-1">
                {eigenResult.eigenvalues.map((ev, i) => (
                  <div key={i} className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-xs">
                    • {ev}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matrix Result Display */}
          {resultMat && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Result Matrix ({resultMat.length}×{resultMat[0].length}):
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMatA(resultMat)}
                    className="px-2 py-1 rounded bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
                  >
                    Copy to MatA
                  </button>
                  <button
                    onClick={() => setMatB(resultMat)}
                    className="px-2 py-1 rounded bg-purple-600 text-white font-bold text-xs hover:bg-purple-700"
                  >
                    Copy to MatB
                  </button>
                </div>
              </div>

              <div
                className="grid gap-1.5 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-sm mx-auto w-full"
                style={{ gridTemplateColumns: `repeat(${resultMat[0].length}, minmax(0, 1fr))` }}
              >
                {resultMat.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`${r}-${c}`}
                      className="p-2 text-center font-mono font-bold text-sm bg-slate-100 dark:bg-slate-800 rounded text-slate-900 dark:text-white"
                    >
                      {formatMatrixCell(val)}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
