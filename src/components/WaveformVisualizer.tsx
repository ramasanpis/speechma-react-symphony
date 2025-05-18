
import React from 'react';

interface WaveformVisualizerProps {
  isPlaying: boolean;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ isPlaying }) => {
  // Number of bars in the waveform
  const barCount = 30;
  
  return (
    <div className="flex items-end justify-center h-12 gap-[2px] mt-2">
      {Array.from({ length: barCount }).map((_, i) => {
        // Create a semi-random height pattern for the bars
        const height = isPlaying 
          ? Math.abs(Math.sin((i / barCount) * Math.PI) * 100) + 
            Math.random() * (isPlaying ? 30 : 10)
          : 10 + Math.random() * 5;
          
        return (
          <div 
            key={i}
            className={`w-1 rounded-t-sm transition-all duration-300 ease-in-out ${
              isPlaying ? 'bg-primary' : 'bg-muted-foreground/30'
            }`}
            style={{ 
              height: `${height}%`,
              transition: `height ${0.1 + Math.random() * 0.3}s ease`,
            }}
          />
        );
      })}
    </div>
  );
};

export default WaveformVisualizer;
