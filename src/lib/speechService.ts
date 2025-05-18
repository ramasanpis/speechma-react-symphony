
import { Voice } from '../types';
import { convertTextToSpeechAPI } from './apiService';

export const availableVoices: Voice[] = [
  { id: 'en-US-GuyNeural', name: 'Guy', accent: 'US', gender: 'male' },
  { id: 'en-US-JennyNeural', name: 'Jenny', accent: 'US', gender: 'female' },
  { id: 'en-GB-RyanNeural', name: 'Ryan', accent: 'GB', gender: 'male' },
  { id: 'en-IN-NeerjaNeural', name: 'Neerja', accent: 'IN', gender: 'female' },
];

// Use the backend API only
export const convertTextToSpeech = async (text: string, voiceId: string): Promise<Blob> => {
  try {
    return await convertTextToSpeechAPI(text, voiceId);
  } catch (error) {
    console.error("Backend TTS service failed:", error);
    throw error;
  }
};
