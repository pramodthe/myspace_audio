import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface AudioGenerationRequest {
  prompt: string;
  lyrics: string;
  model?: string;
}

export interface LyricsGenerationRequest {
  topic: string;
  description: string;
}

export interface LyricsResponse {
  success: boolean;
  message: string;
  lyrics: string;
  word_count: number;
  character_count: number;
}

export interface LyricsThemesResponse {
  success: boolean;
  message: string;
  themes: string[];
}

export interface AudioFile {
  id: number;
  file_id: string;
  lyrics: string;
  prompt: string;
  model: string;
  file_size: number;
  status: string;
  created_at: string;
  downloaded_count: number;
  duration?: number;
}

export interface AudioDetails extends AudioFile {
  metadata?: {
    title?: string;
    artist?: string;
    genre?: string;
    duration?: number;
  };
}

export interface AudioStats {
  total_files: number;
  total_size: number;
  average_duration?: number;
  recent_files: AudioFile[];
}

export class AudioApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'AudioApiError';
  }
}

class AudioApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new AudioApiError(
        `API Error: ${response.status} ${response.statusText} - ${errorText}`,
        response.status,
        response
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as unknown as T;
  }

  /**
   * Generate audio from music details and lyrics
   */
  async generateAudio(request: AudioGenerationRequest): Promise<AudioFile> {
    const response = await fetch(`${API_BASE_URL}/generate-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await this.handleResponse<{
      success: boolean;
      message: string;
      audio_url?: string;
      file_id?: string;
      audio_data?: AudioFile;
    }>(response);
    
    if (data.audio_data) {
      return data.audio_data;
    } else {
      // Fallback if audio_data is not provided
      throw new AudioApiError('Audio generation response missing audio_data');
    }
  }

  /**
   * Get list of all audio files
   */
  async getAudioFiles(): Promise<AudioFile[]> {
    const response = await fetch(`${API_BASE_URL}/audio-files`);
    const data = await this.handleResponse<{
      success: boolean;
      message: string;
      total: number;
      audio_files: AudioFile[];
    }>(response);
    return data.audio_files;
  }

  /**
   * Get detailed information about a specific audio file
   */
  async getAudioDetails(fileId: string): Promise<AudioDetails> {
    const response = await fetch(`${API_BASE_URL}/audio-details/${fileId}`);
    return this.handleResponse<AudioDetails>(response);
  }

  /**
   * Download audio file - returns blob for client-side handling
   */
  async downloadAudio(fileId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/download-audio/${fileId}`);
    
    if (!response.ok) {
      throw new AudioApiError(
        `Download failed: ${response.status} ${response.statusText}`,
        response.status,
        response
      );
    }

    return response.blob();
  }

  /**
   * Get download URL for audio file (for use in audio elements)
   */
  getAudioUrl(fileId: string): string {
    return `${API_BASE_URL}/download-audio/${fileId}`;
  }

  /**
   * Delete an audio file
   */
  async deleteAudio(fileId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/delete-audio/${fileId}`, {
      method: 'DELETE',
    });

    return this.handleResponse<{ message: string }>(response);
  }

  /**
   * Get audio statistics
   */
  async getAudioStats(): Promise<AudioStats> {
    const response = await fetch(`${API_BASE_URL}/audio-stats`);
    return this.handleResponse<AudioStats>(response);
  }

  /**
   * Generate lyrics using AI
   */
  async generateLyrics(request: LyricsGenerationRequest): Promise<LyricsResponse> {
    const response = await fetch(`${API_BASE_URL}/generate-lyrics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return this.handleResponse<LyricsResponse>(response);
  }

  /**
   * Get suggested themes for lyrics generation
   */
  async getLyricsThemes(genre?: string): Promise<LyricsThemesResponse> {
    const url = genre 
      ? `${API_BASE_URL}/lyrics-themes?genre=${encodeURIComponent(genre)}`
      : `${API_BASE_URL}/lyrics-themes`;
    
    const response = await fetch(url);
    return this.handleResponse<LyricsThemesResponse>(response);
  }
}

// Export singleton instance
export const audioApi = new AudioApiService();