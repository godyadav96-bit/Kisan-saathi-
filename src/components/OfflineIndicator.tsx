import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, triggerManualRefresh, t } = useApp();

  if (isOnline) return null;

  return (
    <div className="bg-amber-600 text-white px-3 py-2 text-xs font-medium flex items-center justify-between sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 shrink-0 animate-pulse text-amber-200" />
        <span>{t.offlineNotice}</span>
      </div>
      <button
        onClick={triggerManualRefresh}
        className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs text-white font-semibold transition active:scale-95"
      >
        <RefreshCw className="w-3 h-3" />
        <span>{t.refreshData}</span>
      </button>
    </div>
  );
};
