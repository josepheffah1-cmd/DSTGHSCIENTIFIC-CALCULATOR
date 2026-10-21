/**
 * DSTGH Scientific Calculator - Base-N & Bitwise Operations Engine
 * Supports:
 * - Binary (BIN), Octal (OCT), Decimal (DEC), Hexadecimal (HEX)
 * - Bitwise Logic: AND, OR, XOR, NOT, NAND, NOR, XNOR
 * - Bit Operations: SHL, SHR, SAR, ROL, ROR, Negation (Two's complement)
 * - Bit Analysis: Popcount (Hamming weight), CLZ, CTZ, Parity
 * - Word Sizes: 8-bit (BYTE), 16-bit (WORD), 32-bit (DWORD), 64-bit (QWORD)
 * - Signed vs Unsigned representations
 */

export type BaseType = 'DEC' | 'BIN' | 'OCT' | 'HEX';
export type WordSize = 8 | 16 | 32 | 64;

export type BitwiseOperator =
  | 'AND'
  | 'OR'
  | 'XOR'
  | 'NOT'
  | 'NAND'
  | 'NOR'
  | 'XNOR'
  | 'SHL'
  | 'SHR'
  | 'SAR'
  | 'ROL'
  | 'ROR';

export interface BaseNConversionResult {
  DEC: string;
  BIN: string;
  OCT: string;
  HEX: string;
  signedDec: string;
  popcount: number;
  leadingZeros: number;
  parity: 'even' | 'odd';
  bitString: string;
}

export class BaseNEngine {
  /**
   * Returns the bitmask for the specified word size.
   */
  public static getMask(wordSize: WordSize = 32): bigint {
    switch (wordSize) {
      case 8:
        return 0xffn;
      case 16:
        return 0xffffn;
      case 32:
        return 0xffffffffn;
      case 64:
        return 0xffffffffffffffffn;
      default:
        return 0xffffffffn;
    }
  }

  /**
   * Parses an input string in a given base into a BigInt, respecting word size masking.
   */
  public static parseToDecimal(
    valStr: string,
    base: BaseType,
    wordSize: WordSize = 32
  ): bigint {
    const cleaned = valStr.trim().replace(/[\s_,]/g, '');
    if (!cleaned) return 0n;

    const mask = this.getMask(wordSize);
    let parsed: bigint;

    try {
      if (base === 'HEX') {
        parsed = BigInt('0x' + cleaned);
      } else if (base === 'BIN') {
        parsed = BigInt('0b' + cleaned);
      } else if (base === 'OCT') {
        parsed = BigInt('0o' + cleaned);
      } else {
        // DEC can be negative e.g. -5
        if (cleaned.startsWith('-')) {
          const pos = BigInt(cleaned.slice(1));
          parsed = (mask + 1n - (pos & mask)) & mask;
        } else {
          parsed = BigInt(cleaned);
        }
      }
    } catch {
      throw new Error(`Invalid ${base} literal: "${valStr}"`);
    }

    return parsed & mask;
  }

