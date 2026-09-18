import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  ShieldAlert, 
  Compass, 
  Plane, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles, 
  Volume2, 
  VolumeX,
  ChevronRight,
  BookOpen,
  Smartphone
} from 'lucide-react';
import { PrayerName, PrayerTimeItem, PrayerLogRecord, TravelerConfig } from '../types';
import { LocationConfig, DEFAULT_CITIES, getQiblaDirection } from '../utils/prayerTimes';

interface PrayerTimeDashboardProps {
  prayerTimes: PrayerTimeItem[];
  prayerLogs: PrayerLogRecord[];
  location: LocationConfig;
  onChangeLocation: (loc: LocationConfig) => void;
  travelerConfig: TravelerConfig;
  onUpdateTravelerConfig: (config: Partial<TravelerConfig>) => void;
  onOpenScanner: (prayer: PrayerName) => void;
  onStartSuspension: (prayer: PrayerName) => void;
  onOpenLibrary: () => void;
  onOpenLockScreen: () => void;
}

export const PrayerTimeDashboard: React.FC<PrayerTimeDashboardProps> = ({
  prayerTimes,
  prayerLogs,
  location,
  onChangeLocation,
  travelerConfig,
  onUpdateTravelerConfig,
  onOpenScanner,
  onStartSuspension,
  onOpenLibrary,
  onOpenLockScreen,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [nextPrayerCountdown, setNextPrayerCountdown] = useState<string>('');
  const [adhanMuted, setAdhanMuted] = useState<boolean>(false);
  const [showLocationSelect, setShowLocationSelect] = useState<boolean>(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Find next prayer and calculate countdown
  const nextPrayer = prayerTimes.find(p => p.isNext) || prayerTimes[0];
  const currentPrayer = prayerTimes.find(p => p.isCurrent);

  useEffect(() => {
    if (!nextPrayer) return;

    const updateCountdown = () => {
      const now = Date.now();
      let diff = nextPrayer.timestamp - now;

      // If next prayer is tomorrow
      if (diff < 0) {
        diff += 24 * 60 * 60 * 1000;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setNextPrayerCountdown(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextPrayer]);

  const qiblaAngle = Math.round(getQiblaDirection(location.latitude, location.longitude));

  // Determine if a prayer has been observed today
  const isObserved = (prayerName: PrayerName) => {
    return prayerLogs.some(log => log.prayerName === prayerName && log.observed);
  };

  const getLogDetails = (prayerName: PrayerName) => {
    return prayerLogs.find(log => log.prayerName === prayerName && log.observed);
  };

  const todayCompletedCount = prayerTimes.filter(p => p.id !== 'Sunrise' && isObserved(p.id)).length;
  const totalObligatory = 5;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800/80 p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-8 top-8 opacity-10 text-emerald-300 font-arabic text-7xl select-none pointer-events-none hidden md:block">
          حَيَّ عَلَى الصَّلَاةِ
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <button 
                id="location-selector-btn"
                onClick={() => setShowLocationSelect(!showLocationSelect)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{location.name}, {location.country}</span>
                <span className="text-slate-500 text-[10px]">({location.calculationMethod})</span>
              </button>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/40 text-xs text-slate-400">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Qibla {qiblaAngle}°</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Salah Tracker</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                Mat Vision
              </span>
            </h1>

            <p className="text-sm text-slate-400 max-w-xl">
              Camera-verified prayer mat scanning with complete phone suspension to protect your khushoo' from worldly distractions.
            </p>
          </div>

          {/* Next Prayer Countdown Card */}
          <div className="flex flex-col items-start md:items-end bg-slate-950/60 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-slate-800">
            <div className="text-xs uppercase font-semibold tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Next: {nextPrayer?.name} ({nextPrayer?.arabicName})</span>
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight mt-1">
              {nextPrayerCountdown || '--:--:--'}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              At {nextPrayer?.timeString} • {nextPrayer?.rakahs} Rak'ahs
            </div>
          </div>
        </div>

        {/* Location Selector Dropdown */}
        {showLocationSelect && (
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {DEFAULT_CITIES.map(city => (
              <button
                key={city.name}
                onClick={() => {
                  onChangeLocation(city);
                  setShowLocationSelect(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                  location.name === city.name 
                    ? 'bg-emerald-600/30 border border-emerald-500 text-emerald-200' 
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/40'
                }`}
              >
                <div className="font-semibold">{city.name}</div>
                <div className="text-[10px] text-slate-400">{city.country}</div>
              </button>
            ))}
          </div>
        )}

        {/* Today's Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-200">Daily Obligatory Progress:</span>
            <span className="text-emerald-400 font-bold">{todayCompletedCount} / {totalObligatory} Prayers Observed</span>
          </div>

          <div className="w-full sm:w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
              style={{ width: `${(todayCompletedCount / totalObligatory) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Traveler (Musafir) Status Alert & Action Bar */}
      <div className={`p-4 rounded-xl border transition-all ${
        travelerConfig.isTraveler
          ? 'bg-amber-950/30 border-amber-500/40 text-amber-100'
          : 'bg-slate-900/60 border-slate-800 text-slate-300'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`p-2 rounded-lg ${travelerConfig.isTraveler ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Traveler (Musafir) Mode</span>
                {travelerConfig.isTraveler && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
                    Qasr & Jam' Active (4 Rak'ahs → 2)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {travelerConfig.isTraveler 
                  ? 'Prayers shortened (Qasr). You have options below to continue using your phone or activate a 5-minute suspension timer.'
                  : 'Traveling on a journey? Activate Musafir mode for prayer shortening dispensations and 5-min phone locks.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="toggle-traveler-mode-btn"
              onClick={() => onUpdateTravelerConfig({ isTraveler: !travelerConfig.isTraveler })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                travelerConfig.isTraveler 
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 hover:bg-amber-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              {travelerConfig.isTraveler ? 'Exit Travel Mode' : 'Enable Travel Mode'}
            </button>
          </div>
        </div>

        {/* Journey Specific Options (From Prompt Requirements) */}
        {travelerConfig.isTraveler && (
          <div className="mt-4 pt-3 border-t border-amber-900/40 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Option 1: Continue Using Phone */}
            <div 
              onClick={() => onUpdateTravelerConfig({ allowPhoneUse: !travelerConfig.allowPhoneUse })}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                travelerConfig.allowPhoneUse 
                  ? 'bg-emerald-950/40 border-emerald-500/40' 
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-300">Option 1: Allow Phone Usage</span>
                <input 
                  type="checkbox" 
                  checked={travelerConfig.allowPhoneUse}
                  onChange={() => {}}
                  className="rounded text-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Enables you to continue using your phone during your journey while maintaining shortened prayer obligations.
              </p>
            </div>

            {/* Option 2: 5-Minute Suspension Timer */}
            <div 
              onClick={() => onUpdateTravelerConfig({ fiveMinuteTimerActive: true })}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                travelerConfig.fiveMinuteTimerActive
                  ? 'bg-amber-500/20 border-amber-400 animate-pulse'
                  : 'bg-amber-950/30 border-amber-800/60 hover:border-amber-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Option 2: 5-Minute Phone Suspension
                </span>
                <span className="text-[10px] bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded">
                  Tap to Start
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Suspends all phone apps for 5 minutes. After exactly 5 minutes, apps are automatically released with a chime.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Prayer Schedule Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Today's Prayer Schedule</h2>
          <span className="text-xs text-slate-500">Scan mat with camera to verify Salah</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {prayerTimes.map((prayer) => {
            const observed = isObserved(prayer.id);
            const log = getLogDetails(prayer.id);
            const isSunrise = prayer.id === 'Sunrise';

            return (
              <div
                key={prayer.id}
                id={`prayer-card-${prayer.id.toLowerCase()}`}
                className={`relative rounded-xl p-4 border transition-all ${
                  observed
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                    : prayer.isCurrent
                    ? 'bg-slate-900 border-emerald-500/80 ring-1 ring-emerald-500/50 shadow-lg'
                    : prayer.isNext
                    ? 'bg-slate-900/90 border-slate-700'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                {/* Header with Arabic & Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white">{prayer.name}</span>
                      <span className="text-xs text-emerald-400 font-arabic font-semibold">{prayer.arabicName}</span>
                    </div>
                    <div className="text-xl font-bold font-mono text-slate-200 mt-0.5">
                      {prayer.timeString}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {observed ? (
                      <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Observed</span>
                      </div>
                    ) : prayer.isCurrent ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                        Current Time
                      </span>
                    ) : prayer.isNext ? (
                      <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        Upcoming
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Details & Mat Verification Badge */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    {!isSunrise && (
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300">
                        {prayer.rakahs} Rak'ahs {travelerConfig.isTraveler && prayer.rakahs === 2 ? '(Shortened)' : ''}
                      </span>
                    )}
                    {log?.matVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-500/30">
                        <Camera className="w-3 h-3 text-teal-400" />
                        <span>Mat Verified</span>
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {!isSunrise && (
                    <div className="flex items-center gap-1.5">
                      {/* Camera Mat Scanner */}
                      <button
                        id={`scan-mat-btn-${prayer.id.toLowerCase()}`}
                        onClick={() => onOpenScanner(prayer.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors"
                        title="Scan prayer mat with camera to verify Salah"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{observed ? 'Re-scan' : 'Scan Mat'}</span>
                      </button>

                      {/* Phone Suspension Lockdown */}
                      <button
                        id={`suspend-phone-btn-${prayer.id.toLowerCase()}`}
                        onClick={() => onStartSuspension(prayer.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
                        title="Suspend phone apps and distractions for this Salah"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                        <span>Focus</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation Cards: Islamic Library & Lock Screen Reminders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Islamic Library Card */}
        <div 
          onClick={onOpenLibrary}
          className="group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 p-5 hover:border-emerald-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Islamic Library</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Quran, Hadith & Islamic Books
              </h3>
              <p className="text-xs text-slate-400">
                Explore Arabic text with audio recitations, authentic Hadith collections, and Hisn al-Muslim supplications.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Lock Screen Ayah Reminder Card */}
        <div 
          onClick={onOpenLockScreen}
          className="group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 p-5 hover:border-emerald-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
                <Smartphone className="w-4 h-4" />
                <span>Lock Screen Ayah Display</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                Dunya & Iman Reminders
              </h3>
              <p className="text-xs text-slate-400">
                Display profound Ayahs on your device lock screen to constantly remind you of Allah and our true purpose in this Dunya.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
