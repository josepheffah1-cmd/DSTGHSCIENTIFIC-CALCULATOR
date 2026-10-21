/**
 * DSTGH SCIENTIFIC CALCULATOR - Settings & Diagnostics Modal
 * Configuration for angle units, precision, tactile/audio feedback, memory inspector,
 * and brand specifications.
 */

import React from 'react';
import {
  X,
  Settings,
  Volume2,
  VolumeX,
  Vibrate,
  Moon,
  Sun,
  Laptop,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { CalculatorSettings, MemoryBank } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CalculatorSettings;
  onUpdateSettings: (newSettings: Partial<CalculatorSettings>) => void;
  memory: MemoryBank;
  onClearMemory: () => void;
  onLaunchSelfTest: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  memory,
  onClearMemory,
  onLaunchSelfTest,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-900/40 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#082765] text-white flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-300" />
            <div>
              <h2 className="font-bold text-base tracking-wide">Settings & Diagnostics</h2>
              <p className="text-[11px] text-blue-300">DSTGH-SC991 System Configuration</p>
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
        <div className="p-5 flex flex-col gap-5">
          {/* Angle Mode */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Default Angle Unit</span>
            <div className="flex gap-2">
              {(['DEG', 'RAD', 'GRAD'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onUpdateSettings({ angleMode: mode })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    settings.angleMode === mode
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {mode === 'DEG' ? 'Degrees (DEG)' : mode === 'RAD' ? 'Radians (RAD)' : 'Gradians (GRAD)'}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Color Theme</span>
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => onUpdateSettings({ theme })}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    settings.theme === theme
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {theme === 'light' ? <Sun className="w-3.5 h-3.5" /> : theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Laptop className="w-3.5 h-3.5" />}
                  <span className="capitalize">{theme}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Precision & Display Notation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Decimal Precision: {settings.decimalPrecision}
              </label>
              <input
                type="range"
                min={2}
                max={12}
                value={settings.decimalPrecision}
                onChange={(e) => onUpdateSettings({ decimalPrecision: parseInt(e.target.value, 10) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                Display Notation
              </label>
              <select
                value={settings.numberFormat}
                onChange={(e) => onUpdateSettings({ numberFormat: e.target.value as 'NORM' })}
                className="w-full p-1.5 rounded-lg border text-xs font-bold bg-white dark:bg-slate-800"
              >
                <option value="NORM">Normal (Norm)</option>
                <option value="SCI">Scientific (Sci)</option>
                <option value="ENG">Engineering (Eng)</option>
              </select>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
            {/* Sound Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Keypad Click Audio Feedback
                </span>
              </div>
              <button
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.soundEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.soundEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Haptic Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vibrate className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Tactile Haptic Vibration
                </span>
              </div>
              <button
                onClick={() => onUpdateSettings({ hapticEnabled: !settings.hapticEnabled })}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.hapticEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.hapticEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Study Mode Default Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Enable Study Mode Explanations
                </span>
              </div>
              <button
                onClick={() => onUpdateSettings({ studyModeEnabled: !settings.studyModeEnabled })}
                className={`w-11 h-6 rounded-full transition-colors relative ${settings.studyModeEnabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.studyModeEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Memory Bank State Inspector */}
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Active Variable Memory Bank
              </span>
              <button
                onClick={onClearMemory}
                className="text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Reset All Variables
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 font-mono text-xs">
              {Object.entries(memory).map(([key, val]) => (
                <div key={key} className="p-1.5 rounded bg-white dark:bg-slate-900 border text-center">
                  <span className="text-blue-600 font-bold block">{key}</span>
                  <span className="text-slate-800 dark:text-slate-300 font-extrabold truncate block">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Self-Test Validation Launcher */}
          <button
            onClick={() => {
              onLaunchSelfTest();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl border-2 border-dashed border-blue-500/60 hover:border-blue-600 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            Run Comprehensive Mathematical Self-Test Suite (25+ Tests)
          </button>

          {/* Official Brand Specifications & Portal Access */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex flex-col gap-2">
            <div className="font-bold text-blue-900 dark:text-blue-300 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm">
                <Info className="w-4 h-4 text-blue-600" />
                <span>DSTGH SCIENTIFIC CALCULATOR</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600/20 text-blue-700 dark:text-blue-300">
                DSTGH-SC991
              </span>
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                Digital Solution Tech Ghana (DSTGH)
              </p>
              <p className="italic text-slate-500">"Your Smart Partner for Study"</p>
            </div>
            <div className="pt-2 border-t border-blue-200 dark:border-slate-700 text-[11px] space-y-1">
              <p>• <strong>WhatsApp:</strong> <a href="https://wa.me/233593657098" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">+233 59 365 7098</a></p>
              <p>• <strong>Email:</strong> <a href="mailto:dstgh17@gmail.com" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">dstgh17@gmail.com</a></p>
              <p>• <strong>MTN MOMO:</strong> 0593657098 (Joseph Effah)</p>
              <p>• <strong>Selar Payment:</strong> <a href="https://selar.com/showlove/dstgh?currency=GHS" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">selar.com/showlove/dstgh</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
