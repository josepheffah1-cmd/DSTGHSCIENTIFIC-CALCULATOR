/**
 * DSTGH SCIENTIFIC CALCULATOR - Formula Library Modal
 * Searchable formulas across 10 academic categories with direct calculator insertion
 */

import React, { useState } from 'react';
import { X, Search, BookOpen, ArrowRight, Copy, Check } from 'lucide-react';
import { FORMULA_LIBRARY } from '../math/formulas';
import { FormulaItem } from '../types';

interface FormulaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToCalculator: (expr: string) => void;
}

export const FormulaLibraryModal: React.FC<FormulaLibraryModalProps> = ({
  isOpen,
  onClose,
  onInsertToCalculator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(FORMULA_LIBRARY.map((f) => f.category)))];

  const filteredFormulas = FORMULA_LIBRARY.filter((f) => {
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-900/40 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#082765] text-white flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-300" />
            <div>
              <h2 className="font-bold text-lg tracking-wide">DSTGH Formula Library</h2>
              <p className="text-[11px] text-blue-200">
                Over 20+ academic formulas ready to calculate
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

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulas by name, variable, or concept..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Formula Cards */}
          <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-1">
            {filteredFormulas.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm font-medium">
                No formulas matched your search.
              </div>
            ) : (
              filteredFormulas.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-blue-300 transition-colors flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(item.id, item.formula)}
                        title="Copy formula text"
                        className="p-1.5 rounded-lg border hover:bg-white dark:hover:bg-slate-700 text-slate-500 transition-colors"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          onInsertToCalculator(item.expressionToInsert);
                          onClose();
                        }}
                        className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                      >
                        <span>Insert</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border font-mono font-bold text-blue-900 dark:text-blue-300 text-sm">
                    {item.formula}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
