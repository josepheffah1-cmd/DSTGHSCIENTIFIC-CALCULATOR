/**
 * DSTGH Scientific Calculator - Fraction Engine
 * High-precision fraction arithmetic & decimal-to-fraction conversions
 */

export class Fraction {
  numerator: bigint;
  denominator: bigint;

  constructor(numerator: bigint | number, denominator: bigint | number = 1n) {
    let num = typeof numerator === 'number' ? BigInt(Math.round(numerator)) : numerator;
    let den = typeof denominator === 'number' ? BigInt(Math.round(denominator)) : denominator;

    if (den === 0n) {
      throw new Error('Division by ZERO');
    }

    if (den < 0n) {
      num = -num;
      den = -den;
    }

    const gcdVal = Fraction.gcd(num < 0n ? -num : num, den);
    this.numerator = num / gcdVal;
    this.denominator = den / gcdVal;
  }

  static gcd(a: bigint, b: bigint): bigint {
    while (b !== 0n) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  static fromDecimal(val: number, maxDenominator = 1000000): Fraction | null {
    if (isNaN(val) || !isFinite(val)) return null;
    const sign = val < 0 ? -1n : 1n;
    const absVal = Math.abs(val);

    // Exact integer
    if (Math.abs(absVal - Math.round(absVal)) < 1e-12) {
      return new Fraction(sign * BigInt(Math.round(absVal)), 1n);
    }

    // Continued fraction algorithm for best rational approximation
    let h1 = 1n, h2 = 0n;
    let k1 = 0n, k2 = 1n;
    let b = absVal;

    for (let i = 0; i < 20; i++) {
      const a = Math.floor(b);
      const auxH = BigInt(a) * h1 + h2;
      const auxK = BigInt(a) * k1 + k2;

      if (auxK > BigInt(maxDenominator)) break;

      h2 = h1;
      h1 = auxH;
      k2 = k1;
      k1 = auxK;

      const diff = b - a;
      if (diff < 1e-12) break;
      b = 1 / diff;

      // Check if current approximation is close enough
      const currentApprox = Number(h1) / Number(k1);
      if (Math.abs(currentApprox - absVal) < 1e-9) break;
    }

    if (k1 === 0n) return null;
    return new Fraction(sign * h1, k1);
  }

  add(other: Fraction): Fraction {
    return new Fraction(
      this.numerator * other.denominator + other.numerator * this.denominator,
      this.denominator * other.denominator
    );
  }

  subtract(other: Fraction): Fraction {
    return new Fraction(
      this.numerator * other.denominator - other.numerator * this.denominator,
      this.denominator * other.denominator
    );
  }

  multiply(other: Fraction): Fraction {
    return new Fraction(
      this.numerator * other.numerator,
      this.denominator * other.denominator
    );
  }

  divide(other: Fraction): Fraction {
    if (other.numerator === 0n) {
      throw new Error('Division by ZERO');
    }
    return new Fraction(
      this.numerator * other.denominator,
      this.denominator * other.numerator
    );
  }

  toNumber(): number {
    return Number(this.numerator) / Number(this.denominator);
  }

  toProperString(): string {
    if (this.denominator === 1n) {
      return this.numerator.toString();
    }
    return `${this.numerator}/${this.denominator}`;
  }

  toMixedString(format: 'space' | 'symbol' = 'space'): string {
    if (this.denominator === 1n) return this.numerator.toString();
    const whole = this.numerator / this.denominator;
    const rem = this.numerator % this.denominator;

    if (whole === 0n) {
      return `${this.numerator}/${this.denominator}`;
    }
    const absRem = rem < 0n ? -rem : rem;
    if (format === 'symbol') {
      return `${whole} 믐 ${absRem}/${this.denominator}`;
    }
    return `${whole} ${absRem}/${this.denominator}`;
  }

  static parse(str: string): Fraction | null {
    const trimmed = str.trim();
    if (!trimmed) return null;

    // Mixed number with 믐: a 믐 b 믐 c or a 믐 b/c
    const mixedSymMatch = trimmed.match(/^([+-]?\d+)\s*믐\s*(\d+)\s*(?:믐|\/)\s*(\d+)$/);
    if (mixedSymMatch) {
      const whole = BigInt(mixedSymMatch[1]);
      const num = BigInt(mixedSymMatch[2]);
      const den = BigInt(mixedSymMatch[3]);
      if (den === 0n) return null;
      const sign = whole < 0n ? -1n : 1n;
      const absWhole = whole < 0n ? -whole : whole;
      const totalNum = sign * (absWhole * den + num);
      return new Fraction(totalNum, den);
    }

    // Mixed number with space: a b/c e.g. "1 1/2" or "-2 3/4"
    const mixedSpaceMatch = trimmed.match(/^([+-]?\d+)\s+(\d+)\/(\d+)$/);
    if (mixedSpaceMatch) {
      const whole = BigInt(mixedSpaceMatch[1]);
      const num = BigInt(mixedSpaceMatch[2]);
      const den = BigInt(mixedSpaceMatch[3]);
      if (den === 0n) return null;
      const sign = whole < 0n ? -1n : 1n;
      const absWhole = whole < 0n ? -whole : whole;
      const totalNum = sign * (absWhole * den + num);
      return new Fraction(totalNum, den);
    }

    // Simple fraction: a/b or a 믐 b
    const fracMatch = trimmed.match(/^([+-]?\d+)\s*(?:\/|믐)\s*([+-]?\d+)$/);
    if (fracMatch) {
      const num = BigInt(fracMatch[1]);
      const den = BigInt(fracMatch[2]);
      if (den === 0n) return null;
      return new Fraction(num, den);
    }

    // Pure integer
    if (/^[+-]?\d+$/.test(trimmed)) {
      return new Fraction(BigInt(trimmed), 1n);
    }

    // Try parsing as decimal
    const numVal = parseFloat(trimmed);
    if (!isNaN(numVal) && isFinite(numVal)) {
      return Fraction.fromDecimal(numVal);
    }

    return null;
  }
}
