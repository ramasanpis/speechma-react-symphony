
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Voice } from '../types';
import { Mic } from 'lucide-react';

interface VoiceSelectorProps {
  voices: Voice[];
  selectedVoice: string;
  onSelect: (voiceId: string) => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ 
  voices, 
  selectedVoice, 
  onSelect 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Mic className="h-4 w-4 text-primary" />
        <label className="text-sm font-medium text-muted-foreground">Select Voice</label>
      </div>
      <Select value={selectedVoice} onValueChange={onSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a voice" />
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={voice.id} value={voice.id} className="cursor-pointer">
              <div className="flex justify-between w-full">
                <span>{voice.name}</span>
                <span className="text-sm text-muted-foreground">
                  {voice.accent} • {voice.gender === 'male' ? 'Male' : 'Female'}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VoiceSelector;
