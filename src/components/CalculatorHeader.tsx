/**
 * DSTGH SCIENTIFIC CALCULATOR - Header Component
 * Brand: DSTGH | Model: DSTGH-SC991 | Tagline: "Your Smart Partner for Study"
 */

import React from 'react';
import {
  History,
  Settings,
  BookOpen,
  GraduationCap,
  Layers,
  HelpCircle,
  Sparkles,
  Shield,
  Share2,
} from 'lucide-react';
import { ActiveNavTab } from '../types';

interface CalculatorHeaderProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  studyModeActive: boolean;
  onToggleStudyMode: () => void;
  historyCount: number;
}

export const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({
  activeTab,
  onSelectTab,
  studyModeActive,
  onToggleStudyMode,
  historyCount,
}) => {
  return (
    <header className="w-full bg-[#082765] text-white border-b border-blue-900/60 select-none">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
        {/* Brand identity badge */}
        <div
          onClick={() => onSelectTab('calculator')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          id="dstgh-brand-badge"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center font-black text-white text-base tracking-wider shadow-md border border-blue-400/40 group-hover:scale-105 transition-transform shrink-0">
            D
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-black tracking-widest text-base sm:text-lg text-white">
                DSTGH
              </span>
              <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-600/50 text-blue-200 border border-blue-400/30">
                SC991
              </span>
              <span className="hidden md:inline-block text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-400/30">
                417+ FUNCTIONS
              </span>
            </div>
            <p className="text-[10px] text-blue-200/90 font-semibold tracking-wide truncate">
              Digital Solution Tech Ghana • <span className="text-blue-300/80 font-normal">"Your Smart Partner for Study"</span>
            </p>
          </div>
        </div>

        {/* Action icons & Mode selectors */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Admin & Servers / Payment Portal */}
          <button
            onClick={() => onSelectTab(activeTab === 'admin' ? 'calculator' : 'admin')}
            id="admin-servers-portal-btn"
            title="Administration, Servers & Payment Portal (MOMO & Selar)"
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              activeTab === 'admin'
                ? 'bg-purple-600 text-white border-purple-400 shadow-sm shadow-purple-600/30'
                : 'bg-purple-950/60 text-purple-200 border-purple-700/80 hover:bg-purple-900 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Portal / Admin</span>
          </button>

          {/* Social / Link Share with UI Image */}
          <button
            onClick={() => onSelectTab(activeTab === 'share' ? 'calculator' : 'share')}
            id="share-app-btn"
            title="Share Web App Link (Social Media, SMS & Preview Card)"
            className={`p-2 rounded-lg text-xs font-semibold transition-colors border ${
              activeTab === 'share'
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-blue-900/50 text-blue-200 border-blue-700 hover:bg-blue-800 hover:text-white'
            }`}
          >
            <Share2 className="w-4 h-4 text-blue-300" />
          </button>

          {/* Study Mode Fast Toggle */}
          <button
            onClick={onToggleStudyMode}
            id="study-mode-toggle-btn"
            title="Toggle Educational Study Mode"
            className={`hidden xs:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              studyModeActive
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm shadow-amber-500/30'
                : 'bg-blue-900/50 text-blue-200 border-blue-700 hover:bg-blue-800 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Study Mode</span>
            {studyModeActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-ping" />
            )}
          </button>

          {/* Mode switch quick drawer */}
          <button
            onClick={() => onSelectTab(activeTab === 'formulas' ? 'calculator' : 'formulas')}
            id="mode-switch-btn"
            title="Formulas & Reference"
            className={`p-2 rounded-lg text-xs font-semibold transition-colors border ${
              activeTab === 'formulas'
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-blue-900/50 text-blue-200 border-blue-700 hover:bg-blue-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* History Icon */}
          <button
            onClick={() => onSelectTab(activeTab === 'history' ? 'calculator' : 'history')}
            id="history-drawer-btn"
            title="Calculation History"
            className={`relative p-2 rounded-lg text-xs font-semibold transition-colors border ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-blue-900/50 text-blue-200 border-blue-700 hover:bg-blue-800 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>

          {/* Settings Icon */}
          <button
            onClick={() => onSelectTab(activeTab === 'settings' ? 'calculator' : 'settings')}
            id="settings-modal-btn"
            title="Calculator Settings & Diagnostics"
            className={`p-2 rounded-lg text-xs font-semibold transition-colors border ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-blue-900/50 text-blue-200 border-blue-700 hover:bg-blue-800 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
