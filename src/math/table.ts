/**
 * DSTGH Scientific Calculator - Table Mode Engine
 * Evaluates f(x) over [Start, End] with given Step
 */

import { MathEvaluator } from './evaluator';

export interface TableRow {
  index: number;
  x: number;
  fx: number | null;
  displayFx: string;
}

export class TableEngine {
  static generateTable(
    expr: string,
    start: number,
    end: number,
    step: number,
    angleMode: 'DEG' | 'RAD' = 'DEG'
  ): TableRow[] {
    if (step <= 0) throw new Error('Step size must be positive');
    if (start > end) throw new Error('Start must be less than or equal to End');

    const count = Math.min(500, Math.floor((end - start) / step) + 1);
    const rows: TableRow[] = [];

    const evaluator = new MathEvaluator(angleMode);

    for (let i = 0; i < count; i++) {
      const x = Number((start + i * step).toFixed(8));
      const processed = expr.replace(/\bx\b/gi, `(${x})`);

      try {
        const res = evaluator.evaluate(processed);
        if (res.error) {
          rows.push({
            index: i + 1,
            x,
            fx: null,
            displayFx: res.error,
          });
        } else {
          rows.push({
            index: i + 1,
            x,
            fx: res.numericValue,
            displayFx: res.displayText,
          });
        }
      } catch {
        rows.push({
          index: i + 1,
          x,
          fx: null,
          displayFx: 'Math ERROR',
        });
      }
    }

    return rows;
  }
}
