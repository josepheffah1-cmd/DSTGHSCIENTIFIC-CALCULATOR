/**
 * DSTGH SCIENTIFIC CALCULATOR - Unit Converter Modal (CONV)
 * 14 Academic and Industrial Categories with Instant Reactive Conversion
 */

import React, { useState } from 'react';
import { X, ArrowRightLeft, Ruler } from 'lucide-react';
import { UNIT_CATEGORIES, convertUnit } from '../math/converter';
import { UnitCategory } from '../types';

interface UnitConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToCalculator?: (val: string) => void;
}

export const UnitConverterModal: React.FC<UnitConverterModalProps> = ({
  isOpen,
  onClose,
  onInsertToCalculator,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>('length');
  const [fromUnitId, setFromUnitId] = useState<string>('m');
  const [toUnitId, setToUnitId] = useState<string>('km');
  const [fromValue, setFromValue] = useState<string>('1000');

  if (!isOpen) return null;

  const currentCategory = UNIT_CATEGORIES.find((c) => c.id === selectedCatId) || UNIT_CATEGORIES[0];

  const handleCategoryChange = (cat: UnitCategory) => {
    setSelectedCatId(cat.id);
    setFromUnitId(cat.units[0].id);
    setToUnitId(cat.units[1]?.id || cat.units[0].id);
  };

  const handleSwap = () => {
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  };

  const num = parseFloat(fromValue) || 0;
  const converted = convertUnit(num, currentCategory, fromUnitId, toUnitId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-900/40 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#082765] text-white flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-blue-300" />
            <h2 className="font-bold text-lg tracking-wide">DSTGH Unit Converter (CONV)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Categories Grid */}
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {UNIT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat)}
                className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCatId === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Interactive Conversion Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col gap-3">
            {/* From Input */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 mb-1 block">From:</label>
                <input
                  type="number"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-white dark:bg-slate-900 font-mono font-bold text-base"
                />
              </div>
              <div className="w-36">
                <label className="text-xs font-bold text-slate-500 mb-1 block">Unit:</label>
                <select
                  value={fromUnitId}
                  onChange={(e) => setFromUnitId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs font-bold truncate"
                >
                  {currentCategory.units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center my-0.5">
              <button
                onClick={handleSwap}
                className="p-1.5 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-100 text-blue-600 dark:text-blue-400 shadow-sm"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* To Display */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 mb-1 block">Converted To:</label>
                <div className="w-full p-2.5 rounded-xl border bg-white dark:bg-slate-900 font-mono font-black text-emerald-800 dark:text-emerald-300 text-base truncate">
                  {isNaN(converted) ? 'Error' : parseFloat(converted.toFixed(8))}
                </div>
              </div>
              <div className="w-36">
                <label className="text-xs font-bold text-slate-500 mb-1 block">Target Unit:</label>
                <select
                  value={toUnitId}
                  onChange={(e) => setToUnitId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-white dark:bg-slate-900 text-xs font-bold truncate"
                >
                  {currentCategory.units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action to insert to calculator */}
          {onInsertToCalculator && !isNaN(converted) && (
            <button
              onClick={() => {
                onInsertToCalculator(converted.toString());
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide shadow-md transition-all active:scale-[0.98]"
            >
              Insert Converted Value into Calculator
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
