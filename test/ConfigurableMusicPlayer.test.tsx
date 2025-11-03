import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConfigurableMusicPlayer, ConfigurableMusicPlayerProps } from '../components/ConfigurableMusicPlayer';
import { Track } from '../types/music';

// Mock track data for testing
const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Test Song 1',
    artist: 'Test Artist 1',
    audioSrc: 'test-audio-1.mp3',
    imageUrl: 'test-image-1.jpg'
  },
  {
    id: '2',
    title: 'Test Song 2',
    artist: 'Test Artist 2',
    audioSrc: 'test-audio-2.mp3',
    imageUrl: 'test-image-2.jpg'
  },
  {
    id: '3',
    title: 'Test Song 3',
    artist: 'Test Artist 3',
    audioSrc: 'test-audio-3.mp3',
    imageUrl: 'test-image-3.jpg'
  }
];

describe('ConfigurableMusicPlayer', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('Prop Validation and Defaults', () => {
    it('should render with default props when no props provided', () => {
      render(<ConfigurableMusicPlayer />);
      
      // Should render the main container
      expect(screen.getByRole('region', { name: /music player/i })).toBeInTheDocument();
      
      // Should have default theme and size attributes
      const container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-theme', 'retro');
      expect(container).toHaveAttribute('data-size', 'full');
    });

    it('should validate and warn about invalid maxPlaylistSize', () => {
      render(<ConfigurableMusicPlayer maxPlaylistSize={-1} />);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'ConfigurableMusicPlayer: maxPlaylistSize must be a positive integer, using default value'
      );
    });

    it('should validate and warn about invalid initialTracks', () => {
      render(<ConfigurableMusicPlayer initialTracks={'invalid' as any} />);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'ConfigurableMusicPlayer: initialTracks must be an array, using empty array'
      );
    });

    it('should validate and warn about invalid theme', () => {
      render(<ConfigurableMusicPlayer theme={'invalid' as any} />);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'ConfigurableMusicPlayer: theme must be "retro" or "modern", using default "retro"'
      );
    });

    it('should validate and warn about invalid size', () => {
      render(<ConfigurableMusicPlayer size={'invalid' as any} />);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'ConfigurableMusicPlayer: size must be "compact" or "full", using default "full"'
      );
    });

    it('should filter out invalid tracks from initialTracks', () => {
      const invalidTracks = [
        mockTracks[0], // valid
        { id: '2', title: 'Missing audioSrc', artist: 'Test', imageUrl: 'test.jpg' }, // invalid - missing audioSrc
        { title: 'Missing id', audioSrc: 'test.mp3', artist: 'Test', imageUrl: 'test.jpg' }, // invalid - missing id
        mockTracks[1] // valid
      ];

      render(<ConfigurableMusicPlayer initialTracks={invalidTracks as Track[]} />);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'ConfigurableMusicPlayer: Some initial tracks were invalid and have been filtered out'
      );
      
      // Should only show valid tracks in playlist
      expect(screen.getAllByText('Test Song 1')).toHaveLength(2); // Appears in both player and playlist
      expect(screen.getAllByText('Test Song 2')).toHaveLength(1); // Only appears in playlist (not current track)
      expect(screen.queryByText('Missing audioSrc')).not.toBeInTheDocument();
    });

    it('should respect maxPlaylistSize for initialTracks', () => {
      render(
        <ConfigurableMusicPlayer 
          maxPlaylistSize={2} 
          initialTracks={mockTracks} 
        />
      );
      
      // Should only show first 2 tracks
      expect(screen.getAllByText('Test Song 1')).toHaveLength(2); // Appears in both player and playlist
      expect(screen.getAllByText('Test Song 2')).toHaveLength(1); // Only appears in playlist (not current track)
      expect(screen.queryByText('Test Song 3')).not.toBeInTheDocument();
    });
  });

  describe('Theme System', () => {
    it('should apply retro theme correctly', () => {
      render(<ConfigurableMusicPlayer theme="retro" />);
      
      const container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-theme', 'retro');
    });

    it('should apply modern theme correctly', () => {
      render(<ConfigurableMusicPlayer theme="modern" />);
      
      const container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-theme', 'modern');
    });

    it('should switch themes dynamically', () => {
      const { rerender } = render(<ConfigurableMusicPlayer theme="retro" />);
      
      let container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-theme', 'retro');
      
      rerender(<ConfigurableMusicPlayer theme="modern" />);
      
      container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-theme', 'modern');
    });
  });

  describe('Size Variations', () => {
    it('should apply full size correctly', () => {
      render(<ConfigurableMusicPlayer size="full" />);
      
      const container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-size', 'full');
    });

    it('should apply compact size correctly', () => {
      render(<ConfigurableMusicPlayer size="compact" />);
      
      const container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-size', 'compact');
    });

    it('should switch sizes dynamically', () => {
      const { rerender } = render(<ConfigurableMusicPlayer size="full" />);
      
      let container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-size', 'full');
      
      rerender(<ConfigurableMusicPlayer size="compact" />);
      
      container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-size', 'compact');
    });
  });

  describe('Callback System', () => {
    it('should call onPlaylistChange when initial tracks are loaded', async () => {
      const onPlaylistChange = vi.fn();
      
      render(
        <ConfigurableMusicPlayer 
          initialTracks={[mockTracks[0]]} 
          onPlaylistChange={onPlaylistChange}
        />
      );
      
      await waitFor(() => {
        expect(onPlaylistChange).toHaveBeenCalledWith([mockTracks[0]]);
      });
    });

    it('should call onCurrentTrackChange when initial tracks are loaded', async () => {
      const onCurrentTrackChange = vi.fn();
      
      render(
        <ConfigurableMusicPlayer 
          initialTracks={[mockTracks[0]]} 
          onCurrentTrackChange={onCurrentTrackChange}
        />
      );
      
      await waitFor(() => {
        expect(onCurrentTrackChange).toHaveBeenCalledWith(mockTracks[0], 0);
      });
    });

    it('should handle callback errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const faultyCallback = vi.fn().mockImplementation(() => {
        throw new Error('Callback error');
      });
      
      render(
        <ConfigurableMusicPlayer 
          initialTracks={[mockTracks[0]]} 
          onPlaylistChange={faultyCallback}
        />
      );
      
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'ConfigurableMusicPlayer: Callback error:',
          expect.any(Error)
        );
      });
      
      consoleErrorSpy.mockRestore();
    });

    it('should not call callbacks when they are not provided', () => {
      // This test ensures no errors occur when callbacks are undefined
      expect(() => {
        render(<ConfigurableMusicPlayer initialTracks={[mockTracks[0]]} />);
      }).not.toThrow();
    });
  });

  describe('Generator Functionality', () => {
    it('should show generator button when enableGenerator is true', () => {
      render(<ConfigurableMusicPlayer enableGenerator={true} />);
      
      expect(screen.getByText('Create a new Song')).toBeInTheDocument();
    });

    it('should hide generator button when enableGenerator is false', () => {
      render(<ConfigurableMusicPlayer enableGenerator={false} />);
      
      expect(screen.queryByText('Create a new Song')).not.toBeInTheDocument();
    });

    it('should not render GeneratorModal when enableGenerator is false', () => {
      render(<ConfigurableMusicPlayer enableGenerator={false} />);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should default to enableGenerator true when not specified', () => {
      render(<ConfigurableMusicPlayer />);
      
      expect(screen.getByText('Create a new Song')).toBeInTheDocument();
    });
  });

  describe('Playlist Size Management', () => {
    it('should enforce maxPlaylistSize limit', () => {
      const manyTracks = Array.from({ length: 10 }, (_, i) => ({
        id: `track-${i}`,
        title: `Track ${i}`,
        artist: `Artist ${i}`,
        audioSrc: `audio-${i}.mp3`,
        imageUrl: `image-${i}.jpg`
      }));

      render(
        <ConfigurableMusicPlayer 
          maxPlaylistSize={3} 
          initialTracks={manyTracks} 
        />
      );
      
      // Should only show first 3 tracks in playlist
      const playlistItems = screen.getAllByText(/Track \d/);
      expect(playlistItems).toHaveLength(4); // 1 in player + 3 in playlist = 4 total
      expect(screen.getAllByText('Track 0')).toHaveLength(2); // Player + playlist
      expect(screen.getAllByText('Track 1')).toHaveLength(1); // Only in playlist
      expect(screen.getAllByText('Track 2')).toHaveLength(1); // Only in playlist
      expect(screen.queryByText('Track 3')).not.toBeInTheDocument();
    });

    it('should default to 5 tracks when maxPlaylistSize not provided', () => {
      const manyTracks = Array.from({ length: 10 }, (_, i) => ({
        id: `track-${i}`,
        title: `Track ${i}`,
        artist: `Artist ${i}`,
        audioSrc: `audio-${i}.mp3`,
        imageUrl: `image-${i}.jpg`
      }));

      render(<ConfigurableMusicPlayer initialTracks={manyTracks} />);
      
      // Should show first 5 tracks (default limit)
      const playlistItems = screen.getAllByText(/Track \d/);
      expect(playlistItems).toHaveLength(6); // 1 in player + 5 in playlist = 6 total
      expect(screen.getAllByText('Track 0')).toHaveLength(2); // Player + playlist
      expect(screen.getAllByText('Track 4')).toHaveLength(1); // Only in playlist
      expect(screen.queryByText('Track 5')).not.toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(<ConfigurableMusicPlayer className="custom-class" />);
      
      const container = screen.getByTestId('music-player-container');
      expect(container).toHaveClass('configurable-music-player', 'custom-class');
    });

    it('should apply custom styles', () => {
      const customStyle = { backgroundColor: 'red', width: '500px' };
      
      render(<ConfigurableMusicPlayer style={customStyle} />);
      
      const container = screen.getByTestId('music-player-container');
      expect(container).toHaveStyle('background-color: rgb(255, 0, 0)');
      expect(container).toHaveStyle('width: 500px');
    });
  });
});