/**
 * DSTGH Scientific Calculator - Study Mode Explainer Engine
 * Generates educational step-by-step mathematical breakdowns
 */

import { Fraction } from './fraction';

export interface StudyExplanation {
  topic: string;
  expression: string;
  result: string;
  steps: string[];
  summary: string;
}

export class StudyModeEngine {
  static explain(expr: string, resultStr: string, numericVal: number): StudyExplanation | null {
    const clean = expr.trim();

    // 1. Square root: e.g. √144 or sqrt(144)
    const sqrtMatch = clean.match(/^(?:√|sqrt\(?)\s*([0-9.]+)\)?$/i);
    if (sqrtMatch) {
      const radicand = parseFloat(sqrtMatch[1]);
      const root = numericVal;
      return {
        topic: 'Square Root Definition',
        expression: clean,
        result: resultStr,
        steps: [
          `Identify the radicand: ${radicand}`,
          `By definition, the principal square root is the non-negative number which, when multiplied by itself, equals the radicand.`,
          `${resultStr} × ${resultStr} = ${parseFloat((root * root).toFixed(6))}`,
          `Therefore, √${radicand} = ${resultStr}.`,
        ],
        summary: `${resultStr} × ${resultStr} = ${radicand}, therefore √${radicand} = ${resultStr}.`,
      };
    }

    // 2. Powers: e.g. 2^8 or 2²
    const powMatch = clean.match(/^([0-9.]+)\s*(?:\^|²|³)\s*([0-9.]*)$/);
    if (powMatch) {
      const base = parseFloat(powMatch[1]);
      let exp = powMatch[2] ? parseFloat(powMatch[2]) : (clean.includes('²') ? 2 : 3);
      if (Number.isInteger(exp) && exp >= 0 && exp <= 10) {
        const factors = Array(exp).fill(base).join(' × ');
        return {
          topic: 'Exponentiation (Repeated Multiplication)',
          expression: clean,
          result: resultStr,
          steps: [
            `Base = ${base}, Exponent = ${exp}`,
            `The exponent specifies how many times the base is multiplied by itself:`,
            `${base}^${exp} = ${factors || '1'}`,
            `Evaluating the product gives ${resultStr}.`,
          ],
          summary: `${base}^${exp} = ${resultStr}`,
        };
      }
    }

    // 3. Factorial: e.g. 5!
    const factMatch = clean.match(/^([0-9]+)!$/);
    if (factMatch) {
      const n = parseInt(factMatch[1], 10);
      if (n <= 12) {
        const sequence = Array.from({ length: n }, (_, i) => n - i).join(' × ');
        return {
          topic: 'Factorial Definition (n!)',
          expression: clean,
          result: resultStr,
          steps: [
            `The factorial of a non-negative integer n is the product of all positive integers less than or equal to n.`,
            `${n}! = ${sequence || '1'}`,
            `Computing the product yields ${resultStr}.`,
          ],
          summary: `${n}! = ${sequence || '1'} = ${resultStr}.`,
        };
      }
    }

    // 4. Fractions addition: e.g. 1/2 + 1/3
    const fracAddMatch = clean.match(/^(\d+)\/(\d+)\s*([+\-×*÷/])\s*(\d+)\/(\d+)$/);
    if (fracAddMatch) {
      const n1 = BigInt(fracAddMatch[1]);
      const d1 = BigInt(fracAddMatch[2]);
      const op = fracAddMatch[3];
      const n2 = BigInt(fracAddMatch[4]);
      const d2 = BigInt(fracAddMatch[5]);

      const f1 = new Fraction(n1, d1);
      const f2 = new Fraction(n2, d2);

      if (op === '+') {
        const commonDenom = d1 * d2;
        const newNum1 = n1 * d2;
        const newNum2 = n2 * d1;
        const sumNum = newNum1 + newNum2;
        const simplified = f1.add(f2);

        return {
          topic: 'Fraction Addition (Common Denominator)',
          expression: clean,
          result: simplified.toProperString(),
          steps: [
            `Find a common denominator: ${d1} × ${d2} = ${commonDenom}`,
            `Convert first fraction: (${n1} × ${d2}) / (${d1} × ${d2}) = ${newNum1} / ${commonDenom}`,
            `Convert second fraction: (${n2} × ${d1}) / (${d2} × ${d1}) = ${newNum2} / ${commonDenom}`,
            `Add the numerators: (${newNum1} + ${newNum2}) / ${commonDenom} = ${sumNum} / ${commonDenom}`,
            `Simplify by GCD: ${simplified.toProperString()} (Decimal: ${parseFloat(simplified.toNumber().toFixed(6))})`,
          ],
          summary: `${n1}/${d1} + ${n2}/${d2} = ${simplified.toProperString()}`,
        };
      }
    }

    // 5. Trigonometric sin(30) or cos(60)
    const trigMatch = clean.match(/^(sin|cos|tan)\s*\(\s*([0-9.]+)\s*(?:°|deg)?\s*\)$/i);
    if (trigMatch) {
      const fn = trigMatch[1].toLowerCase();
      const deg = parseFloat(trigMatch[2]);
      let note = '';
      if (deg === 30 && fn === 'sin') note = 'Special Right Triangle (30°-60°-90°): Opposite / Hypotenuse = 1/2 = 0.5';
      else if (deg === 60 && fn === 'cos') note = 'Special Right Triangle (30°-60°-90°): Adjacent / Hypotenuse = 1/2 = 0.5';
      else if (deg === 45 && fn === 'tan') note = 'Isosceles Right Triangle (45°-45°-90°): Opposite / Adjacent = 1';
      else note = `Evaluates ${fn} of ${deg}° on the unit circle.`;

      return {
        topic: `Trigonometric Ratio (${fn.toUpperCase()})`,
        expression: clean,
        result: resultStr,
        steps: [
          `Function: ${fn.toUpperCase()}, Angle: ${deg}°`,
          note,
          `Result: ${resultStr}`,
        ],
        summary: `${fn}(${deg}°) = ${resultStr}`,
      };
    }

    // 6. Logarithms: log(100) or ln(e)
    const logMatch = clean.match(/^(log|ln)\s*\(\s*([0-9.a-zA-Z]+)\s*\)$/i);
    if (logMatch) {
      const type = logMatch[1].toLowerCase();
      const arg = logMatch[2];
      const base = type === 'log' ? '10' : 'e (approx 2.71828)';
      return {
        topic: `${type === 'log' ? 'Common Logarithm (Base 10)' : 'Natural Logarithm (Base e)'}`,
        expression: clean,
        result: resultStr,
        steps: [
          `Logarithm asks: "To what power must base ${base} be raised to get ${arg}?"`,
          `${base}^(${resultStr}) = ${arg}`,
          `Therefore, ${type}(${arg}) = ${resultStr}.`,
        ],
        summary: `${type}(${arg}) = ${resultStr} because ${base}^${resultStr} = ${arg}.`,
      };
    }

    // 7. Permutation / Combination
    const ncrMatch = clean.match(/^(\d+)\s*(nCr|nPr|C|P)\s*(\d+)$/i);
    if (ncrMatch) {
      const n = parseInt(ncrMatch[1], 10);
      const op = ncrMatch[2].toUpperCase().includes('C') ? 'Combinations (nCr)' : 'Permutations (nPr)';
      const r = parseInt(ncrMatch[3], 10);
      return {
        topic: op,
        expression: clean,
        result: resultStr,
        steps: [
          `Total elements n = ${n}, Selected elements r = ${r}`,
          op.includes('Comb')
            ? `Formula: n! / (r! × (n - r)!) = ${n}! / (${r}! × ${n - r}!)`
            : `Formula: n! / (n - r)! = ${n}! / ${n - r}!`,
          `Evaluating yields ${resultStr} distinct ways.`,
        ],
        summary: `${clean} = ${resultStr}`,
      };
    }

    // Generic educational breakdown
    return {
      topic: 'Arithmetic Evaluation',
      expression: clean,
      result: resultStr,
      steps: [
        `Standard evaluation adhering to strict mathematical operator precedence (BODMAS/PEMDAS):`,
        `1. Parentheses and function arguments`,
        `2. Exponents, roots, and factorials`,
        `3. Multiplication and Division (left-to-right)`,
        `4. Addition and Subtraction (left-to-right)`,
        `Final computed value: ${resultStr}`,
      ],
      summary: `${clean} = ${resultStr}`,
    };
  }
}
