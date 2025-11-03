# Design Document

## Overview

The configurable music player will be created by refactoring the existing MySpaceMusicPlayer component to accept props that control its behavior, appearance, and functionality. This design maintains backward compatibility while adding flexibility for different use cases.

## Architecture

### Component Hierarchy
```
ConfigurableMusicPlayer (new main component)
├── MusicPlayerUI (existing, enhanced with theme support)
├── Playlist (existing, enhanced with size limits)
└── GeneratorModal (existing, conditionally rendered)
```

### Props Interface
```typescript
interface ConfigurableMusicPlayerProps {
  // Playlist Configuration
  maxPlaylistSize?: number;
  initialTracks?: Track[];
  
  // Feature Toggles
  enableGenerator?: boolean;
  
  // Appearance
  theme?: 'retro' | 'modern';
  size?: 'compact' | 'full';
  
  // Callbacks
  onPlaylistChange?: (playlist: Track[]) => void;
  onCurrentTrackChange?: (track: Track | null, index: number | null) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  
  // Optional Overrides
  className?: string;
  style?: React.CSSProperties;
}
```

## Components and Interfaces

### ConfigurableMusicPlayer Component

**Purpose**: Main wrapper component that manages state and configuration
**Key Features**:
- Accepts and validates props
- Manages playlist state with size limits
- Handles theme application
- Coordinates between child components

**State Management**:
```typescript
interface MusicPlayerState {
  playlist: Track[];
  currentTrackIndex: number | null;
  isPlaying: boolean;
  isModalOpen: boolean;
}
```

### Enhanced MusicPlayerUI

**Changes Required**:
- Add theme prop support for styling variations
- Add size prop for compact/full layouts
- Extract inline styles to theme-based CSS classes
- Support custom className and style overrides

**Theme Variations**:
- **Retro Theme**: Current MySpace-style with gradients and retro colors
- **Modern Theme**: Flat design with contemporary colors and clean lines

**Size Variations**:
- **Compact**: Minimal controls (play/pause, track info, volume)
- **Full**: All features (equalizer, detailed time, full volume controls)

### Enhanced Playlist Component

**Changes Required**:
- Accept maxPlaylistSize prop
- Show playlist capacity indicator
- Conditionally render "Add Track" button based on generator availability
- Display appropriate messages when limits are reached

### Conditional GeneratorModal

**Changes Required**:
- Only render when enableGenerator is true
- Maintain existing functionality when enabled
- Graceful degradation when disabled

## Data Models

### Track Interface (existing)
```typescript
interface Track {
  id: string;
  title: string;
  artist?: string;
  audioSrc: string;
  duration?: number;
}
```

### Theme Configuration
```typescript
interface ThemeConfig {
  name: 'retro' | 'modern';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  styles: {
    borderRadius: string;
    shadows: string;
    gradients: string[];
  };
}
```

## Error Handling

### Prop Validation
- Validate maxPlaylistSize is positive integer
- Validate initialTracks array structure
- Provide console warnings for invalid props
- Fallback to defaults for invalid values

### Runtime Error Handling
- Handle audio loading failures gracefully
- Manage playlist overflow scenarios
- Provide user feedback for generation failures
- Maintain player state consistency during errors

### Callback Error Handling
- Wrap callback invocations in try-catch blocks
- Log callback errors without breaking player functionality
- Continue normal operation if callbacks fail

## Testing Strategy

### Unit Tests
- Props validation and default handling
- State management with different configurations
- Theme switching functionality
- Playlist size limit enforcement
- Callback invocation verification

### Integration Tests
- Component interaction with different prop combinations
- Theme application across all child components
- Generator modal conditional rendering
- Playlist management with size limits

### Visual Regression Tests
- Theme appearance consistency
- Size variation layouts
- Responsive behavior across different configurations

## Implementation Approach

### Phase 1: Props Interface Setup
1. Create new ConfigurableMusicPlayer component
2. Define comprehensive props interface
3. Implement prop validation and defaults
4. Set up basic state management

### Phase 2: Theme System
1. Extract current styles to theme configuration
2. Create modern theme variant
3. Implement theme switching logic
4. Update MusicPlayerUI with theme support

### Phase 3: Size Variations
1. Create compact layout for MusicPlayerUI
2. Implement size-based feature toggling
3. Ensure responsive behavior
4. Test across different screen sizes

### Phase 4: Enhanced Functionality
1. Add playlist size management
2. Implement callback system
3. Add conditional generator rendering
4. Handle initial tracks loading

### Phase 5: Integration and Testing
1. Replace existing MySpaceMusicPlayer usage
2. Comprehensive testing across configurations
3. Documentation and examples
4. Performance optimization

## Migration Strategy

### Backward Compatibility
- Keep existing MySpaceMusicPlayer as wrapper with default props
- Ensure existing App.tsx continues to work without changes
- Provide migration guide for advanced usage

### Gradual Adoption
- Allow incremental prop adoption
- Maintain existing behavior as defaults
- Provide clear upgrade path documentation