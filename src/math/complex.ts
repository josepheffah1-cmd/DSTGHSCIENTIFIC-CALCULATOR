/**
 * DSTGH Scientific Calculator - Complex Numbers Engine
 * Representation: z = a + bi or r∠θ
 */

export class ComplexNumber {
  re: number;
  im: number;

  constructor(re: number, im = 0) {
    this.re = re;
    this.im = im;
  }

  get real(): number {
    return this.re;
  }

  get imag(): number {
    return this.im;
  }

  abs(): number {
    return this.magnitude();
  }

  toPolar(mode: 'DEG' | 'RAD' = 'DEG'): { r: number; theta: number } {
    return {
      r: this.magnitude(),
      theta: this.argument(mode),
    };
  }

  add(other: ComplexNumber): ComplexNumber {
    return new ComplexNumber(this.re + other.re, this.im + other.im);
  }

  subtract(other: ComplexNumber): ComplexNumber {
    return new ComplexNumber(this.re - other.re, this.im - other.im);
  }

  multiply(other: ComplexNumber): ComplexNumber {
    return new ComplexNumber(
      this.re * other.re - this.im * other.im,
      this.re * other.im + this.im * other.re
    );
  }

  divide(other: ComplexNumber): ComplexNumber {
    const denom = other.re * other.re + other.im * other.im;
    if (denom === 0) {
      throw new Error('Division by ZERO');
    }
    return new ComplexNumber(
      (this.re * other.re + this.im * other.im) / denom,
      (this.im * other.re - this.re * other.im) / denom
    );
  }

  conjugate(): ComplexNumber {
    return new ComplexNumber(this.re, -this.im);
  }

  conj(): ComplexNumber {
    return this.conjugate();
  }

  magnitude(): number {
    return Math.sqrt(this.re * this.re + this.im * this.im);
  }

  argument(mode: 'DEG' | 'RAD' = 'DEG'): number {
    const rad = Math.atan2(this.im, this.re);
    return mode === 'DEG' ? (rad * 180) / Math.PI : rad;
  }

  arg(mode: 'DEG' | 'RAD' = 'DEG'): number {
    return this.argument(mode);
  }

  toString(): string {
    const r = parseFloat(this.re.toFixed(6));
    const i = parseFloat(this.im.toFixed(6));

    if (i === 0) return `${r}`;
    if (r === 0) {
      if (i === 1) return 'i';
      if (i === -1) return '-i';
      return `${i}i`;
    }

    const sign = i >= 0 ? '+' : '-';
    const absI = Math.abs(i);
    const iPart = absI === 1 ? 'i' : `${absI}i`;
    return `${r} ${sign} ${iPart}`;
  }

  toPolarString(mode: 'DEG' | 'RAD' = 'DEG'): string {
    const r = parseFloat(this.magnitude().toFixed(6));
    const theta = parseFloat(this.argument(mode).toFixed(4));
    const unit = mode === 'DEG' ? '°' : ' rad';
    return `${r} ∠ ${theta}${unit}`;
  }

  pow(n: number): ComplexNumber {
    if (n === 0) return new ComplexNumber(1, 0);
    if (n === 1) return new ComplexNumber(this.re, this.im);
    if (this.re === 0 && this.im === 0) return new ComplexNumber(0, 0);

    const r = this.magnitude();
    const theta = Math.atan2(this.im, this.re);
    const newR = Math.pow(r, n);
    const newTheta = theta * n;
    return new ComplexNumber(newR * Math.cos(newTheta), newR * Math.sin(newTheta));
  }

  sqrt(): ComplexNumber {
    const r = this.magnitude();
    const theta = Math.atan2(this.im, this.re);
    const newR = Math.sqrt(r);
    const newTheta = theta / 2;
    return new ComplexNumber(newR * Math.cos(newTheta), newR * Math.sin(newTheta));
  }

  negate(): ComplexNumber {
    return new ComplexNumber(-this.re, -this.im);
  }

  static parse(str: string): ComplexNumber {
    const cleaned = str.replace(/\s+/g, '');
    if (cleaned === 'i') return new ComplexNumber(0, 1);
    if (cleaned === '-i') return new ComplexNumber(0, -1);

    // Match (a+bi) or a+bi
    const match = cleaned.match(/^([+-]?\d*\.?\d+(?:e[+-]?\d+)?)?([+-]\d*\.?\d*(?:e[+-]?\d+)?i)?$/i);
    if (!match) {
      // Single pure imaginary or pure real
      if (cleaned.endsWith('i')) {
        const coef = cleaned.slice(0, -1);
        if (coef === '' || coef === '+') return new ComplexNumber(0, 1);
        if (coef === '-') return new ComplexNumber(0, -1);
        return new ComplexNumber(0, parseFloat(coef));
      }
      return new ComplexNumber(parseFloat(cleaned), 0);
    }

    const realPart = match[1] ? parseFloat(match[1]) : 0;
    let imagPart = 0;
    if (match[2]) {
      const coef = match[2].slice(0, -1);
      if (coef === '+' || coef === '') imagPart = 1;
      else if (coef === '-') imagPart = -1;
      else imagPart = parseFloat(coef);
    }

    return new ComplexNumber(realPart, imagPart);
  }

