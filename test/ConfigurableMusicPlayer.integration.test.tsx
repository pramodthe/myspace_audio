import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfigurableMusicPlayer } from '../components/ConfigurableMusicPlayer';
import { Track } from '../types/music';

// Mock track data
const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Integration Test Song 1',
    artist: 'Test Artist',
    audioSrc: 'test-audio-1.mp3',
    imageUrl: 'test-image-1.jpg'
  },
  {
    id: '2',
    title: 'Integration Test Song 2',
    artist: 'Test Artist',
    audioSrc: 'test-audio-2.mp3',
    imageUrl: 'test-image-2.jpg'
  }
];

describe('ConfigurableMusicPlayer Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Theme Integration', () => {
    it('should apply theme consistently across all child components', () => {
      render(
        <ConfigurableMusicPlayer 
          theme="modern" 
          initialTracks={mockTracks}
        />
      );
      
      const container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-theme', 'modern');
      
      // Check that theme is passed to child components
      const playerUI = screen.getByRole('region', { name: /music player/i });
      expect(playerUI).toBeInTheDocument();
      
      // Verify playlist is rendered with theme context
      expect(screen.getAllByText('Integration Test Song 1')).toHaveLength(2);
    });

    it('should handle theme switching with existing playlist', async () => {
      const { rerender } = render(
        <ConfigurableMusicPlayer 
          theme="retro" 
          initialTracks={mockTracks}
        />
      );
      
      // Verify initial theme
      let container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-theme', 'retro');
      
      // Switch theme
      rerender(
        <ConfigurableMusicPlayer 
          theme="modern" 
          initialTracks={mockTracks}
        />
      );
      
      // Verify theme changed but playlist remains
      container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-theme', 'modern');
      expect(screen.getAllByText('Integration Test Song 1')).toHaveLength(2);
      expect(screen.getAllByText('Integration Test Song 2')).toHaveLength(1);
    });
  });

  describe('Size Variation Integration', () => {
    it('should apply size consistently across all child components', () => {
      render(
        <ConfigurableMusicPlayer 
          size="compact" 
          initialTracks={mockTracks}
        />
      );
      
      const container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-size', 'compact');
      
      // Verify components are rendered with size context
      expect(screen.getAllByText('Integration Test Song 1')).toHaveLength(2);
    });

    it('should show appropriate controls based on size', () => {
      const { rerender } = render(
        <ConfigurableMusicPlayer 
          size="full" 
          initialTracks={mockTracks}
        />
      );
      
      let container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-size', 'full');
      
      // Switch to compact
      rerender(
        <ConfigurableMusicPlayer 
          size="compact" 
          initialTracks={mockTracks}
        />
      );
      
      container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-size', 'compact');
    });
  });

  describe('Combined Theme and Size Integration', () => {
    it('should handle both theme and size props together', () => {
      render(
        <ConfigurableMusicPlayer 
          theme="modern" 
          size="compact" 
          initialTracks={mockTracks}
        />
      );
      
      const container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-theme', 'modern');
      expect(container).toHaveAttribute('data-size', 'compact');
    });

    it('should switch both theme and size simultaneously', () => {
      const { rerender } = render(
        <ConfigurableMusicPlayer 
          theme="retro" 
          size="full" 
          initialTracks={mockTracks}
        />
      );
      
      let container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-theme', 'retro');
      expect(container).toHaveAttribute('data-size', 'full');
      
      rerender(
        <ConfigurableMusicPlayer 
          theme="modern" 
          size="compact" 
          initialTracks={mockTracks}
        />
      );
      
      container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-theme', 'modern');
      expect(container).toHaveAttribute('data-size', 'compact');
    });
  });

  describe('Generator Integration with Themes and Sizes', () => {
    it('should handle generator functionality across different themes', async () => {
      const { rerender } = render(
        <ConfigurableMusicPlayer 
          theme="retro" 
          enableGenerator={true}
          maxPlaylistSize={3}
        />
      );
      
      // Generator button should be available
      expect(screen.getByText('Create a new Song')).toBeInTheDocument();
      
      // Switch theme
      rerender(
        <ConfigurableMusicPlayer 
          theme="modern" 
          enableGenerator={true}
          maxPlaylistSize={3}
        />
      );
      
      // Generator should still be available
      expect(screen.getByText('Create a new Song')).toBeInTheDocument();
    });

    it('should handle generator functionality across different sizes', () => {
      const { rerender } = render(
        <ConfigurableMusicPlayer 
          size="full" 
          enableGenerator={true}
        />
      );
      
      expect(screen.getByText('Create a new Song')).toBeInTheDocument();
      
      rerender(
        <ConfigurableMusicPlayer 
          size="compact" 
          enableGenerator={true}
        />
      );
      
      expect(screen.getByText('Create a new Song')).toBeInTheDocument();
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle errors gracefully across theme switches', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const faultyCallback = vi.fn().mockImplementation(() => {
        throw new Error('Integration test error');
      });
      
      const { rerender } = render(
        <ConfigurableMusicPlayer 
          theme="retro"
          initialTracks={mockTracks}
          onPlaylistChange={faultyCallback}
        />
      );
      
      // Switch theme - should not break despite callback error
      rerender(
        <ConfigurableMusicPlayer 
          theme="modern"
          initialTracks={mockTracks}
          onPlaylistChange={faultyCallback}
        />
      );
      
      // Component should still be functional
      expect(screen.getAllByText('Integration Test Song 1')).toHaveLength(2);
      
      consoleErrorSpy.mockRestore();
    });

    it('should maintain functionality when switching between valid and invalid props', () => {
      const { rerender } = render(
        <ConfigurableMusicPlayer 
          theme="retro"
          size="full"
          maxPlaylistSize={5}
        />
      );
      
      // Switch to invalid props
      rerender(
        <ConfigurableMusicPlayer 
          theme={'invalid' as any}
          size={'invalid' as any}
          maxPlaylistSize={-1}
        />
      );
      
      // Should fallback to defaults and remain functional
      const container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-theme', 'retro');
      expect(container).toHaveAttribute('data-size', 'full');
    });
  });

  describe('Complex Prop Combinations', () => {
    it('should handle all props together correctly', () => {
      const onPlaylistChange = vi.fn();
      const onCurrentTrackChange = vi.fn();
      const onPlayStateChange = vi.fn();
      
      render(
        <ConfigurableMusicPlayer 
          maxPlaylistSize={2}
          initialTracks={mockTracks}
          enableGenerator={false}
          theme="modern"
          size="compact"
          onPlaylistChange={onPlaylistChange}
          onCurrentTrackChange={onCurrentTrackChange}
          onPlayStateChange={onPlayStateChange}
          className="test-class"
          style={{ width: '400px' }}
        />
      );
      
      const container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-theme', 'modern');
      expect(container).toHaveAttribute('data-size', 'compact');
      expect(container).toHaveClass('configurable-music-player', 'test-class');
      expect(container).toHaveStyle('width: 400px');
      
      // Should only show 2 tracks due to maxPlaylistSize
      expect(screen.getAllByText('Integration Test Song 1')).toHaveLength(2);
      expect(screen.getAllByText('Integration Test Song 2')).toHaveLength(1);
      
      // Generator should be disabled
      expect(screen.queryByText('Create a new Song')).not.toBeInTheDocument();
    });

    it('should handle dynamic prop changes with complex state', async () => {
      const { rerender } = render(
        <ConfigurableMusicPlayer 
          maxPlaylistSize={3}
          initialTracks={[mockTracks[0]]}
          enableGenerator={true}
          theme="retro"
          size="full"
        />
      );
      
      // Initial state - generator should show because playlist is not full (1/3)
      let container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-theme', 'retro');
      expect(container).toHaveAttribute('data-size', 'full');
      expect(screen.getByText('Create a new Song')).toBeInTheDocument();
      
      // Change multiple props
      rerender(
        <ConfigurableMusicPlayer 
          maxPlaylistSize={3}
          initialTracks={mockTracks}
          enableGenerator={false}
          theme="modern"
          size="compact"
        />
      );
      
      container = screen.getByTestId('music-player-container');
      expect(container).toHaveAttribute('data-theme', 'modern');
      expect(container).toHaveAttribute('data-size', 'compact');
      expect(screen.queryByText('Create a new Song')).not.toBeInTheDocument();
      
      // Should now show more tracks
      expect(screen.getAllByText('Integration Test Song 1')).toHaveLength(2);
      expect(screen.getAllByText('Integration Test Song 2')).toHaveLength(1);
    });
  });
});