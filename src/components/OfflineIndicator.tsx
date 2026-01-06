'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator = () => {
  // Lazy initializer to get the correct initial value (SSR-safe)
  const [isOnline, setIsOnline] = useState(() => 
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div 
      className={`
        fixed bottom-4 left-4 px-4 py-2 rounded-lg shadow-lg text-sm
        flex items-center gap-2 transition-all duration-300 z-50
        ${isOnline 
          ? 'bg-green-50 text-green-700 border border-green-200' 
          : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
        }
      `}
      role="status"
      aria-live="polite"
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span className="font-medium">All changes saved locally</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span className="font-medium">Offline - changes still saving</span>
        </>
      )}
    </div>
  );
};
