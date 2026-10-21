/**
 * DSTGH Scientific Calculator - Safe Recursive-Descent Expression Parser
 * Strictly non-evaluating, type-safe, supports scientific functions, implicit multiplication,
 * angle modes, combinatorics, memory variables, and error classification.
 */

import { AngleMode, MemoryBank, NumberFormatMode } from '../types';
import { Fraction } from './fraction';
import { ComplexNumber } from './complex';

export interface EvalResult {
  numericValue: number;
  displayText: string;
  fractionText?: string;
  fractionValue?: string;
  mixedFractionValue?: string;
  engineeringText?: string;
  scientificText?: string;
  isInteger: boolean;
  isComplex?: boolean;
  complexValue?: { re: number; im: number; polar: string };
  coordinateResult?: { type: 'Pol' | 'Rec'; primary: number; secondary: number; display: string };
  error?: string;
}

export class MathEvaluator {
  private angleMode: AngleMode;
  private memory: MemoryBank;
  private precision: number;
  private lastPol?: { r: number; theta: number };
  private lastRec?: { x: number; y: number };

  constructor(angleMode: AngleMode = 'DEG', memory?: Partial<MemoryBank>, precision = 10) {
    this.angleMode = angleMode;
    this.precision = precision;
    this.memory = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      X: 0,
      Y: 0,
      M: 0,
      Ans: 0,
      ...memory,
    };
  }

  setAngleMode(mode: AngleMode) {
    this.angleMode = mode;
  }

  setMemory(mem: MemoryBank) {
    this.memory = { ...mem };
  }

  setPrecision(p: number) {
    this.precision = Math.max(0, Math.min(14, p));
  }

  private toRadians(angle: number): number {
    if (this.angleMode === 'DEG') {
      return (angle * Math.PI) / 180;
    } else if (this.angleMode === 'GRAD') {
      return (angle * Math.PI) / 200;
    }
    return angle; // RAD
  }

  private fromRadians(rad: number): number {
    if (this.angleMode === 'DEG') {
      return (rad * 180) / Math.PI;
    } else if (this.angleMode === 'GRAD') {
      return (rad * 200) / Math.PI;
    }
    return rad;
  }

  public evaluate(rawExpr: string): EvalResult {
    try {
      if (!rawExpr || rawExpr.trim() === '') {
        return {
          numericValue: 0,
          displayText: '0',
          isInteger: true,
        };
      }

      this.lastPol = undefined;
      this.lastRec = undefined;

      const trimmed = rawExpr.trim();

      // Check if expression is asking for prime factorization, e.g. fact(60) or FACT(60)
      const factMatch = trimmed.match(/^(?:fact|FACT)\s*\(\s*(\d+)\s*\)$/);
      if (factMatch) {
        const n = parseInt(factMatch[1], 10);
        const factorStr = MathEvaluator.factorize(n);
        return {
          numericValue: n,
          displayText: factorStr,
          isInteger: true,
        };
      }

      // Check if expression involves imaginary unit 'i' (e.g. 3+4i, 2i, conj, arg, real, imag)
      const hasImaginary =
        /(?<![a-zA-Z])i(?![a-zA-Z])/i.test(trimmed) ||
        /\b(conj|real|imag)\b/i.test(trimmed);

      if (hasImaginary) {
        try {
          const cRes = ComplexNumber.evalComplex(trimmed, this.angleMode);
          if (Math.abs(cRes.im) < 1e-12) {
            // Pure real result
            const val = cRes.re;
            const formatted = this.formatNumber(val);
            const frac = Fraction.fromDecimal(val);
            const properStr = frac && frac.denominator !== 1n && frac.denominator < 100000n ? frac.toProperString() : undefined;
            const mixedStr = frac && frac.denominator !== 1n && frac.denominator < 100000n ? frac.toMixedString('space') : undefined;

            return {
              numericValue: val,
              displayText: formatted.normal,
              scientificText: formatted.sci,
              engineeringText: formatted.eng,
              fractionText: properStr,
              fractionValue: properStr,
              mixedFractionValue: mixedStr,
              isInteger: Number.isInteger(val),
              isComplex: false,
            };
          }

          const polar = cRes.toPolarString(this.angleMode === 'GRAD' ? 'DEG' : this.angleMode);
          const rectStr = cRes.toString();
          return {
            numericValue: cRes.re,
            displayText: rectStr,
            fractionText: polar,
            fractionValue: polar, // S↔D toggles to polar form!
            isInteger: false,
            isComplex: true,
            complexValue: {
              re: cRes.re,
              im: cRes.im,
              polar,
            },
          };
        } catch (cErr: unknown) {
          // If complex evaluation threw a syntax error, let standard evaluation try or propagate
          const errMsg = cErr instanceof Error ? cErr.message : 'Math ERROR';
          return {
            numericValue: NaN,
            displayText: errMsg,
            error: errMsg,
            isInteger: false,
          };
        }
      }

      // Pre-process expression for real evaluation
      const sanitized = this.preprocess(rawExpr);
      const tokens = this.tokenize(sanitized);
      const val = this.parseExpression(tokens);

      if (isNaN(val)) {
        throw new Error('Math ERROR');
      }
      if (!isFinite(val)) {
        if (val === Infinity || val === -Infinity) {
          throw new Error('Overflow');
        }
        throw new Error('Undefined');
      }

      // Handle coordinate conversions results
      if (this.lastPol) {
        const rStr = this.formatNumber(this.lastPol.r).normal;
        const thetaUnit = this.angleMode === 'RAD' ? ' rad' : '°';
        const thetaStr = `${this.formatNumber(this.lastPol.theta).normal}${thetaUnit}`;
        return {
          numericValue: this.lastPol.r,
          displayText: `r = ${rStr}, θ = ${thetaStr}`,
          coordinateResult: {
            type: 'Pol',
            primary: this.lastPol.r,
            secondary: this.lastPol.theta,
            display: `r = ${rStr}, θ = ${thetaStr}`,
          },
          isInteger: false,
        };
      }

      if (this.lastRec) {
        const xStr = this.formatNumber(this.lastRec.x).normal;
        const yStr = this.formatNumber(this.lastRec.y).normal;
        return {
          numericValue: this.lastRec.x,
          displayText: `x = ${xStr}, y = ${yStr}`,
          coordinateResult: {
            type: 'Rec',
            primary: this.lastRec.x,
            secondary: this.lastRec.y,
            display: `x = ${xStr}, y = ${yStr}`,
          },
          isInteger: false,
        };
      }

      // Format standard numeric result
      const formatted = this.formatNumber(val);
      const frac = Fraction.fromDecimal(val);
      let fracStr: string | undefined;
      let mixedFracStr: string | undefined;

      if (frac && frac.denominator !== 1n && frac.denominator < 100000n) {
        fracStr = frac.toProperString();
        mixedFracStr = frac.toMixedString('space');
      }

      return {
        numericValue: val,
        displayText: formatted.normal,
        scientificText: formatted.sci,
        engineeringText: formatted.eng,
        fractionText: fracStr,
        fractionValue: fracStr,
        mixedFractionValue: mixedFracStr,
        isInteger: Number.isInteger(val),
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Math ERROR';
      return {
        numericValue: NaN,
        displayText: msg,
        error: msg,
        isInteger: false,
      };
    }
  }

  private preprocess(expr: string): string {
    let s = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/–/g, '-')
      .replace(/π/g, ' PI ')
      .replace(/Ans/g, ' ANS ')
      .replace(/sin⁻¹\(/g, 'asin(')
      .replace(/cos⁻¹\(/g, 'acos(')
      .replace(/tan⁻¹\(/g, 'atan(')
      .replace(/sinh⁻¹\(/g, 'asinh(')
      .replace(/cosh⁻¹\(/g, 'acosh(')
      .replace(/tanh⁻¹\(/g, 'atanh(')
      .replace(/arcsin\(/g, 'asin(')
      .replace(/arccos\(/g, 'acos(')
      .replace(/arctan\(/g, 'atan(')
      .replace(/×10\^/g, '*10^')
      .replace(/³√\(/g, 'cbrt(')
      .replace(/³√([0-9.]+)/g, 'cbrt($1)')
      .replace(/√\(/g, 'sqrt(')
      .replace(/√([0-9.]+)/g, 'sqrt($1)')
      .replace(/²/g, '^2')
      .replace(/³/g, '^3')
      .replace(/⁻¹/g, '^(-1)');

    // Mixed fractions with 믐 symbol: e.g. 1 믐 1 믐 2 or 1 믐 1/2 -> ((1*2 + 1)/2)
    s = s.replace(/(\d+)\s*믐\s*(\d+)\s*(?:믐|\/)\s*(\d+)/g, '((($1)*($3)+($2))/($3))');

    // Mixed fractions with space: e.g. 1 1/2 or 2 3/4 -> ((1*2 + 1)/2)
    s = s.replace(/(?<=\b|\()(\d+)\s+(\d+)\/(\d+)(?=\b|\))/g, '((($1)*($3)+($2))/($3))');

    // Simple fractions with 믐 symbol: e.g. 3 믐 4 -> (3/4)
    s = s.replace(/(\d+)\s*믐\s*(\d+)/g, '($1/$2)');

    // Replace any remaining 믐 or ⌟ symbol with /
    s = s.replace(/[믐⌟]/g, '/');

    return s;
  }

  // Tokenizer
  private tokenize(expr: string): string[] {
    const tokens: string[] = [];
    let i = 0;
    const len = expr.length;

    while (i < len) {
      const c = expr[i];

      if (/\s/.test(c)) {
        i++;
        continue;
      }

      // Numbers (integers, decimals, and scientific E notation like 1.5e-3 or 10E5)
      if (/[0-9]/.test(c) || (c === '.' && i + 1 < len && /[0-9]/.test(expr[i + 1]))) {
        let numStr = c;
        i++;
        let hasDot = c === '.';
        while (i < len && (/[0-9]/.test(expr[i]) || (expr[i] === '.' && !hasDot))) {
          if (expr[i] === '.') hasDot = true;
          numStr += expr[i];
          i++;
        }
        // Check for scientific exponent: e.g. 5E+3 or 5E-3
        if (i < len && (expr[i] === 'E' || expr[i] === 'e') && i + 1 < len && /[0-9+\-]/.test(expr[i + 1])) {
          const next = expr[i + 1];
          if (/[0-9]/.test(next) || ((next === '+' || next === '-') && i + 2 < len && /[0-9]/.test(expr[i + 2]))) {
            numStr += 'e';
            i++;
            if (expr[i] === '+' || expr[i] === '-') {
              numStr += expr[i];
              i++;
            }
            while (i < len && /[0-9]/.test(expr[i])) {
              numStr += expr[i];
              i++;
            }
          }
        }
        tokens.push(numStr);
        continue;
      }

      // Multi-character identifiers / functions
      if (/[a-zA-Z_]/.test(c)) {
        let idStr = '';
        while (i < len && /[a-zA-Z0-9_]/.test(expr[i])) {
          idStr += expr[i];
          i++;
        }
        tokens.push(idStr);
        continue;
      }

      // Two-character operators like nPr, nCr if entered, or <=, >=
      if (c === 'n' && i + 2 < len && expr.substr(i, 3) === 'nPr') {
        tokens.push('nPr');
        i += 3;
        continue;
      }
      if (c === 'n' && i + 2 < len && expr.substr(i, 3) === 'nCr') {
        tokens.push('nCr');
        i += 3;
        continue;
      }

      // Single char symbols
      tokens.push(c);
      i++;
    }

    // Insert implicit multiplications, e.g. 2(3) -> 2 * (3), (2)(3) -> (2) * (3), 2sin(30) -> 2 * sin(30)
    const refined: string[] = [];
    for (let j = 0; j < tokens.length; j++) {
      const cur = tokens[j];
      refined.push(cur);

      if (j + 1 < tokens.length) {
        const next = tokens[j + 1];
        const isCurrentNumberOrConst =
          this.isNumber(cur) ||
          cur === ')' ||
          cur === '!' ||
          cur === '%' ||
          cur === 'PI' ||
          cur.toUpperCase() === 'E' ||
          cur === 'ANS' ||
          ['A', 'B', 'C', 'D', 'X', 'Y', 'M'].includes(cur.toUpperCase());

        const isNextStart =
          this.isNumber(next) ||
          next === '(' ||
          next === 'PI' ||
          next.toUpperCase() === 'E' ||
          next === 'ANS' ||
          ['A', 'B', 'C', 'D', 'X', 'Y', 'M'].includes(next.toUpperCase()) ||
          this.isFunction(next);

        const isCurCombinatorics = cur === 'nPr' || cur === 'nCr';
        const isNextCombinatorics = next === 'nPr' || next === 'nCr';

        if (isCurrentNumberOrConst && isNextStart && !isCurCombinatorics && !isNextCombinatorics) {
          refined.push('*');
        }
      }
    }

    return refined;
  }

  private isNumber(token: string): boolean {
    return !isNaN(Number(token)) && token !== '';
  }

  private isFunction(token: string): boolean {
    const funcs = [
      'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
      'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
      'log', 'ln', 'exp', 'tenpow', 'sqrt', 'cbrt', 'abs',
      'gcd', 'lcm', 'mod', 'pol', 'rec', 'ncr', 'npr', 'rnd',
      'mean', 'median', 'var', 'variance', 'std', 'stddev', 'sum', 'min', 'max'
    ];
    return funcs.includes(token.toLowerCase());
  }

  // Recursive descent parser
  private parseExpression(tokens: string[]): number {
    let index = 0;

    const peek = () => (index < tokens.length ? tokens[index] : null);
    const consume = () => tokens[index++];

    const parsePrimary = (): number => {
      const token = peek();
      if (!token) throw new Error('Syntax ERROR');

      // Unary minus
      if (token === '-') {
        consume();
        return -parsePrimary();
      }
      if (token === '+') {
        consume();
        return parsePrimary();
      }

      // Parentheses
      if (token === '(') {
        consume();
        const val = parseAddSub();
        const closing = peek();
        if (closing === ')') {
          consume();
        } // Auto-close unclosed parens gently
        return val;
      }

      // Constants & Memory
      if (token.toUpperCase() === 'PI') {
        consume();
        return Math.PI;
      }
      if (token.toUpperCase() === 'E' && tokens[index + 1] !== '(') {
        consume();
        return Math.E;
      }
      if (token.toUpperCase() === 'ANS') {
        consume();
        return this.memory.Ans;
      }
      if (['A', 'B', 'C', 'D', 'X', 'Y', 'M'].includes(token.toUpperCase())) {
        consume();
        return this.memory[token.toUpperCase() as keyof MemoryBank] ?? 0;
      }

      // Functions (single and multi-argument support)
      if (this.isFunction(token)) {
        const fn = consume().toLowerCase();
        const args: number[] = [];

        if (peek() === '(') {
          consume();
          if (peek() !== ')') {
            args.push(parseAddSub());
            while (peek() === ',') {
              consume();
              args.push(parseAddSub());
            }
          }
          if (peek() === ')') consume();
        } else {
          args.push(parsePrimary());
        }

        const arg1 = args[0] ?? 0;
        const arg2 = args[1];

        switch (fn) {
          case 'sin': {
            const rad = this.toRadians(arg1);
            // Handle precision zeroing e.g. sin(180 deg) == 0, sin(200 grad) == 0
            if (this.angleMode === 'DEG' && arg1 % 180 === 0) return 0;
            if (this.angleMode === 'GRAD' && arg1 % 200 === 0) return 0;
            return Math.sin(rad);
          }
          case 'cos': {
            const rad = this.toRadians(arg1);
            if (this.angleMode === 'DEG' && (arg1 - 90) % 180 === 0) return 0;
            if (this.angleMode === 'GRAD' && (arg1 - 100) % 200 === 0) return 0;
            return Math.cos(rad);
          }
          case 'tan': {
            if (this.angleMode === 'DEG' && (arg1 - 90) % 180 === 0) {
              throw new Error('Math ERROR');
            }
            if (this.angleMode === 'GRAD' && (arg1 - 100) % 200 === 0) {
              throw new Error('Math ERROR');
            }
            const rad = this.toRadians(arg1);
            if (this.angleMode === 'DEG' && arg1 % 180 === 0) return 0;
            if (this.angleMode === 'GRAD' && arg1 % 200 === 0) return 0;
            return Math.tan(rad);
          }
          case 'asin': {
            if (arg1 < -1 || arg1 > 1) throw new Error('Domain ERROR');
            return this.fromRadians(Math.asin(arg1));
          }
          case 'acos': {
            if (arg1 < -1 || arg1 > 1) throw new Error('Domain ERROR');
            return this.fromRadians(Math.acos(arg1));
          }
          case 'atan':
            return this.fromRadians(Math.atan(arg1));
          case 'sinh':
            return Math.sinh(arg1);
          case 'cosh':
            return Math.cosh(arg1);
          case 'tanh':
            return Math.tanh(arg1);
          case 'asinh':
            return Math.asinh(arg1);
          case 'acosh':
            if (arg1 < 1) throw new Error('Domain ERROR');
            return Math.acosh(arg1);
          case 'atanh':
            if (arg1 <= -1 || arg1 >= 1) throw new Error('Domain ERROR');
            return Math.atanh(arg1);
          case 'log':
            if (arg1 <= 0) throw new Error('Domain ERROR');
            return Math.log10(arg1);
          case 'ln':
            if (arg1 <= 0) throw new Error('Domain ERROR');
            return Math.log(arg1);
          case 'exp':
            return Math.exp(arg1);
          case 'tenpow':
            return Math.pow(10, arg1);
          case 'sqrt':
            if (arg1 < 0) throw new Error('Domain ERROR');
            return Math.sqrt(arg1);
          case 'cbrt':
            return Math.cbrt(arg1);
          case 'abs':
            return Math.abs(arg1);
          case 'gcd':
            return this.gcd(Math.round(Math.abs(arg1)), Math.round(Math.abs(arg2 ?? 0)));
          case 'lcm':
            return this.lcm(Math.round(Math.abs(arg1)), Math.round(Math.abs(arg2 ?? 0)));
          case 'mod':
            if (!arg2) throw new Error('Division by ZERO');
            return ((arg1 % arg2) + arg2) % arg2;
          case 'ncr':
            return this.combination(Math.round(arg1), Math.round(arg2 ?? 0));
          case 'npr':
            return this.permutation(Math.round(arg1), Math.round(arg2 ?? 0));
          case 'pol': {
            const y = arg2 ?? 0;
            const r = Math.sqrt(arg1 * arg1 + y * y);
            const rad = Math.atan2(y, arg1);
            const theta = this.fromRadians(rad);
            this.memory.X = r;
            this.memory.Y = theta;
            this.lastPol = { r, theta };
            return r;
          }
          case 'rec': {
            const theta = arg2 ?? 0;
            const rad = this.toRadians(theta);
            const x = arg1 * Math.cos(rad);
            const y = arg1 * Math.sin(rad);
            this.memory.X = x;
            this.memory.Y = y;
            this.lastRec = { x, y };
            return x;
          }
          case 'rnd': {
            const dec = arg2 !== undefined ? Math.round(arg2) : this.precision;
            const factor = Math.pow(10, dec);
            return Math.round(arg1 * factor) / factor;
          }
          case 'mean': {
            if (args.length === 0) throw new Error('Argument ERROR');
            return args.reduce((acc, v) => acc + v, 0) / args.length;
          }
          case 'median': {
            if (args.length === 0) throw new Error('Argument ERROR');
            const sorted = [...args].sort((a, b) => a - b);
            const m = Math.floor(sorted.length / 2);
            return sorted.length % 2 === 0 ? (sorted[m - 1] + sorted[m]) / 2 : sorted[m];
          }
          case 'sum': {
            return args.reduce((acc, v) => acc + v, 0);
          }
          case 'var':
          case 'variance': {
            if (args.length < 2) throw new Error('At least 2 values required');
            const avg = args.reduce((acc, v) => acc + v, 0) / args.length;
            const sumSq = args.reduce((acc, v) => acc + (v - avg) * (v - avg), 0);
            return sumSq / (args.length - 1);
          }
          case 'std':
          case 'stddev': {
            if (args.length < 2) throw new Error('At least 2 values required');
            const avg = args.reduce((acc, v) => acc + v, 0) / args.length;
            const sumSq = args.reduce((acc, v) => acc + (v - avg) * (v - avg), 0);
            return Math.sqrt(sumSq / (args.length - 1));
          }
          case 'min': {
            if (args.length === 0) throw new Error('Argument ERROR');
            return Math.min(...args);
          }
          case 'max': {
            if (args.length === 0) throw new Error('Argument ERROR');
            return Math.max(...args);
          }
          default:
            throw new Error(`Unknown function ${fn}`);
        }
      }

      // Numbers
      if (this.isNumber(token)) {
        consume();
        return parseFloat(token);
      }

      throw new Error('Syntax ERROR');
    };

    // Postfix operations: Factorial !, Percentage %, Powers
    const parsePostfix = (): number => {
      let val = parsePrimary();

      while (peek() === '!' || peek() === '%') {
        const op = consume();
        if (op === '!') {
          if (val < 0 || !Number.isInteger(val) || val > 170) {
            throw new Error('Domain ERROR');
          }
          val = this.factorial(Math.round(val));
        } else if (op === '%') {
          val = val / 100;
        }
      }

      return val;
    };

    // Power ^
    const parsePower = (): number => {
      let left = parsePostfix();

      while (peek() === '^') {
        consume();
        const right = parsePostfix();
        if (left === 0 && right < 0) throw new Error('Division by ZERO');
        if (left < 0 && !Number.isInteger(right)) {
          // Negative base with non-integer power -> complex in general
          throw new Error('Domain ERROR');
        }
        left = Math.pow(left, right);
      }

      return left;
    };

    // Combinatorics: nPr, nCr
    const parseCombinatorics = (): number => {
      let left = parsePower();

      while (peek() === 'nPr' || peek() === 'nCr' || peek() === 'P' || peek() === 'C') {
        const op = consume();
        const right = parsePower();

        const n = Math.round(left);
        const r = Math.round(right);

        if (n < 0 || r < 0 || r > n || !Number.isInteger(left) || !Number.isInteger(right)) {
          throw new Error('Domain ERROR');
        }

        if (op === 'nPr' || op === 'P') {
          left = this.permutation(n, r);
        } else {
          left = this.combination(n, r);
        }
      }

      return left;
    };

    // Multiplication & Division
    const parseMulDiv = (): number => {
      let left = parseCombinatorics();

      while (peek() === '*' || peek() === '/') {
        const op = consume();
        const right = parseCombinatorics();

        if (op === '*') {
          left = left * right;
        } else if (op === '/') {
          if (right === 0) {
            throw new Error('Division by ZERO');
          }
          left = left / right;
        }
      }

      return left;
    };

    // Addition & Subtraction
    const parseAddSub = (): number => {
      let left = parseMulDiv();

      while (peek() === '+' || peek() === '-') {
        const op = consume();
        const right = parseMulDiv();

        if (op === '+') {
          left = left + right;
        } else if (op === '-') {
          left = left - right;
        }
      }

      return left;
    };

    const result = parseAddSub();

    if (index < tokens.length) {
      throw new Error('Syntax ERROR');
    }

    return result;
  }

  private factorial(n: number): number {
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) {
      res *= i;
      if (!isFinite(res)) throw new Error('Overflow');
    }
    return res;
  }

  private permutation(n: number, r: number): number {
    if (r === 0) return 1;
    let res = 1;
    for (let i = 0; i < r; i++) {
      res *= n - i;
    }
    return res;
  }

  private combination(n: number, r: number): number {
    if (r === 0 || r === n) return 1;
    const k = Math.min(r, n - r);
    let res = 1;
    for (let i = 1; i <= k; i++) {
      res = (res * (n - k + i)) / i;
    }
    return Math.round(res);
  }

  private gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  private lcm(a: number, b: number): number {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / this.gcd(a, b);
  }

  public static factorize(n: number): string {
    if (n === 0) return '0';
    if (n === 1) return '1';
    if (n < 0) return '-' + MathEvaluator.factorize(-n);

    let temp = Math.round(n);
    const factors: { [p: number]: number } = {};

    for (let d = 2; d * d <= temp; d++) {
      while (temp % d === 0) {
        factors[d] = (factors[d] || 0) + 1;
        temp /= d;
      }
    }
    if (temp > 1) {
      factors[temp] = (factors[temp] || 0) + 1;
    }

    const keys = Object.keys(factors).map(Number).sort((a, b) => a - b);
    if (keys.length === 1 && factors[keys[0]] === 1) {
      return `${n} (Prime)`;
    }

    const superscripts: { [k: string]: string } = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };
    const toSuper = (num: number) => num.toString().split('').map(c => superscripts[c] || c).join('');

    return keys.map(k => {
      const exp = factors[k];
      return exp > 1 ? `${k}${toSuper(exp)}` : `${k}`;
    }).join(' × ');
  }

  public formatNumber(val: number): { normal: string; sci: string; eng: string } {
    if (isNaN(val)) return { normal: 'Math ERROR', sci: 'Math ERROR', eng: 'Math ERROR' };
    if (!isFinite(val)) return { normal: val > 0 ? 'Infinity' : '-Infinity', sci: 'Infinity', eng: 'Infinity' };

    // Standard floating point rounding e.g. 0.1 + 0.2 -> 0.3
    const rounded = Number(val.toPrecision(12));

    // Normal display string
    let normal: string;
    if (Math.abs(rounded) < 1e-10 && rounded !== 0) {
      normal = rounded.toExponential(this.precision);
    } else if (Math.abs(rounded) >= 1e11) {
      normal = rounded.toExponential(this.precision);
    } else {
      const p = Math.min(10, Math.max(0, this.precision));
      normal = parseFloat(rounded.toFixed(p)).toString();
    }

    // Scientific: e.g. 1.25 × 10^3
    const sciExp = rounded.toExponential(this.precision);
    const [sciBase, sciPower] = sciExp.split('e');
    const sciFormatted = `${parseFloat(Number(sciBase).toFixed(6))} × 10^${parseInt(sciPower, 10)}`;

    // Engineering: exponent must be multiple of 3
    let engFormatted = normal;
    if (rounded !== 0) {
      const exp = Math.floor(Math.log10(Math.abs(rounded)));
      const engExp = Math.floor(exp / 3) * 3;
      const engBase = rounded / Math.pow(10, engExp);
      engFormatted = `${parseFloat(engBase.toFixed(6))} × 10^${engExp}`;
    }

    return {
      normal,
      sci: sciFormatted,
      eng: engFormatted,
    };
  }
}
