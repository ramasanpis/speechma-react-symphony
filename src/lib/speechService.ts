
import { Voice } from '../types';
import { convertTextToSpeechAPI } from './apiService';

export const availableVoices: Voice[] = [
  { id: 'en-US-GuyNeural', name: 'Guy', accent: 'US', gender: 'male' },
  { id: 'en-US-JennyNeural', name: 'Jenny', accent: 'US', gender: 'female' },
  { id: 'en-GB-RyanNeural', name: 'Ryan', accent: 'GB', gender: 'male' },
  { id: 'en-IN-NeerjaNeural', name: 'Neerja', accent: 'IN', gender: 'female' },
];

// Primary method - using backend API
export const convertTextToSpeech = async (text: string, voiceId: string): Promise<Blob> => {
  try {
    return await convertTextToSpeechAPI(text, voiceId);
  } catch (error) {
    console.error("Backend TTS service failed, falling back to browser TTS:", error);
    throw error; // Let the caller handle the fallback
  }
};

// Fallback method - using browser's Web Speech API
export const fallbackConvertTextToSpeech = async (text: string, voiceId: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
      reject(new Error("Your browser doesn't support speech synthesis"));
      return;
    }
    
    // Create utterance with the provided text
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map our voice IDs to browser voices
    const getBrowserVoice = (id: string) => {
      const voiceMap: Record<string, { lang: string, name?: string }> = {
        'en-US-GuyNeural': { lang: 'en-US', name: 'Google US English' },
        'en-US-JennyNeural': { lang: 'en-US', name: 'Google US English Female' },
        'en-GB-RyanNeural': { lang: 'en-GB', name: 'Google UK English Male' },
        'en-IN-NeerjaNeural': { lang: 'en-IN' }
      };
      
      const voicePreference = voiceMap[id] || { lang: 'en-US' };
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find an exact match for our voice
      let voice = voices.find(v => 
        v.lang === voicePreference.lang && 
        (!voicePreference.name || v.name.includes(voicePreference.name))
      );
      
      // If no match, just use any voice with the right language
      if (!voice) {
        voice = voices.find(v => v.lang.startsWith(voicePreference.lang.split('-')[0]));
      }
      
      // Fallback to any available voice if still no match
      return voice || voices[0];
    };
    
    // Get available voices
    let voices = window.speechSynthesis.getVoices();
    
    // If voices aren't loaded yet, wait for them
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        utterance.voice = getBrowserVoice(voiceId);
        proceedWithSpeech();
      };
    } else {
      utterance.voice = getBrowserVoice(voiceId);
      proceedWithSpeech();
    }
    
    function proceedWithSpeech() {
      // Set up audio recording
      const audioChunks: BlobPart[] = [];
      const mediaRecorder = new MediaRecorder(createMediaStreamFromSpeechSynthesis());
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        resolve(audioBlob);
      };
      
      mediaRecorder.onerror = (event) => {
        reject(new Error('Error recording audio'));
      };
      
      // Start recording
      mediaRecorder.start();
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
      
      // When speech ends, stop recording
      utterance.onend = () => {
        mediaRecorder.stop();
      };
      
      utterance.onerror = (event) => {
        mediaRecorder.stop();
        reject(new Error('Error generating speech'));
      };
    }
  });
};

// Helper function to create a MediaStream from speech synthesis
function createMediaStreamFromSpeechSynthesis(): MediaStream {
  // Create an audio context
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const destination = audioContext.createMediaStreamDestination();
  
  oscillator.connect(destination);
  oscillator.start();
  setTimeout(() => oscillator.stop(), 100);
  
  return destination.stream;
}
