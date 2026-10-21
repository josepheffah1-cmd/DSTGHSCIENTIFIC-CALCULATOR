/**
 * DSTGH - Digital Solution Tech Ghana
 * Professional Social Media, URL Copy & SMS Sharing Modal
 * Displays Web App UI Image Card for professional sharing across:
 * WhatsApp, Twitter/X, Facebook, Telegram, SMS/Text Message & Short Code
 */

import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  MessageSquare,
  Twitter,
  Facebook,
  Mail,
  ExternalLink,
  Sparkles,
  Smartphone,
  Globe,
  QrCode,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedShort, setCopiedShort] = useState(false);

  if (!isOpen) return null;

  const APP_URL = 'https://dstgh-scientific-calculator.ai.studio';
  const UI_IMAGE_SRC = '/src/assets/images/dstgh_calc_ui_card_1792557031664.jpg';

  const shareTitle = 'DSTGH Scientific Calculator | Digital Solution Tech Ghana';
  const shareDescription =
    'Professional 417+ function scientific calculator (DSTGH-SC991) with natural textbook display, calculus, matrices, vectors, base-N, equations & Study Mode.';

  const fullShareMessage = `📐 DSTGH Scientific Calculator (DSTGH-SC991)
By Digital Solution Tech Ghana

✨ 417+ Advanced Functions:
• Natural Textbook Display (Fractions, Roots, Exponents)
• Matrices (2x2, 3x3 Determinants, Inverses, Eigenvalues)
• 2D/3D Vectors & Cross Products
• Numerical Derivatives & Definite Integrals
• Quadratic, Cubic & Simultaneous Equation Solver
• Base-N Logic (DEC/HEX/OCT/BIN) & Unit Converters
• Interactive Educational Study Mode

🔗 Access the portal & app now:
${APP_URL}

📞 Support / Admin: WhatsApp +233 59 365 7098 | Email: dstgh17@gmail.com`;

  const shortSmsMessage = `DSTGH Scientific Calculator (DSTGH-SC991): 417+ Functions, Matrices, Calculus, Vectors & Natural Display. Use online: ${APP_URL} | Portal/MOMO: 0593657098`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(APP_URL);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleCopyFullText = async () => {
    try {
      await navigator.clipboard.writeText(fullShareMessage);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleCopyShortSms = async () => {
    try {
      await navigator.clipboard.writeText(shortSmsMessage);
      setCopiedShort(true);
      setTimeout(() => setCopiedShort(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: APP_URL,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopyUrl();
    }
  };

  // Social URLs
  const encodedUrl = encodeURIComponent(APP_URL);
  const encodedText = encodeURIComponent(fullShareMessage);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    'Check out the DSTGH Scientific Calculator (Digital Solution Tech Ghana - DSTGH-SC991) with 417+ advanced math functions!'
  )}&url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(
    'DSTGH Scientific Calculator (Digital Solution Tech Ghana)'
  )}`;
  const smsUrl = `sms:?body=${encodeURIComponent(shortSmsMessage)}`;
  const mailUrl = `mailto:?subject=${encodeURIComponent(
    'DSTGH Scientific Calculator - Digital Solution Tech Ghana'
  )}&body=${encodeURIComponent(fullShareMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-blue-900/50 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#082765] text-white flex items-center justify-between rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-blue-300" />
            <div>
              <h2 className="font-bold text-base sm:text-lg tracking-wide">
                Share DSTGH Calculator
              </h2>
              <p className="text-[11px] text-blue-200">
                Digital Solution Tech Ghana • Professional Social Link Sharing
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
        <div className="p-4 sm:p-6 flex flex-col gap-5">
          {/* Web App UI Preview Card */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-950 flex flex-col">
            <div className="relative group">
              <img
                src={UI_IMAGE_SRC}
                alt="DSTGH Scientific Calculator Web App UI Preview - Digital Solution Tech Ghana"
                className="w-full h-auto object-cover max-h-56 sm:max-h-64"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 border border-white/20">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Rich Social Preview Card</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900 text-white flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-400">
                  Digital Solution Tech Ghana • DSTGH-SC991
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  417+ Functions
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-100">
                DSTGH Scientific Calculator
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                {shareDescription}
              </p>
            </div>
          </div>

          {/* Primary URL Copy Bar */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Official Web App Share Link:</span>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">
                Canonical URL
              </span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs font-bold text-blue-700 dark:text-blue-300 truncate select-all">
                {APP_URL}
              </div>
              <button
                onClick={handleCopyUrl}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                {copiedUrl ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedUrl ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* 1-Click Social Media Platforms */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Share Directly Across Social Media & Platforms:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              {/* SMS / Text Message */}
              <a
                href={smsUrl}
                className="p-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                <span>SMS / Text</span>
              </a>

              {/* X / Twitter */}
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Twitter className="w-4 h-4" />
                <span>X / Twitter</span>
              </a>

              {/* Facebook */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook</span>
              </a>

              {/* Telegram */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Telegram</span>
              </a>

              {/* Email */}
              <a
                href={mailUrl}
                className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Quick SMS & Short Code Snippets */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Short Code & Text Message Template (Ghana & Global Mobile):
              </span>
              <button
                onClick={handleCopyShortSms}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {copiedShort ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedShort ? 'Copied' : 'Copy SMS'}</span>
              </button>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs font-mono text-slate-700 dark:text-slate-300 select-all">
              {shortSmsMessage}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleCopyFullText}
                className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5"
              >
                {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText ? 'Full Message Copied' : 'Copy Full WhatsApp/Social Broadcast'}</span>
              </button>

              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Device Share</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
