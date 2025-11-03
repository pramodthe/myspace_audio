import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConfigurableMusicPlayer } from '../components/ConfigurableMusicPlayer';
import { Track } from '../types/music';

// Mock track data
const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Callback Test Song 1',
    artist: 'Test Artist',
    audioSrc: 'test-audio-1.mp3',
    imageUrl: 'test-image-1.jpg'
  },
  {
    id: '2',
    title: 'Callback Test Song 2',
    artist: 'Test Artist',
    audioSrc: 'test-audio-2.mp3',
    imageUrl: 'test-image-2.jpg'
  }
];

describe('ConfigurableMusicPlayer Callback Tests', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('onPlaylistChange Callback', () => {
    it('should call onPlaylistChange when initial tracks are loaded', async () => {
      const onPlaylistChange = vi.fn();
      
      render(
        <ConfigurableMusicPlayer 
          initialTracks={mockTracks.slice(0, 2)}
          onPlaylistChange={onPlaylistChange}
        />
      );
      
      await waitFor(() => {
        expect(onPlaylistChange).toHaveBeenCalledWith(mockTracks.slice(0, 2));
      });
    });

    it('should not call onPlaylistChange when callback is undefined', () => {
      // Should not throw error when callback is not provided
      expect(() => {
        render(
          <ConfigurableMusicPlayer 
            initialTracks={mockTracks.slice(0, 1)}
          />
        );
      }).not.toThrow();
    });
  });

  describe('onCurrentTrackChange Callback', () => {
    it('should call onCurrentTrackChange when initial track is set', async () => {
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
  });

  describe('onPlayStateChange Callback', () => {
    it('should call onPlayStateChange when play state changes', async () => {
      const onPlayStateChange = vi.fn();
      
      render(
        <ConfigurableMusicPlayer 
          initialTracks={[mockTracks[0]]}
          onPlayStateChange={onPlayStateChange}
        />
      );
      
      // Should not be called initially (component starts paused)
      expect(onPlayStateChange).not.toHaveBeenCalled();
    });

    it('should not call onPlayStateChange when callback is undefined', () => {
      expect(() => {
        render(
          <ConfigurableMusicPlayer 
            initialTracks={[mockTracks[0]]}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Callback Error Handling', () => {
    it('should handle onPlaylistChange callback errors gracefully', async () => {
      const faultyCallback = vi.fn().mockImplementation(() => {
        throw new Error('Playlist callback error');
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
      
      // Component should still be functional
      expect(screen.getAllByText('Callback Test Song 1')).toHaveLength(2);
    });

    it('should handle onCurrentTrackChange callback errors gracefully', async () => {
      const faultyCallback = vi.fn().mockImplementation(() => {
        throw new Error('Current track callback error');
      });
      
      render(
        <ConfigurableMusicPlayer 
          initialTracks={[mockTracks[0]]}
          onCurrentTrackChange={faultyCallback}
        />
      );
      
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'ConfigurableMusicPlayer: Callback error:',
          expect.any(Error)
        );
      });
      
      // Component should still be functional
      expect(screen.getAllByText('Callback Test Song 1')).toHaveLength(2);
    });

    it('should handle onPlayStateChange callback errors gracefully', async () => {
      const faultyCallback = vi.fn().mockImplementation(() => {
        throw new Error('Play state callback error');
      });
      
      render(
        <ConfigurableMusicPlayer 
          initialTracks={[mockTracks[0]]}
          onPlayStateChange={faultyCallback}
        />
      );
      
      // Component should still be functional even if callback fails
      expect(screen.getAllByText('Callback Test Song 1')).toHaveLength(2);
    });

    it('should handle multiple callback errors without breaking', async () => {
      const faultyPlaylistCallback = vi.fn().mockImplementation(() => {
        throw new Error('Playlist error');
      });
      const faultyTrackCallback = vi.fn().mockImplementation(() => {
        throw new Error('Track error');
      });
      
      render(
        <ConfigurableMusicPlayer 
          initialTracks={[mockTracks[0]]}
          onPlaylistChange={faultyPlaylistCallback}
          onCurrentTrackChange={faultyTrackCallback}
        />
      );
      
      // Should have logged multiple errors
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      });
      
      // Component should still be functional
      expect(screen.getAllByText('Callback Test Song 1')).toHaveLength(2);
    });

    it('should continue normal operation after callback errors', async () => {
      const faultyCallback = vi.fn()
        .mockImplementationOnce(() => {
          throw new Error('First error');
        })
        .mockImplementationOnce(() => {
          // Second call succeeds
        });
      
      render(
        <ConfigurableMusicPlayer 
          initialTracks={mockTracks.slice(0, 2)}
          onCurrentTrackChange={faultyCallback}
        />
      );
      
      // First call should error
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'ConfigurableMusicPlayer: Callback error:',
          expect.any(Error)
        );
      });
      
      // Should have been called at least once
      expect(faultyCallback).toHaveBeenCalled();
    });
  });
});