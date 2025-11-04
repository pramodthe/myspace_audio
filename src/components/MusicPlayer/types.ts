export interface Track {
  id: string;
  title: string;
  artist: string;
  audioSrc: string;
  imageUrl: string;
  fileId?: string; // Backend file ID for API-generated tracks
  duration?: number;
  createdAt?: string;
}

export interface LyricsGenerationRequest {
  songName: string;
  description: string;
}

export interface MusicGenerationRequest {
  musicDetail: string;
  lyrics: string;
}

export interface GenerationStatus {
  isGenerating: boolean;
  progress?: number;
  message?: string;
  error?: string;
}