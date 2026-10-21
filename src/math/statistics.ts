/**
 * DSTGH Scientific Calculator - Statistics & Regression Engine
 * 1-Variable Statistics & 2-Variable Regression Models
 * Accurate to textbook standards (NIST / Casio fx-991 class)
 */

import { RegressionSummary, StatSummary } from '../types';

export interface DataPoint1Var {
  x: number;
  freq?: number;
}

export interface DataPoint2Var {
  x: number;
  y: number;
  freq?: number;
}

export class StatisticsEngine {
  /**
   * 1-Variable Statistics Analysis
   * Supports array of numbers or array of { x, freq } objects.
   */
  static calculate1Var(input: (number | DataPoint1Var)[]): StatSummary {
    if (!input || input.length === 0) {
      throw new Error('No data observations provided');
    }

    // Expand or weight observations
    const items: { x: number; freq: number }[] = [];
    for (const item of input) {
      if (typeof item === 'number') {
        if (!isNaN(item)) items.push({ x: item, freq: 1 });
      } else if (item && typeof item.x === 'number' && !isNaN(item.x)) {
        const f = Math.max(1, Math.round(item.freq ?? 1));
        items.push({ x: item.x, freq: f });
      }
    }

    if (items.length === 0) {
      throw new Error('No valid numeric observations found');
    }

    let n = 0;
    let sumX = 0;
    let sumX2 = 0;
    const freqMap = new Map<number, number>();

    // Sorted array of individual values for percentile and median calculations
    const allValues: number[] = [];

    for (const item of items) {
      n += item.freq;
      sumX += item.x * item.freq;
      sumX2 += item.x * item.x * item.freq;
      freqMap.set(item.x, (freqMap.get(item.x) ?? 0) + item.freq);

      for (let k = 0; k < item.freq; k++) {
        allValues.push(item.x);
      }
    }

    allValues.sort((a, b) => a - b);
    const min = allValues[0];
    const max = allValues[allValues.length - 1];
    const range = max - min;
    const mean = sumX / n;

    // Median
    let median: number;
    const mid = Math.floor(n / 2);
    if (n % 2 === 0) {
      median = (allValues[mid - 1] + allValues[mid]) / 2;
    } else {
      median = allValues[mid];
    }

    // Quartiles Q1 and Q3
    // Standard lower/upper halves method (Tukey)
    const lowerHalf = allValues.slice(0, mid);
    const upperHalf = n % 2 === 0 ? allValues.slice(mid) : allValues.slice(mid + 1);

    const getMedianOf = (arr: number[]): number => {
      if (arr.length === 0) return 0;
      const m = Math.floor(arr.length / 2);
      return arr.length % 2 === 0 ? (arr[m - 1] + arr[m]) / 2 : arr[m];
    };

    const q1 = lowerHalf.length > 0 ? getMedianOf(lowerHalf) : min;
    const q3 = upperHalf.length > 0 ? getMedianOf(upperHalf) : max;
    const iqr = q3 - q1;

    // Mode
    let maxFreq = 0;
    for (const count of freqMap.values()) {
      if (count > maxFreq) maxFreq = count;
    }
    const mode: number[] = [];
    if (maxFreq > 1) {
      for (const [val, count] of freqMap.entries()) {
        if (count === maxFreq) mode.push(val);
      }
    }

    // Variances & Standard Deviations
    // Population Variance σ² = (Σx² / n) - μ²
    const popVariance = sumX2 / n - mean * mean;
    const popStdDev = Math.sqrt(Math.max(0, popVariance));

    // Sample Variance s² = (Σx² - (Σx)²/n) / (n - 1)
    const sampleVariance = n > 1 ? (sumX2 - (sumX * sumX) / n) / (n - 1) : 0;
    const sampleStdDev = Math.sqrt(Math.max(0, sampleVariance));
    const stdError = n > 0 ? sampleStdDev / Math.sqrt(n) : 0;

    return {
      n,
      mean,
      median,
      mode: mode.sort((a, b) => a - b),
      min,
      max,
      range,
      q1,
      q3,
      iqr,
      variance: Math.max(0, popVariance),
      sampleVariance: Math.max(0, sampleVariance),
      popStdDev,
      sampleStdDev,
      stdError,
      sumX,
      sumX2,
    };
  }

