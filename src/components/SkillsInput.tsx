'use client';

import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SkillsInput = ({
  skills,
  onChange,
  maxSkills = 20
}: {
  skills: string[];
  onChange: (skills: string[]) => void;
  maxSkills?: number;
}) => {
  const [inputValue, setInputValue] = useState('');

  const addSkill = () => {
    const skill = inputValue.trim();
    if (!skill) return;
    if (skills.includes(skill)) {
      setInputValue('');
      return;
    }
    if (skills.length >= maxSkills) return;
    
    onChange([...skills, skill]);
    setInputValue('');
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h2 className="text-2xl font-serif text-primary">Core Competencies</h2>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
          {skills.length} / {maxSkills}
        </span>
      </div>
      
      {/* Input Architecture */}
      <div className="flex gap-3 bg-surface-container-low p-2 rounded-xl group focus-within:bg-white transition-all shadow-sm">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Acquired mastery in..."
          disabled={skills.length >= maxSkills}
          className="bg-transparent border-none shadow-none focus:ring-0 italic"
        />
        <Button
          type="button"
          onClick={addSkill}
          disabled={!inputValue.trim() || skills.length >= maxSkills}
          size="icon-sm"
          variant="manuscript"
          className="rounded-lg shrink-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Skills Display Gallery */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 min-h-12">
          {skills.map((skill) => (
            <Badge key={skill} variant="default" className="gap-2 px-3 py-1.5 hover:shadow-md transition-all">
              <Sparkles className="w-3 h-3 opacity-40" />
              <span className="font-bold tracking-tight">{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1 hover:bg-primary/10 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {skills.length >= maxSkills && (
        <p className="text-[10px] uppercase tracking-widest font-bold text-tertiary-container animate-pulse">
          Maximum archival capacity reached
        </p>
      )}
    </section>
  );
};
