# Audio API Integration

This document describes the API integration for the AI MusicBox frontend application.

## Backend API Endpoints

The frontend integrates with the following backend endpoints running on `http://localhost:8000`:

### Lyrics Generation
- **POST** `/generate-lyrics` - Generate song lyrics using AI
- **GET** `/lyrics-themes` - Get suggested themes for lyrics generation

### Audio Generation
- **POST** `/generate-audio` - Generate new audio from music details and lyrics
- **GET** `/audio-files` - Get list of all generated audio files
- **GET** `/audio-details/{file_id}` - Get detailed information about a specific audio file
- **GET** `/download-audio/{file_id}` - Download or stream an audio file
- **DELETE** `/delete-audio/{file_id}` - Delete an audio file
- **GET** `/audio-stats` - Get statistics about audio files

## Frontend Implementation

### API Service (`src/services/audioApi.ts`)
- Centralized API client with error handling
- TypeScript interfaces for all API responses
- Singleton instance exported as `audioApi`

### Custom Hook (`src/hooks/useAudioApi.ts`)
- React hook for managing audio API state
- Provides loading states, error handling, and data management
- Automatic refresh capabilities

### Components

#### LyricsGenerator (`src/components/LyricsGenerator.tsx`)
- Standalone lyrics generation interface
- AI-powered lyrics creation with theme suggestions
- Copy and clear functionality for generated lyrics
- Word and character count display

#### AudioLibrary (`src/components/AudioLibrary.tsx`)
- Displays all generated audio files
- Allows playing tracks and deleting files
- Shows file metadata (size, duration, creation date)

#### GeneratorModal (Updated)
- Now uses real lyrics API instead of demo data
- Integrated theme suggestions for song topics
- Handles generation errors and loading states
- Creates tracks with proper backend file IDs

#### ErrorBoundary (`src/components/ErrorBoundary.tsx`)
- Catches and displays React errors gracefully
- Provides retry functionality

## Usage

### Starting the Application

1. Make sure the backend is running on `http://localhost:8000`
2. Start the frontend development server:
   ```bash
   cd myspace_frontend
   npm run dev
   ```

### Features

1. **Lyrics Generation**: Standalone AI-powered lyrics generator with theme suggestions
2. **Music Generation**: Use the "Create a Song" modal to generate new audio with AI lyrics
3. **Audio Library**: View and manage all generated audio files
4. **Playlist Integration**: Add library tracks to the music player
5. **Theme Suggestions**: Get AI-generated topic ideas for lyrics
6. **Error Handling**: Graceful error handling for API failures

### API Error Handling

The application handles various error scenarios:
- Network connectivity issues
- Backend server errors
- Invalid API responses
- File not found errors

Errors are displayed to users with clear messages and retry options.

## Development Notes

- The API base URL is configurable in `src/services/audioApi.ts`
- All API calls include proper TypeScript typing
- The application works offline with demo tracks when the API is unavailable
- CORS must be properly configured on the backend for cross-origin requests