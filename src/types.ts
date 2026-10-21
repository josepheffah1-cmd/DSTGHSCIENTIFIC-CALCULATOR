/**
 * DSTGH SCIENTIFIC CALCULATOR (DSTGH-SC991)
 * Application Type Definitions
 */

export type AngleMode = 'DEG' | 'RAD' | 'GRAD';

export type NumberFormatMode = 'NORM' | 'SCI' | 'ENG';

export type AppTheme = 'light' | 'dark' | 'system';

export type ActiveNavTab =
  | 'calculator'
  | 'statistics'
  | 'equations'
  | 'base-n'
  | 'baseN'
  | 'complex'
  | 'converter'
  | 'formulas'
  | 'study'
  | 'history'
  | 'settings'
  | 'matrix'
  | 'vector'
  | 'calculus'
  | 'table'
  | 'admin'
  | 'share';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  fractionResult?: string;
  mixedFractionResult?: string;
  isComplex?: boolean;
  complexResult?: string;
  timestamp: number;
  angleMode?: AngleMode;
  explanation?: string;
}

export interface MemoryBank {
  A: number;
  B: number;
  C: number;
  D: number;
  X: number;
  Y: number;
  M: number;
  Ans: number;
}

export interface CalculatorSettings {
  theme: AppTheme;
  angleMode: AngleMode;
  decimalPrecision: number; // 0 to 12
  numberFormat: NumberFormatMode;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  studyModeEnabled: boolean;
}

export interface StatSummary {
  n: number;
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  range: number;
  q1?: number;
  q3?: number;
  iqr?: number;
  variance: number;
  sampleVariance: number;
  popStdDev: number; // σ
  sampleStdDev: number; // s
  stdError?: number; // SE
  sumX: number; // Σx
  sumX2: number; // Σx²
}

export interface RegressionSummary {
  type: 'linear' | 'quadratic' | 'exponential' | 'logarithmic' | 'power';
  formula: string;
  params: { [key: string]: number };
  r: number;
  r2: number;
  predictions: { x: number; actualY: number; predY: number }[];
  sumStats?: {
    n: number;
    sumX: number;
    sumY: number;
    sumX2: number;
    sumY2: number;
    sumXY: number;
    meanX: number;
    meanY: number;
    sX: number;
    sY: number;
  };
}

export interface EquationSolution {
  title: string;
  equation: string;
  roots: { real: number; imag?: number }[];
  steps: string[];
  discriminant?: number;
}

export interface FormulaItem {
  id: string;
  category: string;
  name: string;
  formula: string;
  expressionToInsert: string;
  description: string;
  variables: { symbol: string; meaning: string }[];
}

export interface UnitCategory {
  id: string;
  name: string;
  iconName: string;
  units: { id: string; name: string; symbol: string; toBase: (v: number) => number; fromBase: (v: number) => number }[];
}
