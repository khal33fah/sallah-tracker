import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  Plane, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  AlertCircle,
  Volume2,
  VolumeX,
  Compass
} from 'lucide-react';

interface TravelerSuspensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTimerComplete: () => void;
}

export const TravelerSuspensionModal: React.FC<TravelerSuspensionModalProps> = ({
  isOpen,
  onClose,
  onTimerComplete,
}) => {
  const TOTAL_SECONDS = 300; // Exactly 5 minutes (5 * 60)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(TOTAL_SECONDS);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play peaceful chime sound when the 5 minutes finish
  const playCompletionChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const now = ctx.currentTime;
      // Harmonious chord notes (C5, E5, G5, C6)
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        gain.gain.setValueAtTime(0.2, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 1.8);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(TOTAL_SECONDS);
      setIsFinished(false);
      return;
    }

    setSecondsRemaining(TOTAL_SECONDS);
    setIsFinished(false);

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          playCompletionChime();
          onTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const progressPercent = ((TOTAL_SECONDS - secondsRemaining) / TOTAL_SECONDS) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 via-slate-950 to-black pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Traveler Banner */}
      <div className="relative z-10 flex items-center justify-between border-b border-amber-900/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-amber-200">Traveler 5-Minute Suspension</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                Apps Locked
              </span>
            </div>
            <p className="text-xs text-slate-400">All phone apps suspended for 5 minutes during your journey</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs border border-slate-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Central Circular Countdown */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto w-full">
        {!isFinished ? (
          <>
            {/* Visual Circular Gauge */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="text-slate-800"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="text-amber-400 transition-all duration-1000 ease-linear"
                  strokeWidth="6"
                  strokeDasharray={276.46}
                  strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xs uppercase tracking-widest text-amber-300/80 font-semibold mb-1">
                  Releasing in
                </span>
                <span className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-tight">
                  {mins}:{secs.toString().padStart(2, '0')}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  5-Minute Salah Lock
                </span>
              </div>
            </div>

            {/* Traveler's Remembrance (Dua al-Safar) */}
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-2 text-left backdrop-blur-md w-full">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <Plane className="w-3.5 h-3.5" />
                <span>Dua al-Safar (Traveler's Supplication)</span>
              </div>
              <p className="text-lg font-arabic text-amber-100 text-right leading-relaxed">
                سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ
              </p>
              <p className="text-[11px] text-slate-400 italic">
                "Glory to Him who has brought this into our service, whereas we were unable to do so on our own. And surely to our Lord we are returning." (Quran 43:13-14)
              </p>
            </div>

            <p className="text-xs text-slate-400 max-w-sm">
              Take this 5-minute pause to disconnect from worldly devices, observe your shortened Salah, and reflect on the journey of life.
            </p>
          </>
        ) : (
          /* Auto-release Celebratory Screen */
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block">
              <CheckCircle2 className="w-16 h-16" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                5-Minute Suspension Complete!
              </h2>
              <p className="text-emerald-300 font-semibold text-sm">
                Phone & all apps have been automatically released.
              </p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                May Allah preserve you throughout your journey, accept your prayer, and grant you a safe return.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all"
            >
              Return to App
            </button>
          </div>
        )}
      </div>

      {/* Bottom Information */}
      <div className="relative z-10 text-center text-xs text-slate-500 pt-3 border-t border-slate-900">
        {!isFinished && "Apps will automatically unlock when timer reaches 00:00."}
      </div>
    </div>
  );
};
