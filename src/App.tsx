import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  BookOpen, 
  Smartphone, 
  Plane, 
  Compass, 
  CheckCircle2, 
  Sparkles,
  ShieldAlert,
  Moon,
  Volume2
} from 'lucide-react';
import { PrayerName, PrayerTimeItem, PrayerLogRecord, TravelerConfig } from './types';
import { LocationConfig, DEFAULT_CITIES, calculatePrayerTimes } from './utils/prayerTimes';
import { PrayerTimeDashboard } from './components/PrayerTimeDashboard';
import { MatScannerModal } from './components/MatScannerModal';
import { PhoneSuspensionMode } from './components/PhoneSuspensionMode';
import { LibraryModal } from './components/LibraryModal';
import { LockScreenSimulator } from './components/LockScreenSimulator';
import { TravelerSuspensionModal } from './components/TravelerSuspensionModal';
import { QiblaCompassModal } from './components/QiblaCompassModal';

export default function App() {
  // 1. Location state (Default to Mecca / or first city)
  const [location, setLocation] = useState<LocationConfig>(() => {
    const saved = localStorage.getItem('salah_location');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_CITIES[0];
  });

  // 2. Traveler (Musafir) Configuration
  const [travelerConfig, setTravelerConfig] = useState<TravelerConfig>(() => {
    const saved = localStorage.getItem('salah_traveler_config');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      isTraveler: false,
      destinationName: '',
      allowPhoneUse: true,
      fiveMinuteTimerActive: false,
      fiveMinuteTimerEndTimestamp: null,
      fiveMinuteRemainingSeconds: 300,
      combinePrayers: false,
    };
  });

  // 3. Prayer Observation History
  const [prayerLogs, setPrayerLogs] = useState<PrayerLogRecord[]>(() => {
    const saved = localStorage.getItem('salah_prayer_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  // 4. Modal state management
  const [scannerPrayer, setScannerPrayer] = useState<PrayerName | null>(null);
  const [suspensionPrayer, setSuspensionPrayer] = useState<PrayerName | null>(null);
  const [libraryOpen, setLibraryOpen] = useState<boolean>(false);
  const [lockscreenOpen, setLockscreenOpen] = useState<boolean>(false);
  const [compassOpen, setCompassOpen] = useState<boolean>(false);
  const [travelerTimerOpen, setTravelerTimerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save location to storage
  useEffect(() => {
    localStorage.setItem('salah_location', JSON.stringify(location));
  }, [location]);

  // Save traveler config to storage
  useEffect(() => {
    localStorage.setItem('salah_traveler_config', JSON.stringify(travelerConfig));
  }, [travelerConfig]);

  // Save logs to storage
  useEffect(() => {
    localStorage.setItem('salah_prayer_logs', JSON.stringify(prayerLogs));
  }, [prayerLogs]);

  // If 5-minute timer is toggled active, open traveler timer modal
  useEffect(() => {
    if (travelerConfig.fiveMinuteTimerActive) {
      setTravelerTimerOpen(true);
    }
  }, [travelerConfig.fiveMinuteTimerActive]);

  // Calculate live prayer times for today
  const prayerTimes: PrayerTimeItem[] = calculatePrayerTimes(
    new Date(),
    location,
    travelerConfig.isTraveler
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUpdateTravelerConfig = (partial: Partial<TravelerConfig>) => {
    setTravelerConfig(prev => {
      const next = { ...prev, ...partial };
      if (partial.fiveMinuteTimerActive) {
        setTravelerTimerOpen(true);
      }
      return next;
    });
  };

  // Called when prayer mat is verified via camera
  const handleMatVerified = (record: PrayerLogRecord, startSuspensionDirectly: boolean) => {
    setPrayerLogs(prev => {
      const filtered = prev.filter(l => !(l.date === record.date && l.prayerName === record.prayerName));
      return [record, ...filtered];
    });

    setScannerPrayer(null);
    showToast(`Prayer mat verified for ${record.prayerName}!`);

    if (startSuspensionDirectly) {
      setSuspensionPrayer(record.prayerName);
    }
  };

  // Called when Salah is completed in suspension mode
  const handleSalahCompleted = (prayerName: PrayerName) => {
    const today = new Date().toISOString().split('T')[0];
    setPrayerLogs(prev => {
      const existing = prev.find(l => l.date === today && l.prayerName === prayerName);
      if (existing) {
        return prev.map(l => l.id === existing.id ? { ...l, observed: true, timestamp: Date.now() } : l);
      } else {
        const newRecord: PrayerLogRecord = {
          id: `log-${Date.now()}`,
          date: today,
          prayerName,
          observed: true,
          timestamp: Date.now(),
          matVerified: false,
          isTravelerShortened: travelerConfig.isTraveler,
        };
        return [newRecord, ...prev];
      }
    });

    showToast(`Alhamdulillah! ${prayerName} prayer recorded.`);
  };

  // Handle 5-minute traveler timer completion
  const handleTravelerTimerComplete = () => {
    setTravelerConfig(prev => ({ ...prev, fiveMinuteTimerActive: false }));
    showToast('Traveler 5-minute suspension complete. Phone & apps are released!');
  };

  const nextPrayer = prayerTimes.find(p => p.isNext) || prayerTimes[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce border border-emerald-400/40">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white tracking-tight flex items-center gap-2">
                <span>Salah Companion</span>
                {travelerConfig.isTraveler && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                    <Plane className="w-3 h-3" />
                    <span>Musafir</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Prayer Mat Scan & Distraction Suspension</p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Library button */}
            <button
              id="open-library-header-btn"
              onClick={() => setLibraryOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
              title="Quran, Hadiths & Islamic Books"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Library</span>
            </button>

            {/* Lock Screen Display button */}
            <button
              id="open-lockscreen-header-btn"
              onClick={() => setLockscreenOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
              title="Lock screen Ayah write-up & Wallpaper"
            >
              <Smartphone className="w-4 h-4 text-teal-400" />
              <span className="hidden sm:inline">Lock Screen</span>
            </button>

            {/* Qibla Compass button */}
            <button
              id="open-qibla-compass-header-btn"
              onClick={() => setCompassOpen(true)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
              title="Qibla Direction"
            >
              <Compass className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <PrayerTimeDashboard
          prayerTimes={prayerTimes}
          prayerLogs={prayerLogs}
          location={location}
          onChangeLocation={setLocation}
          travelerConfig={travelerConfig}
          onUpdateTravelerConfig={handleUpdateTravelerConfig}
          onOpenScanner={(prayer) => setScannerPrayer(prayer)}
          onStartSuspension={(prayer) => setSuspensionPrayer(prayer)}
          onOpenLibrary={() => setLibraryOpen(true)}
          onOpenLockScreen={() => setLockscreenOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto space-y-1">
          <p className="font-arabic text-sm text-slate-400">
            رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ
          </p>
          <p>
            "My Lord, make me an establisher of prayer, and [many] from my descendants. Our Lord, and accept my supplication." (Quran 14:40)
          </p>
        </div>
      </footer>

      {/* MODAL 1: Camera Prayer Mat Scanner */}
      {scannerPrayer && (
        <MatScannerModal
          prayerName={scannerPrayer}
          isOpen={!!scannerPrayer}
          onClose={() => setScannerPrayer(null)}
          onVerified={handleMatVerified}
          travelMode={travelerConfig.isTraveler}
        />
      )}

      {/* MODAL 2: Full Phone Distraction Suspension Mode */}
      {suspensionPrayer && (
        <PhoneSuspensionMode
          prayerName={suspensionPrayer}
          targetRakahs={
            travelerConfig.isTraveler && (suspensionPrayer === 'Dhuhr' || suspensionPrayer === 'Asr' || suspensionPrayer === 'Isha')
              ? 2
              : prayerTimes.find(p => p.id === suspensionPrayer)?.rakahs || 4
          }
          isOpen={!!suspensionPrayer}
          onExit={() => setSuspensionPrayer(null)}
          onCompleteSalah={() => handleSalahCompleted(suspensionPrayer)}
        />
      )}

      {/* MODAL 3: Islamic Library (Quran, Hadith, Books) */}
      <LibraryModal
        isOpen={libraryOpen}
        onClose={() => setLibraryOpen(false)}
      />

      {/* MODAL 4: Lock Screen Ayah Display & Wallpaper Generator */}
      <LockScreenSimulator
        isOpen={lockscreenOpen}
        onClose={() => setLockscreenOpen(false)}
        nextPrayerName={nextPrayer?.name}
        nextPrayerTime={nextPrayer?.timeString}
      />

      {/* MODAL 5: 5-Minute Traveler Phone Suspension Lock */}
      <TravelerSuspensionModal
        isOpen={travelerTimerOpen}
        onClose={() => {
          setTravelerTimerOpen(false);
          setTravelerConfig(prev => ({ ...prev, fiveMinuteTimerActive: false }));
        }}
        onTimerComplete={handleTravelerTimerComplete}
      />

      {/* MODAL 6: Qibla Compass */}
      <QiblaCompassModal
        isOpen={compassOpen}
        onClose={() => setCompassOpen(false)}
        location={location}
      />
    </div>
  );
}
