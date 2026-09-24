import React, { useState } from 'react';
import { Download, X, Share, PlusSquare, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isDismissed, install, dismiss } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already installed or dismissed by user, do not display
  if (isInstalled || isDismissed) {
    return null;
  }

  // Only display if install prompt is available or if iOS device
  if (!isInstallable && !isIOS) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <aside
        aria-label="Install HAKKIVEDA App"
        className="fixed bottom-[max(72px,calc(env(safe-area-inset-bottom)+70px))] left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-[#0A2E1F]/95 backdrop-blur-md border border-[#D4AF37]/40 shadow-2xl rounded-2xl p-3.5 text-white transition-all animate-fadeIn"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#0E3B2E] border border-[#D4AF37]/50 flex items-center justify-center p-1.5 shadow-inner shrink-0">
            <img src="/pwa-192x192.png" alt="HAKKIVEDA" className="w-full h-full object-contain rounded-lg" />
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-serif font-bold text-[#D4AF37] tracking-wider uppercase">HAKKIVEDA App</span>
              <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.2 rounded font-semibold">Official</span>
            </div>
            <p className="text-[11px] text-slate-200 line-clamp-1 leading-tight mt-0.5">
              Install for instant access & tribal rituals
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-gradient-to-r from-[#D4AF37] to-[#AA8222] text-[#082214] hover:brightness-110 active:scale-95 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide shadow-md transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>

            <button
              onClick={dismiss}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Dismiss install banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* iOS Safari Guided Instructions Modal */}
      {showIOSModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="w-full max-w-sm bg-[#0A2E1F] border border-[#D4AF37]/40 rounded-2xl p-6 text-white shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-base font-serif font-bold text-[#D4AF37]">Install HAKKIVEDA on iPhone</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Install HAKKIVEDA directly to your Home Screen for full-screen tribal rituals and faster ordering:
            </p>

            <div className="space-y-3 bg-[#082214] p-3.5 rounded-xl border border-white/10 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div className="flex items-center gap-1.5 text-slate-200">
                  <span>Tap the</span>
                  <Share className="w-4 h-4 text-[#D4AF37] inline" />
                  <strong>Share</strong>
                  <span>button in Safari's toolbar.</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div className="flex items-center gap-1.5 text-slate-200">
                  <span>Scroll down and select</span>
                  <PlusSquare className="w-4 h-4 text-[#D4AF37] inline" />
                  <strong>Add to Home Screen</strong>.
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowIOSModal(false);
                dismiss();
              }}
              className="w-full bg-[#D4AF37] text-[#082214] py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:brightness-110 transition"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
