/**
 * DSTGH Scientific Calculator - Persistent Local Storage Manager
 */

import { CalculatorSettings, HistoryItem, MemoryBank } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'dstgh_settings_v1',
  HISTORY: 'dstgh_history_v1',
  MEMORY: 'dstgh_memory_v1',
};

const DEFAULT_SETTINGS: CalculatorSettings = {
  theme: 'light',
  angleMode: 'DEG',
  decimalPrecision: 10,
  numberFormat: 'NORM',
  soundEnabled: true,
  hapticEnabled: true,
  studyModeEnabled: false,
};

const DEFAULT_MEMORY: MemoryBank = {
  A: 0,
  B: 0,
  C: 0,
  D: 0,
  X: 0,
  Y: 0,
  M: 0,
  Ans: 0,
};

export class StorageManager {
  static getSettings(): CalculatorSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch {}
    return DEFAULT_SETTINGS;
  }

  static saveSettings(settings: CalculatorSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {}
  }

  static getHistory(): HistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return [];
  }

  static saveHistory(history: HistoryItem[]) {
    try {
      // Keep up to 100 recent entries
      const capped = history.slice(0, 100);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(capped));
    } catch {}
  }

  static getMemory(): MemoryBank {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMORY);
      if (data) {
        return { ...DEFAULT_MEMORY, ...JSON.parse(data) };
      }
    } catch {}
    return DEFAULT_MEMORY;
  }

  static saveMemory(memory: MemoryBank) {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMORY, JSON.stringify(memory));
    } catch {}
  }

  static resetAll() {
    try {
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      localStorage.removeItem(STORAGE_KEYS.MEMORY);
    } catch {}
  }
}
