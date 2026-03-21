'use client';

import { useEffect, useState } from 'react';
import { BadgeCheck, History } from 'lucide-react';

export const AutoSaveIndicator = ({ lastModified }: { lastModified: number }) => {
  const [timeSince, setTimeSince] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSince(Math.floor((Date.now() - lastModified) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastModified]);

  const getText = () => {
    if (timeSince < 5) return 'Archived just now';
    if (timeSince < 60) return `${timeSince}s since last sync`;
    const minutes = Math.floor(timeSince / 60);
    if (minutes === 1) return '1m since last sync';
    if (minutes < 60) return `${minutes}m since last sync`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h since last sync`;
  };

  return (
    <div className="flex items-center gap-2 group">
      <div className="relative">
        <History className="w-4 h-4 text-primary/20 group-hover:text-primary/40 transition-colors" />
        <BadgeCheck className="w-2.5 h-2.5 text-primary absolute -bottom-0.5 -right-0.5 bg-white rounded-full" />
      </div>
      <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60">
        {getText()}
      </span>
    </div>
  );
};
