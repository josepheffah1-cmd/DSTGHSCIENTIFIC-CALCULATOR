/**
 * DSTGH SCIENTIFIC CALCULATOR - PWA Install & Offline Status Component
 */

import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, Wifi, WifiOff, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
  };

  if (dismissed || isInstalled || !installPrompt) {
    if (!isOnline) {
      return (
        <div className="bg-amber-600 text-white text-xs py-1 px-4 flex items-center justify-center gap-2 font-medium">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Mode Active - All 417+ DSTGH Functions work without internet</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="w-full bg-[#123EA8] text-white px-4 py-2 border-b border-blue-400/20 flex items-center justify-between text-xs font-semibold select-none shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-white text-blue-900 font-bold flex items-center justify-center text-[10px]">
          D
        </div>
        <span>Install DSTGH Calculator on your home screen for full offline access</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install PWA</span>
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-blue-200 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
