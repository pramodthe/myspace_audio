import React from 'react';
import { ConfigurableMusicPlayer } from './ConfigurableMusicPlayer';

/**
 * MySpaceMusicPlayer - Backward compatibility wrapper
 * 
 * This component maintains the original MySpaceMusicPlayer interface while
 * internally using the new ConfigurableMusicPlayer with default settings.
 * This ensures existing code continues to work without any breaking changes.
 */
const MySpaceMusicPlayer: React.FC = () => {
    return (
        <ConfigurableMusicPlayer
            maxPlaylistSize={5}
            enableGenerator={true}
            theme="retro"
            size="full"
        />
    );
};

export default MySpaceMusicPlayer;