  /**
   * Formats a BigInt value to a specified base, word size, and signedness.
   */
  public static formatFromDecimal(
    val: bigint,
    base: BaseType,
    wordSize: WordSize = 32,
    signed = false
  ): string {
    const mask = this.getMask(wordSize);
    const uVal = val & mask;

    if (base === 'DEC') {
      if (signed) {
        const signBit = 1n << BigInt(wordSize - 1);
        if ((uVal & signBit) !== 0n) {
          // Negative number in two's complement
          const negVal = uVal - (1n << BigInt(wordSize));
          return negVal.toString(10);
        }
      }
      return uVal.toString(10);
    }

    if (base === 'BIN') {
      const raw = uVal.toString(2).padStart(wordSize, '0');
      // Group in 4-bit nibbles for readability
      return raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    if (base === 'OCT') {
      return uVal.toString(8);
    }

    // HEX
    const raw = uVal.toString(16).toUpperCase();
    return raw;
  }

  /**
   * Converts an input to all four bases and calculates bit statistics.
   */
  public static convertAll(
    valStr: string,
    fromBase: BaseType,
    wordSize: WordSize = 32
  ): BaseNConversionResult {
    const dec = this.parseToDecimal(valStr, fromBase, wordSize);
    const mask = this.getMask(wordSize);
    const uVal = dec & mask;

    // Signed decimal
    const signBit = 1n << BigInt(wordSize - 1);
    let signedDecStr = uVal.toString(10);
    if ((uVal & signBit) !== 0n) {
      const negVal = uVal - (1n << BigInt(wordSize));
      signedDecStr = negVal.toString(10);
    }

    // Binary bit string
    const bitStr = uVal.toString(2).padStart(wordSize, '0');

    // Popcount (Hamming weight)
    let popcount = 0;
    for (let i = 0; i < bitStr.length; i++) {
      if (bitStr[i] === '1') popcount++;
    }

    // Count Leading Zeros
    let leadingZeros = 0;
    for (let i = 0; i < bitStr.length; i++) {
      if (bitStr[i] === '0') leadingZeros++;
      else break;
    }

    return {
      DEC: this.formatFromDecimal(uVal, 'DEC', wordSize, false),
      BIN: this.formatFromDecimal(uVal, 'BIN', wordSize, false),
      OCT: this.formatFromDecimal(uVal, 'OCT', wordSize, false),
      HEX: this.formatFromDecimal(uVal, 'HEX', wordSize, false),
      signedDec: signedDecStr,
      popcount,
      leadingZeros,
      parity: popcount % 2 === 0 ? 'even' : 'odd',
      bitString: bitStr,
    };
  }

  /**
   * Performs bitwise operations:
   * AND, OR, XOR, NOT, NAND, NOR, XNOR, SHL, SHR, SAR, ROL, ROR
   */
  public static bitwiseOp(
    aStr: string,
    bStr: string,
    op: BitwiseOperator,
    base: BaseType,
    wordSize: WordSize = 32
  ): string {
    const a = this.parseToDecimal(aStr, base, wordSize);
    const b = op !== 'NOT' ? this.parseToDecimal(bStr, base, wordSize) : 0n;
    const mask = this.getMask(wordSize);
    const shiftAmount = Number(b % BigInt(wordSize));

    let res: bigint;

    switch (op) {
      case 'AND':
        res = a & b;
        break;
      case 'OR':
        res = a | b;
        break;
      case 'XOR':
        res = a ^ b;
        break;
      case 'NOT':
        res = ~a & mask;
        break;
      case 'NAND':
        res = ~(a & b) & mask;
        break;
      case 'NOR':
        res = ~(a | b) & mask;
        break;
      case 'XNOR':
        res = ~(a ^ b) & mask;
        break;
      case 'SHL':
        res = (a << BigInt(shiftAmount)) & mask;
        break;
      case 'SHR':
        // Logical shift right
        res = (a & mask) >> BigInt(shiftAmount);
        break;
      case 'SAR': {
        // Arithmetic shift right (preserves sign bit)
        const signBit = 1n << BigInt(wordSize - 1);
        const isNeg = (a & signBit) !== 0n;
        if (isNeg) {
          const shifted = a >> BigInt(shiftAmount);
          const topMask = (mask >> BigInt(wordSize - shiftAmount)) << BigInt(wordSize - shiftAmount);
          res = (shifted | topMask) & mask;
        } else {
          res = a >> BigInt(shiftAmount);
        }
        break;
      }
      case 'ROL': {
        // Rotate Left
        const s = BigInt(shiftAmount);
        res = ((a << s) | (a >> (BigInt(wordSize) - s))) & mask;
        break;
      }
      case 'ROR': {
        // Rotate Right
        const s = BigInt(shiftAmount);
        res = ((a >> s) | (a << (BigInt(wordSize) - s))) & mask;
        break;
      }
      default:
        throw new Error(`Unsupported bitwise operator: ${op}`);
    }

    return this.formatFromDecimal(res & mask, base, wordSize);
  }

  /**
   * Toggles an individual bit at position bitIndex (0-indexed from LSB).
   */
  public static toggleBit(
    val: bigint,
    bitIndex: number,
    wordSize: WordSize = 32
  ): bigint {
    const mask = this.getMask(wordSize);
    const bitMask = 1n << BigInt(bitIndex);
    return (val ^ bitMask) & mask;
  }
}
