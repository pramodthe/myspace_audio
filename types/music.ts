export interface Track {
  id: string;
  title: string;
  artist: string;
  audioSrc: string;
  imageUrl: string;
}

export interface LyricsGenerationRequest {
  songName: string;
  description: string;
}

export interface MusicGenerationRequest {
  musicDetail: string;
  lyrics: string;
}