  /**
   * Evaluate basic arithmetic expressions involving complex numbers & i
   */
  static evalComplex(expr: string, angleMode: 'DEG' | 'RAD' | 'GRAD' = 'DEG'): ComplexNumber {
    // Sanitize
    let s = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/–/g, '-')
      .replace(/\s+/g, '')
      .replace(/²/g, '^2')
      .replace(/³/g, '^3')
      .replace(/⁻¹/g, '^(-1)');

    // Tokenize
    const tokens: string[] = [];
    let i = 0;
    const len = s.length;

    while (i < len) {
      const c = s[i];

      if (/[0-9.]/.test(c)) {
        let numStr = '';
        while (i < len && /[0-9.]/.test(s[i])) {
          numStr += s[i];
          i++;
        }
        tokens.push(numStr);
        continue;
      }

      if (/[a-zA-Z_]/.test(c)) {
        let id = '';
        while (i < len && /[a-zA-Z0-9_]/.test(s[i])) {
          id += s[i];
          i++;
        }
        tokens.push(id);
        continue;
      }

      tokens.push(c);
      i++;
    }

    // Insert implicit multiplications: e.g. 3i -> 3 * i, 2(3+i) -> 2 * (3+i), (1+i)(2+i)
    const refined: string[] = [];
    for (let j = 0; j < tokens.length; j++) {
      const cur = tokens[j];
      refined.push(cur);

      if (j + 1 < tokens.length) {
        const next = tokens[j + 1];
        const isCurVal = !isNaN(Number(cur)) || cur === 'i' || cur === ')' || cur.toLowerCase() === 'pi' || cur.toLowerCase() === 'e';
        const isNextStart = !isNaN(Number(next)) || next === 'i' || next === '(' || ['abs', 'arg', 'conj', 'real', 'imag', 'sqrt'].includes(next.toLowerCase());

        if (isCurVal && isNextStart) {
          refined.push('*');
        }
      }
    }

    let p = 0;
    const peek = () => (p < refined.length ? refined[p] : null);
    const consume = () => refined[p++];

    const parsePrimary = (): ComplexNumber => {
      const tok = peek();
      if (!tok) throw new Error('Syntax ERROR');

      if (tok === '-') {
        consume();
        return parsePrimary().negate();
      }
      if (tok === '+') {
        consume();
        return parsePrimary();
      }
      if (tok === '(') {
        consume();
        const res = parseAddSub();
        if (peek() === ')') consume();
        return res;
      }
      if (tok === 'i') {
        consume();
        return new ComplexNumber(0, 1);
      }
      if (tok.toLowerCase() === 'pi') {
        consume();
        return new ComplexNumber(Math.PI, 0);
      }
      if (tok.toLowerCase() === 'e') {
        consume();
        return new ComplexNumber(Math.E, 0);
      }

      // Functions: abs, arg, conj, real, imag, sqrt
      const lowTok = tok.toLowerCase();
      if (['abs', 'arg', 'conj', 'real', 'imag', 'sqrt'].includes(lowTok)) {
        consume();
        let arg: ComplexNumber;
        if (peek() === '(') {
          consume();
          arg = parseAddSub();
          if (peek() === ')') consume();
        } else {
          arg = parsePrimary();
        }

        switch (lowTok) {
          case 'abs':
            return new ComplexNumber(arg.magnitude(), 0);
          case 'arg': {
            const rad = Math.atan2(arg.im, arg.re);
            let angle = rad;
            if (angleMode === 'DEG') angle = (rad * 180) / Math.PI;
            else if (angleMode === 'GRAD') angle = (rad * 200) / Math.PI;
            return new ComplexNumber(angle, 0);
          }
          case 'conj':
            return arg.conjugate();
          case 'real':
            return new ComplexNumber(arg.re, 0);
          case 'imag':
            return new ComplexNumber(arg.im, 0);
          case 'sqrt':
            return arg.sqrt();
        }
      }

      if (!isNaN(Number(tok))) {
        consume();
        return new ComplexNumber(parseFloat(tok), 0);
      }

      throw new Error('Syntax ERROR');
    };

    const parsePower = (): ComplexNumber => {
      let left = parsePrimary();
      while (peek() === '^') {
        consume();
        const right = parsePrimary();
        if (right.im !== 0) throw new Error('Complex exponent not supported');
        left = left.pow(right.re);
      }
      return left;
    };

    const parseMulDiv = (): ComplexNumber => {
      let left = parsePower();
      while (peek() === '*' || peek() === '/') {
        const op = consume();
        const right = parsePower();
        if (op === '*') left = left.multiply(right);
        else left = left.divide(right);
      }
      return left;
    };

    const parseAddSub = (): ComplexNumber => {
      let left = parseMulDiv();
      while (peek() === '+' || peek() === '-') {
        const op = consume();
        const right = parseMulDiv();
        if (op === '+') left = left.add(right);
        else left = left.subtract(right);
      }
      return left;
    };

    const result = parseAddSub();
    if (p < refined.length) throw new Error('Syntax ERROR');
    return result;
  }
}
