import React, { useState } from 'react';
import { Download, Smartphone, Share2, PlusSquare, Check, X, Globe, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // If already running in standalone native mode, show installed status or hide based on variant
  if (isInstalled) {
    if (variant === 'banner') return null;
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold ${className}`}>
        <Check className="w-3.5 h-3.5" />
        <span>Installed App</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (isInstallable) {
      const success = await install();
      if (success) {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 4000);
      }
    } else {
      // Fallback for browsers that don't trigger beforeinstallprompt (e.g. desktop Firefox or already prompted)
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {variant === 'banner' ? (
        <div className={`p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-lg relative overflow-hidden ${className}`}>
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-100">Use as a Normal Phone App</h4>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">PWA</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Install onto your home screen for full-screen camera scanning, lock screen reminders, and offline prayer times.
                </p>
              </div>
            </div>

            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Install to Device</span>
            </button>
          </div>
        </div>
      ) : variant === 'full' ? (
        <button
          onClick={handleInstallClick}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer ${className}`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Install App to Home Screen</span>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all active:scale-95 cursor-pointer ${className}`}
          title="Install app to your device"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      )}

      {/* iOS & Browser Step-by-Step Install Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Install as Normal App</h3>
                <p className="text-xs text-slate-400">Add to your device home screen</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              You can run Salah Tracker directly from your phone or tablet just like an app downloaded from an app store — with no browser address bar, instant startup, and full camera support.
            </p>

            <div className="space-y-3.5 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-xs text-slate-200">
                  {isIOS ? (
                    <span>
                      In Safari, tap the <strong className="text-emerald-300">Share</strong> icon <Share2 className="w-3.5 h-3.5 inline mx-1 text-emerald-400" /> at the bottom or top of your screen.
                    </span>
                  ) : (
                    <span>
                      In Chrome, Edge, or your browser menu, tap the <strong>three dots</strong> (<strong className="text-emerald-300">⋮</strong>) at the top right.
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs text-slate-200">
                  {isIOS ? (
                    <span>
                      Scroll down the share sheet and tap <strong className="text-emerald-300">Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" />.
                    </span>
                  ) : (
                    <span>
                      Select <strong className="text-emerald-300">Install App</strong> or <strong className="text-emerald-300">Add to Home Screen</strong>.
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div className="text-xs text-slate-200">
                  Tap <strong className="text-emerald-300">Add</strong> or confirm installation. The app icon will appear on your phone home screen!
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-slate-950 font-bold text-xs shadow-2xl animate-in slide-in-from-bottom duration-300">
          <Check className="w-4 h-4" />
          <span>Salah Tracker added to your device successfully!</span>
        </div>
      )}
    </>
  );
};
