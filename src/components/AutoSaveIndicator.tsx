'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

export const AutoSaveIndicator = ({ lastModified }: { lastModified: number }) => {
  const [timeSince, setTimeSince] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSince(Math.floor((Date.now() - lastModified) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastModified]);

  const getText = () => {
    if (timeSince < 2) return 'Saved just now';
    if (timeSince < 60) return `Saved ${timeSince}s ago`;
    const minutes = Math.floor(timeSince / 60);
    if (minutes === 1) return 'Saved 1m ago';
    if (minutes < 60) return `Saved ${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `Saved ${hours}h ago`;
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Check className="w-4 h-4 text-green-600" />
      <span>{getText()}</span>
    </div>
  );
};
