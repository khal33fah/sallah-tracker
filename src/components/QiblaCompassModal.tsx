import React, { useState, useEffect } from 'react';
import { Compass, X, MapPin } from 'lucide-react';
import { LocationConfig, getQiblaDirection } from '../utils/prayerTimes';

interface QiblaCompassModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationConfig;
}

export const QiblaCompassModal: React.FC<QiblaCompassModalProps> = ({
  isOpen,
  onClose,
  location,
}) => {
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasCompassSupport, setHasCompassSupport] = useState<boolean>(false);

  const qiblaBearing = Math.round(getQiblaDirection(location.latitude, location.longitude));

  useEffect(() => {
    if (!isOpen) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading = e.alpha;
      // iOS webkitCompassHeading
      if ((e as any).webkitCompassHeading) {
        heading = (e as any).webkitCompassHeading;
      }
      if (heading !== null && heading !== undefined) {
        setDeviceHeading(Math.round(heading));
        setHasCompassSupport(true);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Relative angle to turn towards Qibla
  const relativeQiblaAngle = (qiblaBearing - deviceHeading + 360) % 360;
  const isAligned = Math.abs(relativeQiblaAngle) < 5 || Math.abs(relativeQiblaAngle - 360) < 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center space-y-6">
        <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Qibla Direction</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">Kaaba Compass</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Facing Makkah from {location.name}
          </p>
        </div>

        {/* Circular Compass Dial */}
        <div className="relative w-64 h-64 rounded-full bg-slate-950 border-4 border-slate-800 shadow-inner flex items-center justify-center">
          {/* Degree Ring */}
          <div className="absolute inset-2 rounded-full border border-dashed border-slate-800" />

          {/* Compass Cardinal Points */}
          <span className="absolute top-3 font-bold text-xs text-emerald-400">N</span>
          <span className="absolute right-3 font-bold text-xs text-slate-500">E</span>
          <span className="absolute bottom-3 font-bold text-xs text-slate-500">S</span>
          <span className="absolute left-3 font-bold text-xs text-slate-500">W</span>

          {/* Qibla Needle */}
          <div
            className="absolute w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
            style={{ transform: `rotate(${qiblaBearing}deg)` }}
          >
            {/* Kaaba Marker */}
            <div className="absolute top-4 flex flex-col items-center">
              <div className="w-6 h-6 rounded bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-lg shadow-amber-500/30">
                🕋
              </div>
              <div className="w-1.5 h-16 bg-gradient-to-t from-transparent to-amber-500 rounded-full mt-1" />
            </div>
          </div>

          {/* Center Hub */}
          <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-emerald-500 flex flex-col items-center justify-center shadow-lg">
            <span className="text-xs font-mono font-bold text-emerald-300">{qiblaBearing}°</span>
          </div>
        </div>

        {/* Alignment Guidance */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs w-full">
          <p className="text-emerald-300 font-semibold">
            Qibla Bearing: {qiblaBearing}° from True North
          </p>
          <p className="text-slate-400 text-[11px] mt-1">
            Place your prayer mat pointing toward {qiblaBearing}° to align with the Holy Kaaba in Makkah.
          </p>
        </div>
      </div>
    </div>
  );
};