  /**
   * Linear Regression: y = a + bx (and y = bx + a)
   */
  static linearRegression(points: { x: number; y: number; freq?: number }[]): RegressionSummary {
    const valid = points.filter((p) => !isNaN(p.x) && !isNaN(p.y));
    if (valid.length < 2) throw new Error('At least 2 points required for linear regression');

    let n = 0;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    for (const p of valid) {
      const f = Math.max(1, p.freq ?? 1);
      n += f;
      sumX += p.x * f;
      sumY += p.y * f;
      sumXY += p.x * p.y * f;
      sumX2 += p.x * p.x * f;
      sumY2 += p.y * p.y * f;
    }

    const denom = n * sumX2 - sumX * sumX;
    if (Math.abs(denom) < 1e-12) {
      throw new Error('All x values are identical; cannot fit unique slope');
    }

    const slope = (n * sumXY - sumX * sumY) / denom; // b (slope)
    const intercept = (sumY - slope * sumX) / n; // a (intercept)

    // Pearson correlation coefficient r
    const denomY = n * sumY2 - sumY * sumY;
    let r = 0;
    if (denomY > 1e-12) {
      r = (n * sumXY - sumX * sumY) / Math.sqrt(denom * denomY);
    }
    const r2 = r * r;

    const meanX = sumX / n;
    const meanY = sumY / n;
    const sX = n > 1 ? Math.sqrt(Math.max(0, (sumX2 - (sumX * sumX) / n) / (n - 1))) : 0;
    const sY = n > 1 ? Math.sqrt(Math.max(0, (sumY2 - (sumY * sumY) / n) / (n - 1))) : 0;

    const predictions = valid.map((p) => ({
      x: p.x,
      actualY: p.y,
      predY: slope * p.x + intercept,
    }));

    const slopeStr = parseFloat(slope.toFixed(6));
    const interceptStr = parseFloat(intercept.toFixed(6));
    const sign = intercept >= 0 ? '+' : '-';
    const absIntercept = Math.abs(interceptStr);

    return {
      type: 'linear',
      formula: `y = ${slopeStr}x ${sign} ${absIntercept}`,
      params: { a: intercept, b: slope },
      r,
      r2,
      predictions,
      sumStats: {
        n,
        sumX,
        sumY,
        sumX2,
        sumY2,
        sumXY,
        meanX,
        meanY,
        sX,
        sY,
      },
    };
  }

  /**
   * Quadratic Regression: y = ax² + bx + c
   * Solved via 3x3 normal equations least-squares system:
   * [S4 S3 S2] [a]   [T2]
   * [S3 S2 S1] [b] = [T1]
   * [S2 S1 S0] [c]   [T0]
   */
  static quadraticRegression(points: { x: number; y: number }[]): RegressionSummary {
    const valid = points.filter((p) => !isNaN(p.x) && !isNaN(p.y));
    if (valid.length < 3) throw new Error('At least 3 points required for quadratic regression');

    const n = valid.length;
    let s0 = n;
    let s1 = 0;
    let s2 = 0;
    let s3 = 0;
    let s4 = 0;
    let t0 = 0;
    let t1 = 0;
    let t2 = 0;

    for (const p of valid) {
      const x = p.x;
      const y = p.y;
      const x2 = x * x;
      s1 += x;
      s2 += x2;
      s3 += x2 * x;
      s4 += x2 * x2;
      t0 += y;
      t1 += x * y;
      t2 += x2 * y;
    }

    // 3x3 Determinant
    const det3 = (
      m11: number, m12: number, m13: number,
      m21: number, m22: number, m23: number,
      m31: number, m32: number, m33: number
    ) =>
      m11 * (m22 * m33 - m23 * m32) -
      m12 * (m21 * m33 - m23 * m31) +
      m13 * (m21 * m32 - m22 * m31);

    const D = det3(s4, s3, s2, s3, s2, s1, s2, s1, s0);
    if (Math.abs(D) < 1e-12) {
      throw new Error('Collinear or insufficient independent x coordinates for quadratic fit');
    }

    const Da = det3(t2, s3, s2, t1, s2, s1, t0, s1, s0);
    const Db = det3(s4, t2, s2, s3, t1, s1, s2, t0, s0);
    const Dc = det3(s4, s3, t2, s3, s2, t1, s2, s1, t0);

    const a = Da / D;
    const b = Db / D;
    const c = Dc / D;

    // Predictions & R²
    const meanY = t0 / n;
    let ssTot = 0;
    let ssRes = 0;

    const predictions = valid.map((p) => {
      const pred = a * p.x * p.x + b * p.x + c;
      ssTot += (p.y - meanY) * (p.y - meanY);
      ssRes += (p.y - pred) * (p.y - pred);
      return { x: p.x, actualY: p.y, predY: pred };
    });

    let r2 = ssTot > 1e-12 ? 1 - ssRes / ssTot : 1;
    r2 = Math.max(0, Math.min(1, r2));
    const r = Math.sqrt(r2);

    const aStr = parseFloat(a.toFixed(6));
    const bSign = b >= 0 ? '+' : '-';
    const bStr = Math.abs(parseFloat(b.toFixed(6)));
    const cSign = c >= 0 ? '+' : '-';
    const cStr = Math.abs(parseFloat(c.toFixed(6)));

    return {
      type: 'quadratic',
      formula: `y = ${aStr}x² ${bSign} ${bStr}x ${cSign} ${cStr}`,
      params: { a, b, c },
      r,
      r2,
      predictions,
      sumStats: {
        n,
        sumX: s1,
        sumY: t0,
        sumX2: s2,
        sumY2: valid.reduce((acc, p) => acc + p.y * p.y, 0),
        sumXY: t1,
        meanX: s1 / n,
        meanY,
        sX: Math.sqrt(Math.max(0, (s2 - (s1 * s1) / n) / (n - 1))),
        sY: Math.sqrt(Math.max(0, ssTot / (n - 1))),
      },
    };
  }

