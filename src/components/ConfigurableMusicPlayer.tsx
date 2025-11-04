import React, { useState, useCallback, useEffect } from 'react';
import { Track } from './MusicPlayer/types';
import { ThemeName } from './MusicPlayer/themes';
import { MusicPlayerUI } from './MusicPlayer/MusicPlayerUI';
import { Playlist } from './MusicPlayer/Playlist';
import { GeneratorModal } from './MusicPlayer/GeneratorModal';

// Props interface with all configuration options
export interface ConfigurableMusicPlayerProps {
  // Playlist Configuration
  maxPlaylistSize?: number;
  initialTracks?: Track[];
  
  // Feature Toggles
  enableGenerator?: boolean;
  
  // Appearance
  theme?: ThemeName;
  size?: 'compact' | 'full';
  
  // Callbacks
  onPlaylistChange?: (playlist: Track[]) => void;
  onCurrentTrackChange?: (track: Track | null, index: number | null) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onTrackGenerated?: (track: Track) => void;
  
  // Optional Overrides
  className?: string;
  style?: React.CSSProperties;
}

// Internal state interface
interface MusicPlayerState {
  playlist: Track[];
  currentTrackIndex: number | null;
  isPlaying: boolean;
  isModalOpen: boolean;
}

// Default values for props
const DEFAULT_PROPS: Required<Omit<ConfigurableMusicPlayerProps, 'onPlaylistChange' | 'onCurrentTrackChange' | 'onPlayStateChange' | 'onTrackGenerated' | 'className' | 'style'>> = {
  maxPlaylistSize: 5,
  initialTracks: [],
  enableGenerator: true,
  theme: 'retro' as ThemeName,
  size: 'full'
};

// Prop validation functions
const validateProps = (props: ConfigurableMusicPlayerProps): void => {
  if (props.maxPlaylistSize !== undefined && (props.maxPlaylistSize <= 0 || !Number.isInteger(props.maxPlaylistSize))) {
    console.warn('ConfigurableMusicPlayer: maxPlaylistSize must be a positive integer, using default value');
  }
  
  if (props.initialTracks !== undefined && !Array.isArray(props.initialTracks)) {
    console.warn('ConfigurableMusicPlayer: initialTracks must be an array, using empty array');
  }
  
  if (props.theme !== undefined && !['retro', 'modern'].includes(props.theme)) {
    console.warn('ConfigurableMusicPlayer: theme must be "retro" or "modern", using default "retro"');
  }
  
  if (props.size !== undefined && !['compact', 'full'].includes(props.size)) {
    console.warn('ConfigurableMusicPlayer: size must be "compact" or "full", using default "full"');
  }
};

// Validate individual track structure
const validateTrack = (track: unknown): track is Track => {
  return (
    track !== null &&
    track !== undefined &&
    typeof track === 'object' &&
    'id' in track &&
    'title' in track &&
    'audioSrc' in track &&
    typeof (track as Track).id === 'string' &&
    typeof (track as Track).title === 'string' &&
    typeof (track as Track).audioSrc === 'string'
  );
};

