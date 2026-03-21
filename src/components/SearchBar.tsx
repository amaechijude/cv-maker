'use client';

import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search manuscripts by title, curator, or archival date...',
  className
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
}) => {
  return (
    <div className={cn("relative group", className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-11 pr-11 h-12 bg-surface-container-low border-none focus:bg-white transition-all text-base italic"
        aria-label="Search Manuscripts"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-surface-container-highest rounded-full"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-on-surface-variant/60" />
        </Button>
      )}
    </div>
  );
};
