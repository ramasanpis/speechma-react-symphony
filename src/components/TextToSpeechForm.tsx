
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AudioState, Voice } from '../types';
import VoiceSelector from './VoiceSelector';
import AudioPlayer from './AudioPlayer';
import { convertTextToSpeech, fallbackConvertTextToSpeech } from '../lib/speechService';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

interface TextToSpeechFormProps {
  voices: Voice[];
}

const TextToSpeechForm: React.FC<TextToSpeechFormProps> = ({ voices }) => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(voices[0].id);
  const [audioState, setAudioState] = useState<AudioState>({
    url: null,
    isPlaying: false,
    isLoading: false,
    error: null
  });
  
  const MAX_CHARS = 500;
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARS) {
      setText(newText);
    }
  };
  
  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.error('Please enter some text to convert');
      return;
    }
    
    setAudioState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // First try with our main conversion method
      let audioBlob;
      try {
        audioBlob = await convertTextToSpeech(text, selectedVoice);
      } catch (error) {
        console.log("Primary text-to-speech method failed, trying fallback");
        // If that fails, use our fallback method
        audioBlob = await fallbackConvertTextToSpeech(text, selectedVoice);
      }
      
      const audioUrl = URL.createObjectURL(audioBlob);
      
      setAudioState({
        url: audioUrl,
        isPlaying: false,
        isLoading: false,
        error: null
      });
      
      toast.success('Audio generated successfully!');
    } catch (error) {
      console.error('Error generating speech:', error);
      
      setAudioState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      }));
      
      toast.error('Failed to generate speech', {
        description: 'There was an error converting your text to speech.',
        duration: 5000
      });
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="text" className="block text-sm font-medium">
                  Enter Text
                </label>
                <span className="text-xs text-muted-foreground">
                  {text.length}/{MAX_CHARS}
                </span>
              </div>
              <Textarea
                id="text"
                placeholder="Type or paste text to convert to speech..."
                className="min-h-[150px] resize-none"
                value={text}
                onChange={handleTextChange}
              />
            </div>
            
            <VoiceSelector
              voices={voices}
              selectedVoice={selectedVoice}
              onSelect={handleVoiceChange}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!text.trim() || audioState.isLoading}
            >
              {audioState.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating audio...
                </>
              ) : (
                'Convert to Speech'
              )}
            </Button>
          </div>
        </form>
        
        {audioState.url && <AudioPlayer audioUrl={audioState.url} />}
      </CardContent>
    </Card>
  );
};

export default TextToSpeechForm;
