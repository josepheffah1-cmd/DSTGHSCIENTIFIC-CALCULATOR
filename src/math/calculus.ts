/**
 * DSTGH Scientific Calculator - Calculus Engine
 * 1. Numerical Differentiation: f'(x) at x₀
 * 2. Definite Numerical Integration: ∫_a^b f(x) dx via Composite Simpson's Rule
 * 3. Limit Approximation: lim_{x -> a} f(x)
 */

import { MathEvaluator } from './evaluator';
import { Fraction } from './fraction';

export class CalculusEngine {
  /**
   * Helper to safely evaluate f(x) for a given value of x
   */
  static evalFunction(expr: string, xVal: number): number {
    // Replace standalone x with xVal, taking care of numbers or function names
    const evaluator = new MathEvaluator('RAD', { X: xVal });
    // Replace lowercase 'x' with 'X' variable
    const processed = expr.replace(/\bx\b/gi, `(${xVal})`);
    const res = evaluator.evaluate(processed);
    if (res.error) {
      throw new Error(res.error);
    }
    return res.numericValue;
  }

  /**
   * Numerical Derivative: 5-point stencil central difference
   * f'(x) ≈ (-f(x+2h) + 8f(x+h) - 8f(x-h) + f(x-2h)) / (12h)
   */
  static differentiate(expr: string, x0: number, h = 1e-5): {
    value: number;
    fraction?: string;
    explanation: string;
  } {
    const f = (x: number) => this.evalFunction(expr, x);

    const f_plus_2h = f(x0 + 2 * h);
    const f_plus_h = f(x0 + h);
    const f_minus_h = f(x0 - h);
    const f_minus_2h = f(x0 - 2 * h);

    const deriv = (-f_plus_2h + 8 * f_plus_h - 8 * f_minus_h + f_minus_2h) / (12 * h);
    const rounded = Number(deriv.toPrecision(10));

    // Try fraction
    const frac = Fraction.fromDecimal(rounded);
    const fracStr = frac && frac.denominator < 1000n ? frac.toProperString() : undefined;

    const explanation = `Numerical derivative evaluated using 5-point central difference at x = ${x0}:\n` +
      `d/dx(${expr})|_{x=${x0}} ≈ ${parseFloat(rounded.toFixed(6))}` +
      (fracStr ? ` = ${fracStr}` : '');

    return {
      value: rounded,
      fraction: fracStr,
      explanation,
    };
  }

  /**
   * Definite Integration: Composite Simpson's 1/3 Rule
   * ∫_a^b f(x) dx ≈ (h/3) * [f(a) + 4Σf(x_odd) + 2Σf(x_even) + f(b)]
   */
  static integrate(expr: string, a: number, b: number, nSubdivisions = 1000): {
    value: number;
    fraction?: string;
    explanation: string;
  } {
    if (a === b) {
      return { value: 0, fraction: '0', explanation: `Integral from ${a} to ${a} is 0.` };
    }

    const n = nSubdivisions % 2 === 0 ? nSubdivisions : nSubdivisions + 1;
    const h = (b - a) / n;
    const f = (x: number) => this.evalFunction(expr, x);

    let sum = f(a) + f(b);

    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      const fx = f(x);
      if (i % 2 === 1) {
        sum += 4 * fx;
      } else {
        sum += 2 * fx;
      }
    }

    const integral = (h / 3) * sum;
    const rounded = Number(integral.toPrecision(10));

    // Try fraction match e.g. 8/3 for integral 0 to 2 of x^2
    const frac = Fraction.fromDecimal(rounded);
    const fracStr = frac && frac.denominator < 1000n ? frac.toProperString() : undefined;

    const explanation = `Definite integral computed using Adaptive Composite Simpson's rule with ${n} intervals:\n` +
      `∫_{${a}}^{${b}} (${expr}) dx ≈ ${parseFloat(rounded.toFixed(6))}` +
      (fracStr ? ` = ${fracStr}` : '');

    return {
      value: rounded,
      fraction: fracStr,
      explanation,
    };
  }

  /**
   * Limit approximation as x -> a
   */
  static approximateLimit(expr: string, a: number): {
    leftLimit: number;
    rightLimit: number;
    limit: number | null;
    explanation: string;
  } {
    const deltas = [1e-3, 1e-5, 1e-7];
    const leftVals = deltas.map((d) => this.evalFunction(expr, a - d));
    const rightVals = deltas.map((d) => this.evalFunction(expr, a + d));

    const leftLimit = leftVals[leftVals.length - 1];
    const rightLimit = rightVals[rightVals.length - 1];

    const diff = Math.abs(leftLimit - rightLimit);
    const limit = diff < 1e-4 ? Number(((leftLimit + rightLimit) / 2).toPrecision(8)) : null;

    let explanation = `Approaching x = ${a}:\n` +
      `From Left (x -> ${a}⁻): ${parseFloat(leftLimit.toFixed(6))}\n` +
      `From Right (x -> ${a}⁺): ${parseFloat(rightLimit.toFixed(6))}\n`;

    if (limit !== null) {
      explanation += `Left and Right limits converge! lim_{x -> ${a}} (${expr}) = ${parseFloat(limit.toFixed(6))}`;
    } else {
      explanation += `Left and Right limits do not converge. Two-sided limit does not exist.`;
    }

    return {
      leftLimit,
      rightLimit,
      limit,
      explanation,
    };
  }

  static numericalDerivative(expr: string, x0: number): number {
    return this.differentiate(expr, x0).value;
  }

  static numericalIntegral(expr: string, a: number, b: number): number {
    return this.integrate(expr, a, b).value;
  }
}
