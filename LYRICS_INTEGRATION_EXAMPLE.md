# Lyrics API Integration Examples

This document provides examples of how to use the lyrics generation API in your frontend application.

## Basic Usage

### 1. Using the useAudioApi Hook

```typescript
import { useAudioApi } from '../hooks/useAudioApi';

function MyComponent() {
  const { generateLyrics, getLyricsThemes, error } = useAudioApi();

  const handleGenerateLyrics = async () => {
    try {
      const response = await generateLyrics(
        'Summer romance', 
        'Upbeat pop song about falling in love during summer vacation'
      );
      
      console.log('Generated lyrics:', response.lyrics);
      console.log('Word count:', response.word_count);
    } catch (error) {
      console.error('Failed to generate lyrics:', error);
    }
  };

  const handleGetThemes = async () => {
    try {
      const themes = await getLyricsThemes('pop');
      console.log('Suggested themes:', themes);
    } catch (error) {
      console.error('Failed to get themes:', error);
    }
  };

  return (
    <div>
      <button onClick={handleGenerateLyrics}>Generate Lyrics</button>
      <button onClick={handleGetThemes}>Get Theme Ideas</button>
      {error && <div>Error: {error}</div>}
    </div>
  );
}
```

### 2. Direct API Service Usage

```typescript
import { audioApi } from '../services/audioApi';

// Generate lyrics
const generateSongLyrics = async () => {
  try {
    const response = await audioApi.generateLyrics({
      topic: 'Overcoming challenges',
      description: 'Inspirational rock song about perseverance'
    });

    if (response.success) {
      return {
        lyrics: response.lyrics,
        wordCount: response.word_count,
        characterCount: response.character_count
      };
    }
  } catch (error) {
    console.error('Lyrics generation failed:', error);
    throw error;
  }
};

// Get theme suggestions
const getThemeIdeas = async (genre = '') => {
  try {
    const response = await audioApi.getLyricsThemes(genre);
    return response.themes;
  } catch (error) {
    console.error('Failed to get themes:', error);
    return [];
  }
};
```

## Complete Workflow: Lyrics → Audio

### Generate Complete Song

```typescript
import { audioApi } from '../services/audioApi';
import { Track } from '../components/MusicPlayer/types';

const createCompleteSong = async (
  songTopic: string,
  musicDescription: string,
  songTitle: string
): Promise<Track> => {
  try {
    // Step 1: Generate lyrics
    console.log('Generating lyrics...');
    const lyricsResponse = await audioApi.generateLyrics({
      topic: songTopic,
      description: musicDescription
    });

    if (!lyricsResponse.success) {
      throw new Error('Failed to generate lyrics');
    }

    // Step 2: Generate audio from lyrics
    console.log('Generating audio...');
    const audioResponse = await audioApi.generateAudio({
      prompt: musicDescription,
      lyrics: lyricsResponse.lyrics
    });

    // Step 3: Create track object
    const track: Track = {
      id: audioResponse.file_id,
      fileId: audioResponse.file_id,
      title: songTitle,
      artist: 'AI Generated',
      audioSrc: audioApi.getAudioUrl(audioResponse.file_id),
      imageUrl: `https://picsum.photos/seed/${audioResponse.file_id}/500/500`,
      duration: audioResponse.audio_data?.duration,
      createdAt: audioResponse.audio_data?.created_at
    };

    return track;

  } catch (error) {
    console.error('Song creation failed:', error);
    throw error;
  }
};

// Usage
const handleCreateSong = async () => {
  try {
    const track = await createCompleteSong(
      'Dreams and aspirations',
      'Uplifting pop song with electronic beats, 120 BPM',
      'Reach for the Stars'
    );
    
    console.log('Song created successfully:', track);
    // Add to playlist or play immediately
  } catch (error) {
    console.error('Failed to create song:', error);
  }
};
```

## React Component Examples

### Lyrics Generator with Theme Suggestions

```typescript
import React, { useState } from 'react';
import { useAudioApi } from '../hooks/useAudioApi';

