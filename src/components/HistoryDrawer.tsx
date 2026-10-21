/**
 * DSTGH SCIENTIFIC CALCULATOR - History Drawer Component
 * Browse past calculations, recall expressions/results, and trigger Study Explanations
 */

import React from 'react';
import { X, Trash2, ArrowUpRight, GraduationCap, Clock } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectExpression: (expr: string) => void;
  onSelectResult: (res: string) => void;
  onExplainItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectExpression,
  onSelectResult,
  onExplainItem,
  onClearHistory,
  onDeleteItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-blue-900/40 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-[#082765] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-300" />
            <div>
              <h2 className="font-bold text-base tracking-wide">Calculation History</h2>
              <span className="text-[11px] text-blue-300">
                {history.length} {history.length === 1 ? 'entry' : 'entries'} stored
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                title="Clear All History"
                className="p-1.5 rounded-lg hover:bg-white/10 text-rose-300 hover:text-rose-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
              <Clock className="w-10 h-10 opacity-40" />
              <p className="text-sm font-medium">No calculation history yet</p>
              <p className="text-xs text-slate-400 text-center max-w-xs">
                Your evaluated expressions will appear here automatically.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col gap-2 hover:border-blue-300 transition-colors group"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Expression */}
                <div
                  onClick={() => {
                    onSelectExpression(item.expression);
                    onClose();
                  }}
                  className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 cursor-pointer truncate"
                  title="Click to load expression"
                >
                  {item.expression}
                </div>

                {/* Result */}
                <div className="flex items-baseline justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/50">
                  <button
                    onClick={() => {
                      onExplainItem(item);
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Explain</span>
                  </button>

                  <div
                    onClick={() => {
                      onSelectResult(item.result);
                      onClose();
                    }}
                    className="font-mono text-base font-black text-blue-900 dark:text-blue-300 hover:text-blue-600 cursor-pointer flex items-center gap-1"
                    title="Click to insert result"
                  >
                    <span>= {item.fractionResult || item.result}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
