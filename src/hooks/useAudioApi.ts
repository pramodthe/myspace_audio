import { useState, useEffect, useCallback } from 'react';
import { 
  audioApi, 
  AudioFile, 
  AudioDetails, 
  AudioStats, 
  AudioApiError,
  LyricsGenerationRequest,
  LyricsResponse,
  LyricsThemesResponse
} from '../services/audioApi';
import { Track } from '../components/MusicPlayer/types';

export interface UseAudioApiReturn {
  // State
  audioFiles: AudioFile[];
  audioStats: AudioStats | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  refreshFiles: () => Promise<void>;
  refreshStats: () => Promise<void>;
  generateAudio: (musicDetail: string, lyrics: string) => Promise<AudioFile>;
  deleteAudio: (fileId: string) => Promise<void>;
  getAudioDetails: (fileId: string) => Promise<AudioDetails>;
  convertToTrack: (audioFile: AudioFile, title?: string, artist?: string) => Track;
  clearError: () => void;
  
  // Lyrics functionality
  generateLyrics: (topic: string, description: string) => Promise<LyricsResponse>;
  getLyricsThemes: (genre?: string) => Promise<string[]>;
}

export const useAudioApi = (): UseAudioApiReturn => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [audioStats, setAudioStats] = useState<AudioStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: unknown, defaultMessage: string) => {
    console.error(defaultMessage, err);
    
    if (err instanceof AudioApiError) {
      setError(err.message);
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError(defaultMessage);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const files = await audioApi.getAudioFiles();
      setAudioFiles(files);
    } catch (err) {
      handleError(err, 'Failed to fetch audio files');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const refreshStats = useCallback(async () => {
    try {
      const stats = await audioApi.getAudioStats();
      setAudioStats(stats);
    } catch (err) {
      handleError(err, 'Failed to fetch audio stats');
    }
  }, [handleError]);

  const generateAudio = useCallback(async (musicDetail: string, lyrics: string): Promise<AudioFile> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const audioFile = await audioApi.generateAudio({
        prompt: musicDetail,
        lyrics
      });
      
      // Refresh the files list to include the new file
      await refreshFiles();
      
      return audioFile;
    } catch (err) {
      handleError(err, 'Failed to generate audio');
      throw err; // Re-throw so caller can handle it
    } finally {
      setIsLoading(false);
    }
  }, [handleError, refreshFiles]);

  const deleteAudio = useCallback(async (fileId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await audioApi.deleteAudio(fileId);
      
      // Remove from local state
      setAudioFiles(prev => prev.filter(file => file.file_id !== fileId));
      
      // Refresh stats
      await refreshStats();
    } catch (err) {
      handleError(err, 'Failed to delete audio file');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, refreshStats]);

  const getAudioDetails = useCallback(async (fileId: string): Promise<AudioDetails> => {
    try {
      return await audioApi.getAudioDetails(fileId);
    } catch (err) {
      handleError(err, 'Failed to get audio details');
      throw err;
    }
  }, [handleError]);

  const convertToTrack = useCallback((
    audioFile: AudioFile, 
    title?: string, 
    artist?: string
  ): Track => {
    return {
      id: audioFile.file_id,
      fileId: audioFile.file_id,
      title: title || `Generated Song ${audioFile.id}`,
      artist: artist || 'AI Generated',
      audioSrc: audioApi.getAudioUrl(audioFile.file_id),
      imageUrl: `https://picsum.photos/seed/${audioFile.file_id}/500/500`,
      duration: audioFile.duration,
      createdAt: audioFile.created_at
    };
  }, []);

  // Load initial data
  useEffect(() => {
    refreshFiles();
    refreshStats();
  }, [refreshFiles, refreshStats]);

  const generateLyrics = useCallback(async (topic: string, description: string): Promise<LyricsResponse> => {
    try {
      setError(null);
      
      const response = await audioApi.generateLyrics({
        topic,
        description
      });
      
      return response;
    } catch (err) {
      handleError(err, 'Failed to generate lyrics');
      throw err;
    }
  }, [handleError]);

  const getLyricsThemes = useCallback(async (genre?: string): Promise<string[]> => {
    try {
      const response = await audioApi.getLyricsThemes(genre);
      return response.themes;
    } catch (err) {
      handleError(err, 'Failed to get lyrics themes');
      // Return fallback themes
      return [
        'Love and relationships',
        'Dreams and aspirations',
        'Overcoming challenges',
        'Friendship and loyalty',
        'Adventure and exploration',
        'Self-discovery',
        'Nostalgia and memories',
        'Hope and inspiration'
      ];
    }
  }, [handleError]);

  return {
    audioFiles,
    audioStats,
    isLoading,
    error,
    refreshFiles,
    refreshStats,
    generateAudio,
    deleteAudio,
    getAudioDetails,
    convertToTrack,
    clearError,
    generateLyrics,
    getLyricsThemes
  };
};