import React from 'react';
import { WifiOff, Wifi, AlertTriangle } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, wasOffline } = useOnlineStatus();

  if (isOnline && !wasOffline) {
    return null;
  }

  if (isOnline && wasOffline) {
    return (
      <aside
        aria-live="polite"
        className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-emerald-700/95 text-white px-4 py-2 rounded-full shadow-lg text-xs font-medium border border-emerald-400 backdrop-blur-md animate-fadeIn"
      >
        <Wifi className="w-4 h-4 text-emerald-200" />
        <span>Internet connection restored</span>
      </aside>
    );
  }

  return (
    <aside
      aria-live="assertive"
      className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#8C2D19]/95 text-white px-4 py-2 rounded-full shadow-xl text-xs font-medium border border-amber-400/50 backdrop-blur-md animate-bounce"
    >
      <WifiOff className="w-4 h-4 text-amber-300 shrink-0" />
      <span>Offline Mode — Browsing cached formulations</span>
    </aside>
  );
};
