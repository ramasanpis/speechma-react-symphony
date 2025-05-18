
// API service for text-to-speech conversion

/**
 * Convert text to speech using a backend service
 */
export const convertTextToSpeechAPI = async (text: string, voiceId: string): Promise<Blob> => {
  try {
    const response = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voiceId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${await response.text()}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error calling TTS API:', error);
    throw error;
  }
};
