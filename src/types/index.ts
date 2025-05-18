
export interface Voice {
  id: string;
  name: string;
  accent: string;
  gender: 'male' | 'female';
}

export interface AudioState {
  url: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
}