const LyricsGeneratorExample: React.FC = () => {
  const { generateLyrics, getLyricsThemes } = useAudioApi();
  const [topic, setTopic] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [themes, setThemes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateLyrics = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    try {
      const response = await generateLyrics(topic, '');
      setLyrics(response.lyrics);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetThemes = async () => {
    try {
      const themeList = await getLyricsThemes();
      setThemes(themeList);
    } catch (error) {
      console.error('Failed to get themes:', error);
    }
  };

  return (
    <div>
      <div>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter song topic..."
        />
        <button onClick={handleGetThemes}>Get Ideas</button>
        <button onClick={handleGenerateLyrics} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Lyrics'}
        </button>
      </div>

      {themes.length > 0 && (
        <div>
          <h3>Theme Suggestions:</h3>
          {themes.map((theme, index) => (
            <button
              key={index}
              onClick={() => setTopic(theme)}
              style={{ margin: '4px', padding: '8px' }}
            >
              {theme}
            </button>
          ))}
        </div>
      )}

      {lyrics && (
        <div>
          <h3>Generated Lyrics:</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{lyrics}</pre>
        </div>
      )}
    </div>
  );
};
```

### Integration with Music Player

```typescript
import React, { useState } from 'react';
import { useAudioApi } from '../hooks/useAudioApi';
import { Track } from '../components/MusicPlayer/types';

const SongCreator: React.FC<{ onSongCreated: (track: Track) => void }> = ({ 
  onSongCreated 
}) => {
  const { generateLyrics, generateAudio } = useAudioApi();
  const [songTitle, setSongTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSong = async () => {
    if (!songTitle || !topic || !description) return;

    setIsCreating(true);
    try {
      // Generate lyrics
      const lyricsResponse = await generateLyrics(topic, description);
      
      // Generate audio
      const audioFile = await generateAudio(description, lyricsResponse.lyrics);
      
      // Create track
      const track: Track = {
        id: audioFile.id,
        fileId: audioFile.id,
        title: songTitle,
        artist: 'AI Generated',
        audioSrc: `http://localhost:8000/download-audio/${audioFile.id}`,
        imageUrl: `https://picsum.photos/seed/${audioFile.id}/500/500`,
        duration: audioFile.duration,
        createdAt: audioFile.created_at
      };

      onSongCreated(track);
      
      // Reset form
      setSongTitle('');
      setTopic('');
      setDescription('');
      
    } catch (error) {
      console.error('Song creation failed:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <input
        value={songTitle}
        onChange={(e) => setSongTitle(e.target.value)}
        placeholder="Song title..."
      />
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Song topic..."
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Music description..."
      />
      <button onClick={handleCreateSong} disabled={isCreating}>
        {isCreating ? 'Creating Song...' : 'Create Song'}
      </button>
    </div>
  );
};
```

## Error Handling

### Comprehensive Error Handling

```typescript
import { AudioApiError } from '../services/audioApi';

const handleLyricsGeneration = async (topic: string, description: string) => {
  try {
    const response = await audioApi.generateLyrics({ topic, description });
    return response;
  } catch (error) {
    if (error instanceof AudioApiError) {
      // Handle specific API errors
      switch (error.status) {
        case 400:
          console.error('Invalid request parameters:', error.message);
          break;
        case 500:
          if (error.message.includes('GEMINI_API_KEY')) {
            console.error('Gemini API key not configured');
          } else {
            console.error('Server error:', error.message);
          }
          break;
        default:
          console.error('API error:', error.message);
      }
    } else {
      // Handle network or other errors
      console.error('Network or unknown error:', error);
    }
    
    // Provide fallback or user-friendly error message
    throw new Error('Failed to generate lyrics. Please try again.');
  }
};
```

## Environment Configuration

### Setting up API URL

```typescript
// .env file
VITE_API_BASE_URL=http://localhost:8000

// Or for production
VITE_API_BASE_URL=https://your-api-domain.com
```

### Using Environment Variables

```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  TIMEOUT: 30000,
} as const;
```

This integration provides a complete lyrics generation workflow that seamlessly connects with your audio generation pipeline!