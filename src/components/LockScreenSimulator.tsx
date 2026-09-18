import React, { useState, useRef, useEffect } from 'react';
import { 
  Smartphone, 
  X, 
  Download, 
  Sparkles, 
  RefreshCw, 
  Bell, 
  Check, 
  Clock, 
  Share2,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { LOCKSCREEN_AYAHS } from '../data/lockscreenAyahs';
import { LockScreenReminder } from '../types';

interface LockScreenSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  nextPrayerName?: string;
  nextPrayerTime?: string;
}

export const LockScreenSimulator: React.FC<LockScreenSimulatorProps> = ({
  isOpen,
  onClose,
  nextPrayerName = 'Fajr',
  nextPrayerTime = '05:12 AM',
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [ayahList, setAyahList] = useState<LockScreenReminder[]>(LOCKSCREEN_AYAHS);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [isFullscreenStandby, setIsFullscreenStandby] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const currentAyah = ayahList[selectedIndex] || ayahList[0];

  // Generate fresh AI reflection via backend
  const handleGenerateAIReflection = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/lockscreen-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'remembering Allah and purpose in this dunya',
          ayahReference: currentAyah.surahReference,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newReminder: LockScreenReminder = {
          id: `ai-${Date.now()}`,
          arabicAyah: data.arabicAyah,
          surahReference: data.surahReference,
          englishTranslation: data.englishTranslation,
          reflectionWriteup: data.reflectionWriteup,
          themeFocus: 'Purpose of Life',
        };
        setAyahList(prev => [newReminder, ...prev]);
        setSelectedIndex(0);
      }
    } catch (err) {
      console.warn('AI reflection error:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Generate high-resolution lock screen wallpaper for download
  const handleDownloadWallpaper = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Standard phone wallpaper resolution (1080 x 2340)
    canvas.width = 1080;
    canvas.height = 2340;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Dark elegant gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 2340);
    bgGradient.addColorStop(0, '#020617'); // slate-950
    bgGradient.addColorStop(0.3, '#064e3b'); // deep emerald
    bgGradient.addColorStop(0.7, '#020617');
    bgGradient.addColorStop(1, '#000000');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 2340);

    // 2. Decorative geometric arch accents
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(540, 360, 420, Math.PI, 0, false);
    ctx.stroke();

    // 3. Time Display
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 130px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const mins = currentTime.getMinutes().toString().padStart(2, '0');
    ctx.fillText(`${hours}:${mins}`, 540, 440);

    // 4. Date & Next Prayer
    ctx.font = '42px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#94a3b8';
    const dateStr = currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    ctx.fillText(dateStr, 540, 520);

    ctx.fillStyle = '#34d399'; // emerald-400
    ctx.font = '36px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`Next: ${nextPrayerName} at ${nextPrayerTime}`, 540, 590);

    // 5. Central Lock Screen Card Backdrop
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.roundRect(80, 800, 920, 1050, 40);
    ctx.fill();
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // 6. Header
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('• REMINDER OF ALLAH & PURPOSE •', 540, 890);

    // 7. Arabic Ayah
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 58px "Amiri", serif';
    wrapText(ctx, currentAyah.arabicAyah, 540, 990, 840, 90);

    // 8. Surah Reference
    ctx.fillStyle = '#34d399';
    ctx.font = 'italic 34px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`— ${currentAyah.surahReference} —`, 540, 1260);

    // 9. English Translation
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '40px -apple-system, BlinkMacSystemFont, sans-serif';
    wrapText(ctx, `"${currentAyah.englishTranslation}"`, 540, 1370, 820, 56);

    // 10. Dunya & Iman Reflection Write-Up
    ctx.fillStyle = 'rgba(2, 6, 23, 0.8)';
    ctx.roundRect(120, 1540, 840, 240, 24);
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '32px -apple-system, BlinkMacSystemFont, sans-serif';
    wrapText(ctx, currentAyah.reflectionWriteup, 540, 1610, 780, 46);

    // 11. Footer watermark
    ctx.fillStyle = '#64748b';
    ctx.font = '30px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Salah Tracker • Iman in the Dunya', 540, 2180);

    // Convert to image download
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `LockScreen-Ayah-${currentAyah.surahReference.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    a.click();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Canvas text wrap utility
  function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';
    let curY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, curY);
        line = words[n] + ' ';
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, curY);
  }

  // Request Web Notification permission to show Ayah alerts on lock screen
  const requestNotificationReminder = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setNotificationEnabled(true);
        new Notification(currentAyah.surahReference, {
          body: `${currentAyah.englishTranslation}\n\n${currentAyah.reflectionWriteup}`,
          icon: '/favicon.ico',
        });
      }
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md ${
      isFullscreenStandby ? 'p-0' : ''
    }`}>
      <div className={`relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col ${
        isFullscreenStandby ? 'h-full max-w-full rounded-none border-0' : 'max-h-[92vh]'
      }`}>
        {/* Header */}
        {!isFullscreenStandby && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Lock Screen Ayah Display & Reminders
                </h2>
                <p className="text-xs text-slate-400">
                  Daily write-up on your device lock screen reminding of Allah, Dunya purpose, and Iman
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content Layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: Interactive Phone Mockup / Standby Screen */}
          <div className={`md:col-span-6 flex flex-col items-center justify-center ${
            isFullscreenStandby ? 'md:col-span-12 h-full' : ''
          }`}>
            {/* Phone Bezel Frame */}
            <div className={`relative w-full max-w-[320px] sm:max-w-[340px] aspect-[9/19] rounded-[44px] bg-slate-950 border-[6px] border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between p-5 text-center select-none ring-1 ring-slate-700/50 ${
              isFullscreenStandby ? 'max-w-md aspect-auto h-[90vh]' : ''
            }`}>
              {/* Dynamic Island / Speaker Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full flex items-center justify-end px-3">
                <div className="w-2 h-2 rounded-full bg-slate-800" />
              </div>

              {/* Background ambient light */}
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-slate-950 to-black pointer-events-none" />

              {/* Top Lock Screen Clock */}
              <div className="relative z-10 pt-8 space-y-1">
                <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white font-mono">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-[11px] text-emerald-300 font-medium mt-1 shadow-sm">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>Next: {nextPrayerName} at {nextPrayerTime}</span>
                </div>
              </div>

              {/* Central Lock Screen Card: Ayah Write-Up */}
              <div className="relative z-10 my-auto bg-slate-900/85 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-4 shadow-xl text-left space-y-2">
                <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-1.5">
                  <span>{currentAyah.themeFocus}</span>
                  <span className="text-slate-400">{currentAyah.surahReference}</span>
                </div>

                <p className="text-lg font-arabic text-white text-right leading-relaxed pt-1">
                  {currentAyah.arabicAyah}
                </p>

                <p className="text-[11px] text-slate-300 leading-snug font-medium italic">
                  "{currentAyah.englishTranslation}"
                </p>

                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] text-slate-300 leading-relaxed">
                  <span className="text-emerald-400 font-semibold">Purpose & Iman: </span>
                  {currentAyah.reflectionWriteup}
                </div>
              </div>

              {/* Bottom Swipe Bar */}
              <div className="relative z-10 pb-2 space-y-2">
                <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                  <span>Swipe up or hold for Salah Tracker</span>
                </div>
                <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto" />
              </div>
            </div>

            {/* Standby Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreenStandby(!isFullscreenStandby)}
              className="mt-3 text-xs text-slate-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{isFullscreenStandby ? 'Exit Standby Mode' : 'Open Ambient Bedside Standby'}</span>
            </button>
          </div>

          {/* Right Column: Controls, Ayah Carousel & Wallpaper Download */}
          {!isFullscreenStandby && (
            <div className="md:col-span-6 space-y-5">
              {/* Carousel Selection Header */}
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Ayah Reminder ({selectedIndex + 1} of {ayahList.length})
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedIndex(prev => (prev > 0 ? prev - 1 : ayahList.length - 1))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Previous Ayah"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedIndex(prev => (prev < ayahList.length - 1 ? prev + 1 : 0))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Next Ayah"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Ayah Snippet Card */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400">{currentAyah.surahReference}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400">
                    {currentAyah.themeFocus}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white">
                  "{currentAyah.englishTranslation}"
                </p>
                <p className="text-xs text-slate-400">
                  {currentAyah.reflectionWriteup}
                </p>
              </div>

              {/* Action 1: Download Wallpaper */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download Lock Screen Wallpaper</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Exports a high-resolution wallpaper (1080x2340) featuring this Ayah and reflection to set on your device's actual lock screen.
                  </p>
                </div>

                <button
                  id="download-lockscreen-wallpaper-btn"
                  onClick={handleDownloadWallpaper}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow flex items-center justify-center gap-2 transition-all"
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Wallpaper Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download High-Res Lock Screen Wallpaper</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action 2: Generate AI Reflection */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Generate Contemplative Reflection</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Uses Gemini to write a fresh reminder about our true purpose in this Dunya.
                    </p>
                  </div>
                </div>

                <button
                  id="generate-ai-reflection-btn"
                  onClick={handleGenerateAIReflection}
                  disabled={isGeneratingAI}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isGeneratingAI ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                      <span>Reflecting on the Dunya...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Generate New Iman Reflection</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action 3: Lock Screen Notification Banners */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-teal-400" />
                  <span className="text-slate-300">Lock Screen Push Notifications</span>
                </div>

                <button
                  onClick={requestNotificationReminder}
                  className="px-3 py-1.5 rounded-lg bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 font-medium"
                >
                  {notificationEnabled ? 'Enabled ✓' : 'Send Test Notification'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden Wallpaper Canvas for PNG rendering */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
