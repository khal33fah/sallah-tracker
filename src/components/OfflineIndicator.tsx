import React from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-amber-950/90 border-b border-amber-500/40 text-amber-200 px-4 py-2 text-xs flex items-center justify-between gap-2 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-2 max-w-2xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-semibold">Offline Mode Active</span>
          <span className="hidden sm:inline text-amber-300/80">• Prayer times, Quran library, and mat scanning remain fully operational offline.</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0">
          <CheckCircle2 className="w-3 h-3" />
          <span>Local Cache Active</span>
        </div>
      </div>
    </div>
  );
};
