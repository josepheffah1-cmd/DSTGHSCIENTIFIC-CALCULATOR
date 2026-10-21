/**
 * DSTGH SCIENTIFIC CALCULATOR - Vector Modal (VCT)
 * Comprehensive 2D & 3D Vector Math Engine:
 * - Magnitude (Norm), Unit Vectors, Vector Addition & Subtraction
 * - Dot Product, Cross Product, Angle (DEG/RAD)
 * - Vector Projection & Scalar Component
 * - Distance between vectors, Scalar Triple Product
 * - Linear Combination (a·u + b·v)
 */

import React, { useState } from 'react';
import { X, Navigation, Sparkles, Compass } from 'lucide-react';
import { VectorMath } from '../math/vector';
import { Fraction } from '../math/fraction';

interface VectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToCalculator?: (val: string) => void;
}

export const VectorModal: React.FC<VectorModalProps> = ({
  isOpen,
  onClose,
  onInsertToCalculator,
}) => {
  const [dim, setDim] = useState<2 | 3>(3);
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('DEG');

  // Vector u
  const [u1, setU1] = useState('1');
  const [u2, setU2] = useState('2');
  const [u3, setU3] = useState('3');

  // Vector v
  const [v1, setV1] = useState('4');
  const [v2, setV2] = useState('5');
  const [v3, setV3] = useState('6');

  // Vector w (for scalar triple product)
  const [w1, setW1] = useState('1');
  const [w2, setW2] = useState('0');
  const [w3, setW3] = useState('-1');

  // Linear combination coefficients
  const [coefA, setCoefA] = useState('2');
  const [coefB, setCoefB] = useState('-1');

  const [resVector, setResVector] = useState<{ label: string; vec: number[] } | null>(null);
  const [resScalar, setResScalar] = useState<{ label: string; value: number; unit?: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const getVector = (vec: 'u' | 'v' | 'w'): number[] => {
    if (vec === 'u') {
      return dim === 2
        ? [parseFloat(u1) || 0, parseFloat(u2) || 0]
        : [parseFloat(u1) || 0, parseFloat(u2) || 0, parseFloat(u3) || 0];
    } else if (vec === 'v') {
      return dim === 2
        ? [parseFloat(v1) || 0, parseFloat(v2) || 0]
        : [parseFloat(v1) || 0, parseFloat(v2) || 0, parseFloat(v3) || 0];
    } else {
      return dim === 2
        ? [parseFloat(w1) || 0, parseFloat(w2) || 0]
        : [parseFloat(w1) || 0, parseFloat(w2) || 0, parseFloat(w3) || 0];
    }
  };

  const setPreset = (vec: 'u' | 'v', type: 'i' | 'j' | 'k' | 'zero') => {
    if (type === 'i') {
      if (vec === 'u') { setU1('1'); setU2('0'); setU3('0'); }
      else { setV1('1'); setV2('0'); setV3('0'); }
    } else if (type === 'j') {
      if (vec === 'u') { setU1('0'); setU2('1'); setU3('0'); }
      else { setV1('0'); setV2('1'); setV3('0'); }
    } else if (type === 'k') {
      if (vec === 'u') { setU1('0'); setU2('0'); setU3('1'); }
      else { setV1('0'); setV2('0'); setV3('1'); }
    } else {
      if (vec === 'u') { setU1('0'); setU2('0'); setU3('0'); }
      else { setV1('0'); setV2('0'); setV3('0'); }
    }
  };

  const handleOp = (op: string) => {
    setErrorMsg(null);
    setResVector(null);
    setResScalar(null);

    try {
      const u = getVector('u');
      const v = getVector('v');
      const w = getVector('w');

      switch (op) {
        case 'magU':
          setResScalar({ label: '‖u‖ (Magnitude of u)', value: VectorMath.magnitude(u) });
          break;
        case 'magV':
          setResScalar({ label: '‖v‖ (Magnitude of v)', value: VectorMath.magnitude(v) });
          break;
        case 'unitU':
          setResVector({ label: 'û (Unit Vector of u)', vec: VectorMath.unitVector(u) });
          break;
        case 'unitV':
          setResVector({ label: 'v̂ (Unit Vector of v)', vec: VectorMath.unitVector(v) });
          break;
        case 'dot':
          setResScalar({ label: 'u · v (Dot Product)', value: VectorMath.dotProduct(u, v) });
          break;
        case 'cross':
          if (dim !== 3) throw new Error('Cross product is defined for 3D vectors only');
          setResVector({ label: 'u × v (Cross Product)', vec: VectorMath.crossProduct(u, v) });
          break;
        case 'angle':
          setResScalar({
            label: `θ Angle between u and v`,
            value: VectorMath.angleBetween(u, v, angleMode),
            unit: angleMode === 'DEG' ? '°' : ' rad',
          });
          break;
        case 'add':
          setResVector({ label: 'u + v (Vector Sum)', vec: VectorMath.add(u, v) });
          break;
        case 'sub':
          setResVector({ label: 'u − v (Vector Difference)', vec: VectorMath.subtract(u, v) });
          break;
        case 'proj':
          setResVector({ label: 'projᵥ(u) (Vector Projection of u onto v)', vec: VectorMath.projection(u, v) });
          break;
        case 'comp':
          setResScalar({ label: 'compᵥ(u) (Scalar Component of u along v)', value: VectorMath.scalarProjection(u, v) });
          break;
        case 'dist':
          setResScalar({ label: 'd(u, v) (Distance between u and v)', value: VectorMath.distance(u, v) });
          break;
        case 'triple':
          if (dim !== 3) throw new Error('Scalar triple product requires 3D vectors');
          setResScalar({
            label: 'u · (v × w) (Scalar Triple Product / Volume)',
            value: VectorMath.scalarTripleProduct(u, v, w),
          });
          break;
        case 'linearComb': {
          const a = parseFloat(coefA) || 0;
          const b = parseFloat(coefB) || 0;
          setResVector({
            label: `${a}·u + ${b}·v (Linear Combination)`,
            vec: VectorMath.linearCombination(a, u, b, v),
          });
          break;
        }
      }
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Vector calculation error');
    }
  };

  const formatVectorString = (vec: number[]): string => {
    const formattedComponents = vec.map((c) => parseFloat(c.toFixed(4)).toString());
    if (vec.length === 2) {
      return `[ ${formattedComponents[0]}, ${formattedComponents[1]} ]`;
    }
    return `[ ${formattedComponents[0]}, ${formattedComponents[1]}, ${formattedComponents[2]} ]`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-900/40 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#082765] text-white flex items-center justify-between rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-300" />
            <div>
              <h2 className="font-bold text-base sm:text-lg tracking-wide">
                DSTGH Vector Calculator (VCT)
              </h2>
              <p className="text-[11px] text-blue-200">
                2D & 3D Vectors • Dot & Cross Products • Angles • Projections
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
          {/* Dimension Selector & Angle Mode */}
          <div className="flex items-center justify-between flex-wrap gap-2 p-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Dimension:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setDim(2)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    dim === 2
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  2D (x, y)
                </button>
                <button
                  onClick={() => setDim(3)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    dim === 3
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  3D (x, y, z)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Angle Unit:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setAngleMode('DEG')}
                  className={`px-2.5 py-1 rounded text-xs font-bold ${
                    angleMode === 'DEG'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  DEG (°)
                </button>
                <button
                  onClick={() => setAngleMode('RAD')}
                  className={`px-2.5 py-1 rounded text-xs font-bold ${
                    angleMode === 'RAD'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  RAD
                </button>
              </div>
            </div>
          </div>

          {/* Vectors Input Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vector u */}
            <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-blue-900 dark:text-blue-300">
                  Vector u
                </span>
                <div className="flex gap-1 text-[10px]">
                  <button
                    onClick={() => setPreset('u', 'i')}
                    className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border font-semibold text-slate-600 dark:text-slate-300"
                  >
                    î
                  </button>
                  <button
                    onClick={() => setPreset('u', 'j')}
                    className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border font-semibold text-slate-600 dark:text-slate-300"
                  >
                    ĵ
                  </button>
                  {dim === 3 && (
                    <button
                      onClick={() => setPreset('u', 'k')}
                      className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border font-semibold text-slate-600 dark:text-slate-300"
                    >
                      k̂
                    </button>
                  )}
                  <button
                    onClick={() => setPreset('u', 'zero')}
                    className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border font-semibold text-slate-600 dark:text-slate-300"
                  >
                    0
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-500 block mb-0.5">u_x</span>
                  <input
                    type="number"
                    step="any"
                    value={u1}
                    onChange={(e) => setU1(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 font-mono font-bold text-sm text-center bg-white dark:bg-slate-900"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-500 block mb-0.5">u_y</span>
                  <input
                    type="number"
                    step="any"
                    value={u2}
                    onChange={(e) => setU2(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 font-mono font-bold text-sm text-center bg-white dark:bg-slate-900"
                  />
                </div>
                {dim === 3 && (
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-slate-500 block mb-0.5">u_z</span>
                    <input
                      type="number"
                      step="any"
                      value={u3}
                      onChange={(e) => setU3(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 font-mono font-bold text-sm text-center bg-white dark:bg-slate-900"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Vector v */}
            <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-purple-900 dark:text-purple-300">
                  Vector v
                </span>
                <div className="flex gap-1 text-[10px]">
                  <button
                    onClick={() => setPreset('v', 'i')}
                    className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border font-semibold text-slate-600 dark:text-slate-300"
                  >
                    î
                  </button>
                  <button
                    onClick={() => setPreset('v', 'j')}
                    className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border font-semibold text-slate-600 dark:text-slate-300"
                  >
                    ĵ
                  </button>
                  {dim === 3 && (
                    <button
                      onClick={() => setPreset('v', 'k')}
                      className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border font-semibold text-slate-600 dark:text-slate-300"
                    >
                      k̂
                    </button>
                  )}
                  <button
                    onClick={() => setPreset('v', 'zero')}
                    className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border font-semibold text-slate-600 dark:text-slate-300"
                  >
                    0
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-500 block mb-0.5">v_x</span>
                  <input
                    type="number"
                    step="any"
                    value={v1}
                    onChange={(e) => setV1(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 font-mono font-bold text-sm text-center bg-white dark:bg-slate-900"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-500 block mb-0.5">v_y</span>
                  <input
                    type="number"
                    step="any"
                    value={v2}
                    onChange={(e) => setV2(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 font-mono font-bold text-sm text-center bg-white dark:bg-slate-900"
                  />
                </div>
                {dim === 3 && (
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-slate-500 block mb-0.5">v_z</span>
                    <input
                      type="number"
                      step="any"
                      value={v3}
                      onChange={(e) => setV3(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 font-mono font-bold text-sm text-center bg-white dark:bg-slate-900"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Optional Vector w for Triple Product (3D only) */}
          {dim === 3 && (
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Vector w (for Scalar Triple Product):
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="any"
                  value={w1}
                  onChange={(e) => setW1(e.target.value)}
                  placeholder="w_x"
                  className="w-16 p-1.5 rounded border text-xs font-mono font-bold text-center bg-white dark:bg-slate-900"
                />
                <input
                  type="number"
                  step="any"
                  value={w2}
                  onChange={(e) => setW2(e.target.value)}
                  placeholder="w_y"
                  className="w-16 p-1.5 rounded border text-xs font-mono font-bold text-center bg-white dark:bg-slate-900"
                />
                <input
                  type="number"
                  step="any"
                  value={w3}
                  onChange={(e) => setW3(e.target.value)}
                  placeholder="w_z"
                  className="w-16 p-1.5 rounded border text-xs font-mono font-bold text-center bg-white dark:bg-slate-900"
                />
                <button
                  onClick={() => handleOp('triple')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                >
                  u · (v × w)
                </button>
              </div>
            </div>
          )}

          {/* Operations Toolbar */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col gap-2.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Vector Operations:
            </span>

            {/* Individual Norms & Units */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleOp('magU')}
                className="px-2.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                ‖u‖ Magnitude
              </button>
              <button
                onClick={() => handleOp('unitU')}
                className="px-2.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                û Unit Vector
              </button>
              <button
                onClick={() => handleOp('magV')}
                className="px-2.5 py-1.5 rounded bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
              >
                ‖v‖ Magnitude
              </button>
              <button
                onClick={() => handleOp('unitV')}
                className="px-2.5 py-1.5 rounded bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
              >
                v̂ Unit Vector
              </button>
            </div>

            {/* Binary Vector Ops: Dot, Cross, Angle, Distance */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleOp('dot')}
                className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                u · v (Dot)
              </button>
              {dim === 3 && (
                <button
                  onClick={() => handleOp('cross')}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  u × v (Cross)
                </button>
              )}
              <button
                onClick={() => handleOp('angle')}
                className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                θ Angle(u, v)
              </button>
              <button
                onClick={() => handleOp('proj')}
                className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                projᵥ(u)
              </button>
              <button
                onClick={() => handleOp('comp')}
                className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                compᵥ(u)
              </button>
              <button
                onClick={() => handleOp('dist')}
                className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs"
              >
                d(u, v)
              </button>
              <button
                onClick={() => handleOp('add')}
                className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs"
              >
                u + v
              </button>
              <button
                onClick={() => handleOp('sub')}
                className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs"
              >
                u − v
              </button>
            </div>

            {/* Linear combination controls */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700 flex-wrap">
              <span className="text-xs font-bold text-slate-500">Linear Comb:</span>
              <input
                type="number"
                value={coefA}
                onChange={(e) => setCoefA(e.target.value)}
                className="w-12 p-1 rounded border text-xs font-bold text-center bg-white dark:bg-slate-900"
              />
              <span className="text-xs font-bold">· u +</span>
              <input
                type="number"
                value={coefB}
                onChange={(e) => setCoefB(e.target.value)}
                className="w-12 p-1 rounded border text-xs font-bold text-center bg-white dark:bg-slate-900"
              />
              <span className="text-xs font-bold">· v</span>
              <button
                onClick={() => handleOp('linearComb')}
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
              >
                Compute
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* Scalar Result Display */}
          {resScalar && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {resScalar.label}:
                </span>
                <div className="font-mono font-black text-emerald-800 dark:text-emerald-300 text-lg">
                  {parseFloat(resScalar.value.toFixed(6))}{resScalar.unit || ''}
                </div>
              </div>
              {onInsertToCalculator && (
                <button
                  onClick={() => {
                    onInsertToCalculator(resScalar.value.toString());
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs"
                >
                  Insert Result
                </button>
              )}
            </div>
          )}

          {/* Vector Result Display */}
          {resVector && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {resVector.label}:
                </span>
                <div className="font-mono font-black text-blue-700 dark:text-blue-300 text-lg">
                  {formatVectorString(resVector.vec)}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (resVector.vec.length >= 2) {
                      setU1(resVector.vec[0].toString());
                      setU2(resVector.vec[1].toString());
                      if (resVector.vec.length === 3) setU3(resVector.vec[2].toString());
                    }
                  }}
                  className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
                >
                  Set as u
                </button>
                {onInsertToCalculator && (
                  <button
                    onClick={() => {
                      onInsertToCalculator(formatVectorString(resVector.vec));
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs"
                  >
                    Insert Vector
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
