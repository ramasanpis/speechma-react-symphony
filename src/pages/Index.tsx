
import React from 'react';
import TextToSpeechForm from '../components/TextToSpeechForm';
import { availableVoices } from '../lib/speechService';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/50 to-background py-12 px-4">
      <div className="max-w-xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            VoiceFlow
          </h1>
          <p className="text-muted-foreground">
            Convert your text into natural-sounding speech
          </p>
        </header>
        
        <TextToSpeechForm voices={availableVoices} />
        
        <footer className="mt-10 text-center text-xs text-muted-foreground">
          <p>Note: This is a demo application that requires a backend service for actual text-to-speech conversion.</p>
          <p className="mt-2">© {new Date().getFullYear()} VoiceFlow</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