  /**
   * Exponential Regression: y = a · e^(bx) or y = a · B^x
   * Fits ln(y) = ln(a) + bx
   */
  static exponentialRegression(points: { x: number; y: number }[]): RegressionSummary {
    const valid = points.filter((p) => !isNaN(p.x) && !isNaN(p.y) && p.y > 0);
    if (valid.length < 2) {
      throw new Error('At least 2 points with y > 0 are required for exponential regression');
    }

    const transformed = valid.map((p) => ({ x: p.x, y: Math.log(p.y) }));
    const lin = this.linearRegression(transformed);

    const b = lin.params.b; // slope in transformed space
    const a = Math.exp(lin.params.a); // intercept transformed to original space
    const B = Math.exp(b); // base for y = a * B^x

    // True R² on original scale
    const meanY = valid.reduce((acc, p) => acc + p.y, 0) / valid.length;
    let ssTot = 0;
    let ssRes = 0;

    const predictions = valid.map((p) => {
      const predY = a * Math.exp(b * p.x);
      ssTot += (p.y - meanY) * (p.y - meanY);
      ssRes += (p.y - predY) * (p.y - predY);
      return { x: p.x, actualY: p.y, predY };
    });

    let r2 = ssTot > 1e-12 ? 1 - ssRes / ssTot : 1;
    r2 = Math.max(0, Math.min(1, r2));

    const aStr = parseFloat(a.toFixed(6));
    const bStr = parseFloat(b.toFixed(6));
    const BStr = parseFloat(B.toFixed(6));

    return {
      type: 'exponential',
      formula: `y = ${aStr} · e^(${bStr}x)  [or y = ${aStr} · (${BStr})^x]`,
      params: { a, b, B },
      r: Math.sqrt(r2),
      r2,
      predictions,
    };
  }

  /**
   * Logarithmic Regression: y = a + b · ln(x)
   */
  static logarithmicRegression(points: { x: number; y: number }[]): RegressionSummary {
    const valid = points.filter((p) => !isNaN(p.x) && !isNaN(p.y) && p.x > 0);
    if (valid.length < 2) {
      throw new Error('At least 2 points with x > 0 are required for logarithmic regression');
    }

    const transformed = valid.map((p) => ({ x: Math.log(p.x), y: p.y }));
    const lin = this.linearRegression(transformed);

    const b = lin.params.b;
    const a = lin.params.a;

    const predictions = valid.map((p) => ({
      x: p.x,
      actualY: p.y,
      predY: a + b * Math.log(p.x),
    }));

    const aStr = parseFloat(a.toFixed(6));
    const bSign = b >= 0 ? '+' : '-';
    const bStr = Math.abs(parseFloat(b.toFixed(6)));

    return {
      type: 'logarithmic',
      formula: `y = ${aStr} ${bSign} ${bStr} · ln(x)`,
      params: { a, b },
      r: lin.r,
      r2: lin.r2,
      predictions,
    };
  }

  /**
   * Power Regression: y = a · x^b
   * Fits ln(y) = ln(a) + b · ln(x)
   */
  static powerRegression(points: { x: number; y: number }[]): RegressionSummary {
    const valid = points.filter((p) => !isNaN(p.x) && !isNaN(p.y) && p.x > 0 && p.y > 0);
    if (valid.length < 2) {
      throw new Error('At least 2 points with x > 0 and y > 0 are required for power regression');
    }

    const transformed = valid.map((p) => ({ x: Math.log(p.x), y: Math.log(p.y) }));
    const lin = this.linearRegression(transformed);

    const b = lin.params.b;
    const a = Math.exp(lin.params.a);

    const meanY = valid.reduce((acc, p) => acc + p.y, 0) / valid.length;
    let ssTot = 0;
    let ssRes = 0;

    const predictions = valid.map((p) => {
      const predY = a * Math.pow(p.x, b);
      ssTot += (p.y - meanY) * (p.y - meanY);
      ssRes += (p.y - predY) * (p.y - predY);
      return { x: p.x, actualY: p.y, predY };
    });

    let r2 = ssTot > 1e-12 ? 1 - ssRes / ssTot : 1;
    r2 = Math.max(0, Math.min(1, r2));

    const aStr = parseFloat(a.toFixed(6));
    const bStr = parseFloat(b.toFixed(6));

    return {
      type: 'power',
      formula: `y = ${aStr} · x^(${bStr})`,
      params: { a, b },
      r: Math.sqrt(r2),
      r2,
      predictions,
    };
  }

  /**
   * Predict y given x for any fitted model
   */
  static predictY(reg: RegressionSummary, x: number): number {
    switch (reg.type) {
      case 'linear':
        return reg.params.b * x + reg.params.a;
      case 'quadratic':
        return reg.params.a * x * x + reg.params.b * x + reg.params.c;
      case 'exponential':
        return reg.params.a * Math.exp(reg.params.b * x);
      case 'logarithmic':
        return x > 0 ? reg.params.a + reg.params.b * Math.log(x) : NaN;
      case 'power':
        return x > 0 ? reg.params.a * Math.pow(x, reg.params.b) : NaN;
      default:
        return NaN;
    }
  }
}
