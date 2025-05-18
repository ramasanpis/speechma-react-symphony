
import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Volume2 } from "lucide-react";
import WaveformVisualizer from './WaveformVisualizer';

interface AudioPlayerProps {
  audioUrl: string | null;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioUrl]);
  
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Format time in MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  if (!audioUrl) {
    return null;
  }
  
  return (
    <Card className="p-4 mt-6 w-full bg-accent">
      <div className="flex items-center gap-3">
        <Button 
          onClick={togglePlay} 
          size="icon" 
          className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90 text-white shadow-lg"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
        </Button>
        
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-muted-foreground" />
            <div className="text-xs font-medium text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          
          <div className="w-full bg-muted rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-100 ease-in-out"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            />
          </div>
        </div>
      </div>
      
      <WaveformVisualizer isPlaying={isPlaying} />
      
      <audio ref={audioRef} src={audioUrl} className="hidden" />
    </Card>
  );
};

export default AudioPlayer;
