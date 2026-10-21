/**
 * DSTGH SCIENTIFIC CALCULATOR - Base-N Modal (BASE-N)
 * Live DEC / BIN / OCT / HEX Converter & Full Bitwise Logic Calculator
 * Features:
 * - Word length: BYTE (8-bit), WORD (16-bit), DWORD (32-bit), QWORD (64-bit)
 * - Signed vs Unsigned representations
 * - Complete Bitwise Ops: AND, OR, XOR, NOT, NAND, NOR, XNOR
 * - Bit Shifts & Rotates: SHL, SHR, SAR, ROL, ROR
 * - Interactive 32/64-bit bitfield toggler
 * - Dynamic Base Keypad (Hex A-F, Oct 0-7, Bin 0-1)
 */

import React, { useState } from 'react';
import { X, Binary, ArrowRight, CornerDownLeft, Sparkles, Hash } from 'lucide-react';
import { BaseNEngine, BaseType, WordSize, BitwiseOperator } from '../math/baseN';

interface BaseNModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToCalculator?: (val: string) => void;
}

export const BaseNModal: React.FC<BaseNModalProps> = ({
  isOpen,
  onClose,
  onInsertToCalculator,
}) => {
  const [activeBase, setActiveBase] = useState<BaseType>('DEC');
  const [wordSize, setWordSize] = useState<WordSize>(32);
  const [isSigned, setIsSigned] = useState(false);
  const [inputVal, setInputVal] = useState('255');

  // Bitwise operation states
  const [bitwiseOp, setBitwiseOp] = useState<BitwiseOperator>('AND');
  const [secondVal, setSecondVal] = useState('15');
  const [bitwiseResult, setBitwiseResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  let conversions = {
    DEC: '0',
    BIN: '0',
    OCT: '0',
    HEX: '0',
    signedDec: '0',
    popcount: 0,
    leadingZeros: 0,
    parity: 'even' as 'even' | 'odd',
    bitString: '0'.repeat(wordSize),
  };

  try {
    conversions = BaseNEngine.convertAll(inputVal, activeBase, wordSize);
  } catch (e: unknown) {
    // Keep last or defaults on input typo
  }

  const handleComputeBitwise = () => {
    setErrorMsg(null);
    try {
      const res = BaseNEngine.bitwiseOp(
        inputVal,
        secondVal,
        bitwiseOp,
        activeBase,
        wordSize
      );
      setBitwiseResult(res);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Bitwise operation error');
    }
  };

  const handleBitToggle = (bitIdx: number) => {
    try {
      const dec = BaseNEngine.parseToDecimal(inputVal, activeBase, wordSize);
      const toggled = BaseNEngine.toggleBit(dec, bitIdx, wordSize);
      const formatted = BaseNEngine.formatFromDecimal(toggled, activeBase, wordSize, isSigned);
      setInputVal(formatted);
    } catch {
      // ignore
    }
  };

  // Base keypad inputs
  const handleKeypadPress = (char: string) => {
    setInputVal((prev) => {
      if (prev === '0' && char !== '.') return char;
      return prev + char;
    });
  };

  const handleBackspace = () => {
    setInputVal((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const isCharValidForBase = (char: string, base: BaseType): boolean => {
    if (base === 'BIN') return ['0', '1'].includes(char);
    if (base === 'OCT') return ['0', '1', '2', '3', '4', '5', '6', '7'].includes(char);
    if (base === 'DEC') return /^[0-9]$/.test(char);
    if (base === 'HEX') return /^[0-9A-F]$/i.test(char);
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-900/40 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#082765] text-white flex items-center justify-between rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2">
            <Binary className="w-5 h-5 text-blue-300" />
            <div>
              <h2 className="font-bold text-base sm:text-lg tracking-wide">
                DSTGH Base-N & Bit Operations (BASE-N)
              </h2>
              <p className="text-[11px] text-blue-200">
                Binary • Octal • Decimal • Hexadecimal • Bitwise Logic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          {/* Controls Bar: Base Selector, Word Size, Signed/Unsigned */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            {/* Base Selector */}
            <div className="flex gap-1">
              {(['DEC', 'HEX', 'OCT', 'BIN'] as BaseType[]).map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    // Convert current value to the new active base
                    try {
                      const dec = BaseNEngine.parseToDecimal(inputVal, activeBase, wordSize);
                      const next = BaseNEngine.formatFromDecimal(dec, b, wordSize, isSigned);
                      setInputVal(next);
                    } catch {
                      // ignore
                    }
                    setActiveBase(b);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeBase === b
                      ? 'bg-[#123EA8] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Word Size Selector */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">Size:</span>
              {([8, 16, 32, 64] as WordSize[]).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setWordSize(sz)}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${
                    wordSize === sz
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {sz}-bit
                </button>
              ))}
            </div>

            {/* Signed / Unsigned Toggle */}
            <button
              onClick={() => setIsSigned((prev) => !prev)}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                isSigned
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              {isSigned ? 'Signed (2s C)' : 'Unsigned'}
            </button>
          </div>

          {/* Primary Input with Clear/Backspace */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Current {activeBase} Value ({wordSize}-bit):
              </label>
              <div className="flex gap-2 text-[11px] font-bold text-slate-500">
                <span>Popcount: <strong className="text-blue-600 dark:text-blue-400">{conversions.popcount}</strong></span>
                <span>•</span>
                <span>Parity: <strong className="text-emerald-600 dark:text-emerald-400">{conversions.parity.toUpperCase()}</strong></span>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-base sm:text-lg tracking-wide focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                placeholder={`Enter ${activeBase} value...`}
              />
              <button
                onClick={handleBackspace}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                ⌫ DEL
              </button>
              <button
                onClick={() => setInputVal('0')}
                className="px-3 py-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-200"
              >
                CLR
              </button>
            </div>
          </div>

          {/* 4-Base Live Conversion Multi-Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-blue-900 dark:text-blue-300">DEC (Decimal)</span>
                {isSigned && (
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                    Signed: {conversions.signedDec}
                  </span>
                )}
              </div>
              <div className="font-extrabold text-base text-slate-900 dark:text-white break-all select-all">
                {conversions.DEC}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-1">
                HEX (Hexadecimal)
              </span>
              <div className="font-extrabold text-base text-slate-900 dark:text-white break-all select-all">
                0x{conversions.HEX}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20">
              <span className="font-bold text-purple-900 dark:text-purple-300 block mb-1">
                OCT (Octal)
              </span>
              <div className="font-extrabold text-base text-slate-900 dark:text-white break-all select-all">
                0o{conversions.OCT}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20">
              <span className="font-bold text-amber-900 dark:text-amber-300 block mb-1">
                BIN (Binary)
              </span>
              <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white break-all tracking-wider select-all">
                0b{conversions.BIN}
              </div>
            </div>
          </div>

          {/* Interactive Bit Toggler (Bits 31 to 0 or 15 to 0 or 7 to 0) */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Interactive Bitfield (Click bit to toggle):
              </span>
              <span className="text-[10px] text-slate-500 font-mono">MSB ➔ LSB</span>
            </div>

            {/* Display nibble groups */}
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: Math.min(32, wordSize) / 4 }).map((_, nibbleIdx) => {
                const totalBits = Math.min(32, wordSize);
                const startBit = totalBits - 1 - nibbleIdx * 4;
                const nibbleBits = [startBit, startBit - 1, startBit - 2, startBit - 3];

                return (
                  <div
                    key={nibbleIdx}
                    className="p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col items-center shadow-xs"
                  >
                    <span className="text-[9px] text-slate-400 font-mono font-bold mb-0.5">
                      {startBit}:{startBit - 3}
                    </span>
                    <div className="flex gap-1">
                      {nibbleBits.map((b) => {
                        // bit string is LSB at right, so index in bitString is (totalBits - 1 - b)
                        const bitVal = conversions.bitString[conversions.bitString.length - 1 - b] || '0';
                        return (
                          <button
                            key={b}
                            onClick={() => handleBitToggle(b)}
                            title={`Toggle Bit ${b}`}
                            className={`w-6 h-7 rounded text-xs font-mono font-bold transition-colors ${
                              bitVal === '1'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {bitVal}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Dynamic Base Keypad */}
          <div className="grid grid-cols-8 sm:grid-cols-8 gap-1 p-2 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
            {['A', 'B', 'C', 'D', 'E', 'F', '7', '8', '9', '4', '5', '6', '1', '2', '3', '0'].map(
              (char) => {
                const isValid = isCharValidForBase(char, activeBase);
                return (
                  <button
                    key={char}
                    disabled={!isValid}
                    onClick={() => handleKeypadPress(char)}
                    className={`py-2 rounded-lg font-mono font-bold text-xs sm:text-sm transition-all ${
                      isValid
                        ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-xs hover:bg-blue-50 active:scale-95'
                        : 'opacity-25 bg-transparent cursor-not-allowed text-slate-400'
                    }`}
                  >
                    {char}
                  </button>
                );
              }
            )}
          </div>

          {/* Bitwise Operations Sub-Panel */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Bitwise Logical & Shift Calculator:
            </span>

            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={bitwiseOp}
                onChange={(e) => setBitwiseOp(e.target.value as BitwiseOperator)}
                className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold bg-white dark:bg-slate-900"
              >
                <option value="AND">AND (&)</option>
                <option value="OR">OR (|)</option>
                <option value="XOR">XOR (^)</option>
                <option value="NOT">NOT (~)</option>
                <option value="NAND">NAND</option>
                <option value="NOR">NOR</option>
                <option value="XNOR">XNOR</option>
                <option value="SHL">Shift Left (&lt;&lt;)</option>
                <option value="SHR">Logical Shift Right (&gt;&gt;&gt;)</option>
                <option value="SAR">Arithmetic Shift Right (&gt;&gt;)</option>
                <option value="ROL">Rotate Left (ROL)</option>
                <option value="ROR">Rotate Right (ROR)</option>
              </select>

              {bitwiseOp !== 'NOT' && (
                <input
                  type="text"
                  value={secondVal}
                  onChange={(e) => setSecondVal(e.target.value)}
                  placeholder={`Operand 2 (${activeBase})`}
                  className="flex-1 min-w-[120px] p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold bg-white dark:bg-slate-900"
                />
              )}

              <button
                onClick={handleComputeBitwise}
                className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                Compute
              </button>
            </div>

            {errorMsg && (
              <div className="text-xs font-bold text-rose-600">{errorMsg}</div>
            )}

            {bitwiseResult !== null && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Operation Result ({activeBase}):
                  </span>
                  <div className="font-mono font-black text-emerald-800 dark:text-emerald-300 text-base">
                    {bitwiseResult}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setInputVal(bitwiseResult);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
                  >
                    Set as Input
                  </button>

                  {onInsertToCalculator && (
                    <button
                      onClick={() => {
                        onInsertToCalculator(bitwiseResult);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      Insert into Calc
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
