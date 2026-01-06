'use client';

import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
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
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Skills ({skills.length}/{maxSkills})
      </label>
      
      {/* Input */}
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter"
          disabled={skills.length >= maxSkills}
        />
        <Button
          type="button"
          onClick={addSkill}
          disabled={!inputValue.trim() || skills.length >= maxSkills}
          size="icon"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Skills Display */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg min-h-15">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1 pr-1">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                aria-label={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {skills.length >= maxSkills && (
        <p className="text-sm text-orange-600">
          Maximum {maxSkills} skills reached
        </p>
      )}
    </div>
  );
};
