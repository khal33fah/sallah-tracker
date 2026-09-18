import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Lock, 
  AlertTriangle, 
  Sparkles, 
  RotateCcw, 
  ChevronRight,
  HeartHandshake,
  Clock
} from 'lucide-react';
import { PrayerName } from '../types';

interface PhoneSuspensionModeProps {
  prayerName: PrayerName;
  targetRakahs: number;
  isOpen: boolean;
  onExit: () => void;
  onCompleteSalah: () => void;
}

export const PhoneSuspensionMode: React.FC<PhoneSuspensionModeProps> = ({
  prayerName,
  targetRakahs,
  isOpen,
  onExit,
  onCompleteSalah,
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [currentRakah, setCurrentRakah] = useState<number>(1);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [ambientAudioActive, setAmbientAudioActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [adhkarStep, setAdhkarStep] = useState<number>(0);

  const wakeLockRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Request Wake Lock on mount to prevent phone screen from turning off during Salah
  useEffect(() => {
    if (!isOpen) return;

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {
        console.warn('Wake Lock request error:', err);
      }
    };

    requestWakeLock();

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [isOpen]);

  // Prayer session timer
  useEffect(() => {
    if (!isOpen || isCompleted) return;

    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isCompleted]);

  // Clean audio on close
  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [isOpen]);

  const toggleAudio = () => {
    if (ambientAudioActive) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setAmbientAudioActive(false);
    } else {
      // Stream tranquil recitation of Surah Al-Fatihah
      if (!audioRef.current) {
        audioRef.current = new Audio('https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3');
        audioRef.current.loop = true;
      }
      audioRef.current.play().catch(e => console.warn('Audio play error:', e));
      setAmbientAudioActive(true);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishSalah = () => {
    setIsCompleted(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const postAdhkarList = [
    {
      title: 'Istighfar (Seeking Forgiveness)',
      arabic: 'أَسْتَغْفِرُ اللَّهَ (٣ مَرَّاتٍ)',
      transliteration: 'Astaghfirullāh (3 times)',
      meaning: 'I seek the forgiveness of Allah for any shortcomings in my prayer.',
    },
    {
      title: 'Salam & Majesty',
      arabic: 'اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ',
      transliteration: 'Allāhumma Antas-Salām wa minkas-salām, tabārakta yā Dhal-Jalāli wal-Ikrām',
      meaning: 'O Allah, You are Peace and from You comes peace. Blessed are You, O Possessor of majesty and honor.',
    },
    {
      title: 'Tasbih Fatimah',
      arabic: 'سُبْحَانَ اللَّهِ (٣٣) • الْحَمْدُ لِلَّهِ (٣٣) • اللَّهُ أَكْبَرُ (٣٤)',
      transliteration: 'SubḥānAllāh (33x), Al-ḥamdulillāh (33x), Allāhu Akbar (34x)',
      meaning: 'Glory be to Allah, Praise be to Allah, Allah is the Greatest.',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Background Sanctuary Gradient & Subtle Islamic Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-950 to-black pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500/5 font-arabic text-[180px] pointer-events-none select-none">
        اللهُ أَكْبَرُ
      </div>

      {/* Top Status & Distraction Lockdown Indicator */}
      <div className="relative z-10 p-6 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-amber-200">Phone Suspended • DND Active</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Focus Sanctuary
              </span>
            </div>
            <p className="text-xs text-slate-400">All notifications & interruptions are suspended for {prayerName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Ambient Recitation Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              ambientAudioActive 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle peaceful Quran recitation"
          >
            {ambientAudioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{ambientAudioActive ? 'Recitation On' : 'Silent Focus'}</span>
          </button>

          {/* Exit Protection Button */}
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs"
            title="Exit prayer session"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Main Focus Canvas */}
      {!isCompleted ? (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 max-w-lg mx-auto w-full">
          {/* Prayer Identity & Arabic Calligraphy */}
          <div className="space-y-2">
            <div className="text-emerald-400 font-arabic text-4xl sm:text-5xl tracking-wide">
              صَلَاةُ {prayerName === 'Fajr' ? 'الفَجْر' : prayerName === 'Dhuhr' ? 'الظُّهْر' : prayerName === 'Asr' ? 'العَصْر' : prayerName === 'Maghrib' ? 'المَغْرِب' : 'العِشَاء'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Observing {prayerName} Prayer
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Stand with reverence (Khushoo'). Cast away worldly matters and connect with Allah.
            </p>
          </div>

          {/* Session Timer Display */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-2xl backdrop-blur-md w-full">
            <div className="text-xs uppercase tracking-widest text-slate-400 mb-1 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Salah Duration</span>
            </div>
            <div className="text-4xl sm:text-5xl font-mono font-bold text-emerald-400">
              {formatTimer(secondsElapsed)}
            </div>
          </div>

          {/* Rak'ah Tracker Assistant */}
          <div className="w-full bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Rak'ah Tracker:</span>
              <span className="text-emerald-300 font-semibold font-mono">
                Rak'ah {currentRakah} of {targetRakahs}
              </span>
            </div>

            {/* Visual Rak'ah Dots */}
            <div className="flex items-center justify-center gap-3">
              {Array.from({ length: targetRakahs }).map((_, index) => {
                const num = index + 1;
                const isCurrent = num === currentRakah;
                const isPast = num < currentRakah;

                return (
                  <button
                    key={num}
                    onClick={() => setCurrentRakah(num)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                      isPast 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : isCurrent 
                        ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200 ring-4 ring-emerald-500/10 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                onClick={() => setCurrentRakah(prev => Math.max(1, prev - 1))}
                disabled={currentRakah <= 1}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs disabled:opacity-40"
              >
                Previous Rak'ah
              </button>

              <button
                onClick={() => setCurrentRakah(prev => Math.min(targetRakahs, prev + 1))}
                disabled={currentRakah >= targetRakahs}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/30 text-xs font-medium disabled:opacity-40"
              >
                Advance Rak'ah
              </button>
            </div>
          </div>

          {/* Spiritual Reflection Ayah */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/40 text-xs text-slate-300 italic">
            "Indeed, those who believe and do righteous deeds and establish prayer will have their reward with their Lord, and there will be no fear concerning them, nor will they grieve." (Quran 2:277)
          </div>
        </div>
      ) : (
        /* Post-Prayer Adhkar & Congratulation Screen */
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-lg mx-auto w-full">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">May Allah Accept Your {prayerName}!</h2>
            <p className="text-xs text-slate-400">Your phone will be released shortly. Take a moment for post-prayer adhkar:</p>
          </div>

          {/* Adhkar Flashcard */}
          <div className="w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-3">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span>{postAdhkarList[adhkarStep].title}</span>
              <span className="text-slate-400">{adhkarStep + 1} of {postAdhkarList.length}</span>
            </div>

            <p className="text-xl sm:text-2xl font-arabic text-white text-right leading-relaxed pt-1">
              {postAdhkarList[adhkarStep].arabic}
            </p>

            <p className="text-xs text-emerald-300/90 font-medium">
              {postAdhkarList[adhkarStep].transliteration}
            </p>

            <p className="text-xs text-slate-400">
              {postAdhkarList[adhkarStep].meaning}
            </p>

            <div className="pt-2 flex justify-end gap-2">
              {adhkarStep < postAdhkarList.length - 1 ? (
                <button
                  onClick={() => setAdhkarStep(prev => prev + 1)}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <span>Next Adhkar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="relative z-10 p-6 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        {!isCompleted ? (
          <>
            <div className="text-xs text-slate-400 text-center sm:text-left">
              When you conclude with tasleem ("As-Salāmu ʿalaykum wa-raḥmatullāh"), tap below to conclude session.
            </div>

            <button
              id="complete-tasleem-btn"
              onClick={handleFinishSalah}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Conclude with Tasleem</span>
            </button>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <button
              id="release-phone-btn"
              onClick={() => {
                onCompleteSalah();
                onExit();
              }}
              className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <HeartHandshake className="w-5 h-5" />
              <span>Release Phone & Resume Activity</span>
            </button>
          </div>
        )}
      </div>

      {/* Exit Confirmation Guard Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-white">Salah Still in Progress</h3>
            </div>

            <p className="text-xs text-slate-300">
              Leaving suspension mode now will re-enable phone notifications and interruptions. Are you sure you want to exit before concluding with tasleem?
            </p>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                Return to Prayer
              </button>

              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExit();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              >
                Exit Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
