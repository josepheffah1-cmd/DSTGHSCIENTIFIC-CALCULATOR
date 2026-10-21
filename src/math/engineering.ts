/**
 * DSTGH Scientific Calculator - Engineering Notation Engine
 * Implements standard Casio / Scientific ENG behavior:
 * - Exponents constrained to multiples of 3: M × 10^(3k) where 1 <= |M| < 1000
 * - Exponent shifting: ENG shifts exponent down by 3 (×10^3 -> ×10^0 -> ×10^-3)
 * - Shift + ENG (←ENG) shifts exponent up by 3 (×10^3 -> ×10^6 -> ×10^9)
 * - SI Metric unit prefixes: k, M, G, T, P, E, Z, Y, m, µ, n, p, f, a, z, y
 */

export interface EngineeringResult {
  value: number;
  mantissa: number;
  exponent: number;
  displayText: string; // e.g. "12.345 × 10³"
  prefixText: string;  // e.g. "12.345 k"
  prefixSymbol: string; // e.g. "k"
  prefixName: string;   // e.g. "kilo"
}

export class EngineeringEngine {
  public static readonly SI_PREFIXES: Record<number, { symbol: string; name: string }> = {
    24: { symbol: 'Y', name: 'yotta' },
    21: { symbol: 'Z', name: 'zetta' },
    18: { symbol: 'E', name: 'exa' },
    15: { symbol: 'P', name: 'peta' },
    12: { symbol: 'T', name: 'tera' },
    9: { symbol: 'G', name: 'giga' },
    6: { symbol: 'M', name: 'mega' },
    3: { symbol: 'k', name: 'kilo' },
    0: { symbol: '', name: '' },
    [-3]: { symbol: 'm', name: 'milli' },
    [-6]: { symbol: 'µ', name: 'micro' },
    [-9]: { symbol: 'n', name: 'nano' },
    [-12]: { symbol: 'p', name: 'pico' },
    [-15]: { symbol: 'f', name: 'femto' },
    [-18]: { symbol: 'a', name: 'atto' },
    [-21]: { symbol: 'z', name: 'zepto' },
    [-24]: { symbol: 'y', name: 'yocto' },
  };

  /**
   * Converts a number to standard engineering notation with exponent offset.
   * @param val The numeric value to format
   * @param exponentOffset Multiple of 3 shift relative to natural engineering form
   */
  public static toEngineering(val: number, exponentOffset = 0): EngineeringResult {
    if (isNaN(val)) {
      return {
        value: NaN,
        mantissa: NaN,
        exponent: 0,
        displayText: 'Math ERROR',
        prefixText: 'Math ERROR',
        prefixSymbol: '',
        prefixName: '',
      };
    }

    if (!isFinite(val)) {
      const sign = val > 0 ? 'Infinity' : '-Infinity';
      return {
        value: val,
        mantissa: val,
        exponent: 0,
        displayText: sign,
        prefixText: sign,
        prefixSymbol: '',
        prefixName: '',
      };
    }

    if (val === 0) {
      const exp = exponentOffset * 3;
      const expStr = exp === 0 ? '0' : `0 × 10^${exp}`;
      const prefix = this.SI_PREFIXES[exp] || { symbol: '', name: '' };
      return {
        value: 0,
        mantissa: 0,
        exponent: exp,
        displayText: expStr,
        prefixText: prefix.symbol ? `0 ${prefix.symbol}` : '0',
        prefixSymbol: prefix.symbol,
        prefixName: prefix.name,
      };
    }

    // Natural engineering exponent: multiple of 3 where 1 <= |mantissa| < 1000
    const absVal = Math.abs(val);
    const log10 = Math.floor(Math.log10(absVal));
    const naturalExp = Math.floor(log10 / 3) * 3;
    
    // Apply user shift offset (in multiples of 3)
    const totalExp = naturalExp + exponentOffset * 3;
    const mantissa = val / Math.pow(10, totalExp);

    // Format mantissa cleanly, avoiding floating point artifacts
    const roundedMantissa = parseFloat(mantissa.toFixed(8));

    // Superscripts for power
    const superscripts: Record<string, string> = {
      '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³',
      '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    };
    const toSuper = (n: number) =>
      n.toString().split('').map((c) => superscripts[c] || c).join('');

    const displayText =
      totalExp === 0
        ? `${roundedMantissa}`
        : `${roundedMantissa} × 10${toSuper(totalExp)}`;

    const prefix = this.SI_PREFIXES[totalExp];
    const prefixSymbol = prefix ? prefix.symbol : '';
    const prefixName = prefix ? prefix.name : '';
    const prefixText = prefixSymbol
      ? `${roundedMantissa} ${prefixSymbol}`
      : displayText;

    return {
      value: val,
      mantissa: roundedMantissa,
      exponent: totalExp,
      displayText,
      prefixText,
      prefixSymbol,
      prefixName,
    };
  }

  /**
   * Shifts the engineering exponent down or up by 3 (one step).
   * ENG button: direction = 'down' (e.g. 10^3 -> 10^0)
   * Shift + ENG button: direction = 'up' (e.g. 10^3 -> 10^6)
   */
  public static shiftStep(
    val: number,
    currentOffset: number,
    direction: 'down' | 'up'
  ): { nextOffset: number; result: EngineeringResult } {
    const nextOffset = direction === 'down' ? currentOffset - 1 : currentOffset + 1;
    const result = this.toEngineering(val, nextOffset);
    return { nextOffset, result };
  }

  /**
   * Formats a number with its best matching SI metric prefix.
   */
  public static formatSIPrefix(val: number): string {
    const res = this.toEngineering(val, 0);
    return res.prefixText;
  }
}