export const ConfigurableMusicPlayer: React.FC<ConfigurableMusicPlayerProps> = (props) => {
  // Validate props on mount
  useEffect(() => {
    validateProps(props);
  }, [props]);

  // Merge props with defaults and validate
  const maxPlaylistSize = (props.maxPlaylistSize !== undefined && props.maxPlaylistSize > 0 && Number.isInteger(props.maxPlaylistSize)) 
    ? props.maxPlaylistSize 
    : DEFAULT_PROPS.maxPlaylistSize;
  
  const initialTracks = Array.isArray(props.initialTracks) 
    ? props.initialTracks 
    : DEFAULT_PROPS.initialTracks;
  
  const enableGenerator = props.enableGenerator !== undefined 
    ? props.enableGenerator 
    : DEFAULT_PROPS.enableGenerator;
  
  const theme = (props.theme !== undefined && ['retro', 'modern'].includes(props.theme)) 
    ? props.theme 
    : DEFAULT_PROPS.theme;
  
  const size = (props.size !== undefined && ['compact', 'full'].includes(props.size)) 
    ? props.size 
    : DEFAULT_PROPS.size;
  
  const {
    onPlaylistChange,
    onCurrentTrackChange,
    onPlayStateChange,
    onTrackGenerated,
    className,
    style
  } = props;

  // Validate and process initial tracks
  const processedInitialTracks = React.useMemo(() => {
    if (!Array.isArray(initialTracks)) {
      return [];
    }
    
    const validTracks = initialTracks.filter(validateTrack);
    if (validTracks.length !== initialTracks.length) {
      console.warn('ConfigurableMusicPlayer: Some initial tracks were invalid and have been filtered out');
    }
    
    // Respect maxPlaylistSize for initial tracks
    const validMaxSize = maxPlaylistSize > 0 && Number.isInteger(maxPlaylistSize) ? maxPlaylistSize : DEFAULT_PROPS.maxPlaylistSize;
    return validTracks.slice(0, validMaxSize);
  }, [initialTracks, maxPlaylistSize]);

  // State management
  const [state, setState] = useState<MusicPlayerState>(() => ({
    playlist: processedInitialTracks,
    currentTrackIndex: processedInitialTracks.length > 0 ? 0 : null,
    isPlaying: false,
    isModalOpen: false
  }));

  // Notify about initial playlist if provided
  useEffect(() => {
    if (processedInitialTracks.length > 0) {
      safeCallback(onPlaylistChange, processedInitialTracks);
      if (processedInitialTracks.length > 0) {
        safeCallback(onCurrentTrackChange, processedInitialTracks[0], 0);
      }
    }
  }, []); // Only run on mount

  // Computed values
  const validMaxSize = maxPlaylistSize > 0 && Number.isInteger(maxPlaylistSize) ? maxPlaylistSize : DEFAULT_PROPS.maxPlaylistSize;
  const isPlaylistFull = state.playlist.length >= validMaxSize;
  const currentTrack = state.currentTrackIndex !== null ? state.playlist[state.currentTrackIndex] : null;

  // Callback wrapper with error handling
  const safeCallback = useCallback((callback: Function | undefined, ...args: unknown[]) => {
    if (callback) {
      try {
        callback(...args);
      } catch (error) {
        console.error('ConfigurableMusicPlayer: Callback error:', error);
      }
    }
  }, []);

  // Update current track with callback notification
  const updateCurrentTrack = useCallback((index: number | null) => {
    setState((prev: MusicPlayerState) => ({ ...prev, currentTrackIndex: index }));
    const track = index !== null ? state.playlist[index] : null;
    safeCallback(onCurrentTrackChange, track, index);
  }, [onCurrentTrackChange, safeCallback, state.playlist]);

  // Update play state with callback notification
  const updatePlayState = useCallback((isPlaying: boolean) => {
    setState((prev: MusicPlayerState) => ({ ...prev, isPlaying }));
    safeCallback(onPlayStateChange, isPlaying);
  }, [onPlayStateChange, safeCallback]);

  // Event handlers
  const handleOpenModal = useCallback(() => {
    setState((prev: MusicPlayerState) => ({ ...prev, isModalOpen: true }));
  }, []);

  const handleCloseModal = useCallback(() => {
    setState((prev: MusicPlayerState) => ({ ...prev, isModalOpen: false }));
  }, []);

  const handleTrackGenerated = useCallback((newTrack: Track) => {
    if (isPlaylistFull) return;
    
    const newPlaylist = [...state.playlist, newTrack];
    const newIndex = newPlaylist.length - 1;
    
    setState((prev: MusicPlayerState) => ({
      ...prev,
      playlist: newPlaylist,
      currentTrackIndex: newIndex,
      isPlaying: true,
      isModalOpen: false
    }));
    
    safeCallback(onPlaylistChange, newPlaylist);
    safeCallback(onCurrentTrackChange, newTrack, newIndex);
    safeCallback(onPlayStateChange, true);
    safeCallback(onTrackGenerated, newTrack);
  }, [isPlaylistFull, state.playlist, onPlaylistChange, onCurrentTrackChange, onPlayStateChange, onTrackGenerated, safeCallback]);

  const handleRemoveTrack = useCallback((indexToRemove: number) => {
    if (indexToRemove < 0 || indexToRemove >= state.playlist.length) return;
    
    const newPlaylist = state.playlist.filter((_, index) => index !== indexToRemove);
    let newCurrentIndex = state.currentTrackIndex;
    
    // Adjust current track index after removal
    if (state.currentTrackIndex !== null) {
      if (state.currentTrackIndex === indexToRemove) {
        // If we're removing the current track, stop playing and clear selection
        newCurrentIndex = newPlaylist.length > 0 ? Math.min(state.currentTrackIndex, newPlaylist.length - 1) : null;
      } else if (state.currentTrackIndex > indexToRemove) {
        // If current track is after the removed track, shift index down
        newCurrentIndex = state.currentTrackIndex - 1;
      }
    }
    
    setState((prev: MusicPlayerState) => ({
      ...prev,
      playlist: newPlaylist,
      currentTrackIndex: newCurrentIndex,
      isPlaying: newCurrentIndex !== null ? prev.isPlaying : false
    }));
    
    safeCallback(onPlaylistChange, newPlaylist);
    
    // Notify about current track change if it changed
    if (newCurrentIndex !== state.currentTrackIndex) {
      const newCurrentTrack = newCurrentIndex !== null ? newPlaylist[newCurrentIndex] : null;
      safeCallback(onCurrentTrackChange, newCurrentTrack, newCurrentIndex);
    }
    
    // Notify about play state change if we stopped playing
    if (state.currentTrackIndex === indexToRemove && state.isPlaying) {
      safeCallback(onPlayStateChange, false);
    }
  }, [state.playlist, state.currentTrackIndex, state.isPlaying, onPlaylistChange, onCurrentTrackChange, onPlayStateChange, safeCallback]);

  const handlePlayPause = useCallback(() => {
    if (state.currentTrackIndex !== null) {
      const newPlayState = !state.isPlaying;
      updatePlayState(newPlayState);
    } else if (state.playlist.length > 0) {
      updateCurrentTrack(0);
      updatePlayState(true);
    }
  }, [state.currentTrackIndex, state.isPlaying, state.playlist.length, updatePlayState, updateCurrentTrack]);

  const handleTrackEnd = useCallback(() => {
    updatePlayState(false);
  }, [updatePlayState]);

  const handleSelectTrack = useCallback((index: number) => {
    if (state.playlist[index]?.audioSrc) {
      updateCurrentTrack(index);
      updatePlayState(true);
    }
  }, [state.playlist, updateCurrentTrack, updatePlayState]);

  // Container class and style
  const containerClass = className ? `configurable-music-player ${className}` : 'configurable-music-player';
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ...style
  };

  return (
    <div 
      className={containerClass} 
      style={containerStyle} 
      data-theme={theme} 
      data-size={size}
      data-testid="music-player-container"
      role="region"
      aria-label="Music Player"
    >
      <MusicPlayerUI
        currentTrack={currentTrack}
        isPlaying={state.isPlaying}
        onPlayPause={handlePlayPause}
        onEnded={handleTrackEnd}
        theme={theme}
        size={size}
      />
      <Playlist
        playlist={state.playlist}
        currentTrackIndex={state.currentTrackIndex}
        onSelectTrack={handleSelectTrack}
        onRemoveTrack={handleRemoveTrack}
        onOpenModal={enableGenerator ? handleOpenModal : undefined}
        isPlaylistFull={isPlaylistFull}
        maxPlaylistSize={validMaxSize}
      />
      {enableGenerator && (
        <GeneratorModal
          isOpen={state.isModalOpen}
          onClose={handleCloseModal}
          onTrackGenerated={handleTrackGenerated}
        />
      )}
    </div>
  );
};

export default ConfigurableMusicPlayer;