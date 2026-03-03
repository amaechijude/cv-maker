'use client';

import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ATSKeywordsInput = ({
  keywords,
  onChange,
  maxKeywords = 50
}: {
  keywords: string[];
  onChange: (keywords: string[]) => void;
  maxKeywords?: number;
}) => {
  const [inputValue, setInputValue] = useState('');

  const addKeyword = () => {
    const keyword = inputValue.trim();
    if (!keyword) return;
    if (keywords.includes(keyword)) {
      setInputValue('');
      return;
    }
    if (keywords.length >= maxKeywords) return;
    
    onChange([...keywords, keyword]);
    setInputValue('');
  };

  const removeKeyword = (keywordToRemove: string) => {
    onChange(keywords.filter(kw => kw !== keywordToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        <label className="text-sm font-medium">
          ATS Keywords ({keywords.length}/{maxKeywords})
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          These keywords are embedded in the PDF to help pass Applicant Tracking Systems. They won't be visible to humans.
        </p>
      </div>
      
      {/* Input */}
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a keyword and press Enter"
          disabled={keywords.length >= maxKeywords}
        />
        <Button
          type="button"
          onClick={addKeyword}
          disabled={!inputValue.trim() || keywords.length >= maxKeywords}
          size="icon"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Keywords Display */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg min-h-15">
          {keywords.map((kw) => (
            <Badge key={kw} variant="secondary" className="gap-1 pr-1 bg-blue-50 text-blue-700 border-blue-200">
              {kw}
              <button
                type="button"
                onClick={() => removeKeyword(kw)}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                aria-label={`Remove ${kw}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {keywords.length >= maxKeywords && (
        <p className="text-sm text-orange-600">
          Maximum {maxKeywords} keywords reached
        </p>
      )}
    </div>
  );
};
