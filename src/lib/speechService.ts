
import { Voice } from '../types';

export const availableVoices: Voice[] = [
  { id: 'en-US-GuyNeural', name: 'Guy', accent: 'US', gender: 'male' },
  { id: 'en-US-JennyNeural', name: 'Jenny', accent: 'US', gender: 'female' },
  { id: 'en-GB-RyanNeural', name: 'Ryan', accent: 'GB', gender: 'male' },
  { id: 'en-IN-NeerjaNeural', name: 'Neerja', accent: 'IN', gender: 'female' },
];

export const convertTextToSpeech = async (text: string, voice: string): Promise<Blob> => {
  // This is a mock implementation, as the actual implementation would require
  // setting up a backend service similar to the provided Node.js code
  // In a real application, this would call your backend API
  
  // Simulate network delay for demonstration purposes
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // For now, we'll throw an error to indicate this needs a backend implementation
  throw new Error("Backend service required for text-to-speech conversion");
  
  // The actual implementation would look something like:
  // const formData = new FormData();
  // formData.append('text', text);
  // formData.append('voice', voice);
  // const response = await fetch('/api/generate', {
  //   method: 'POST',
  //   body: formData,
  // });
  // if (!response.ok) {
  //   throw new Error('Failed to generate speech');
  // }
  // return await response.blob();
};
