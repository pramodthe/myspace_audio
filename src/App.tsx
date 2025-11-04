import React, { useState } from 'react';
import { ConfigurableMusicPlayer } from './components/ConfigurableMusicPlayer';
import { AudioLibrary } from './components/AudioLibrary';
import { LyricsGenerator } from './components/LyricsGenerator';
import { AudioDebugger } from './components/AudioDebugger';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Track } from './components/MusicPlayer/types';

// Demo tracks with working audio
const demoTracks: Track[] = [
    {
        id: 'demo-1',
        title: 'Demo Song',
        artist: 'AI MusicBox',
        audioSrc: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
        imageUrl: 'https://picsum.photos/seed/demo/300/300'
    }
];

const App: React.FC = () => {
    const [currentTracks, setCurrentTracks] = useState<Track[]>(demoTracks);
    const [activeTab, setActiveTab] = useState<'player' | 'library' | 'lyrics' | 'debug'>('player');

    const handleTrackGenerated = (newTrack: Track) => {
        setCurrentTracks(prev => [...prev, newTrack]);
    };

    const handleLibraryTrackSelect = (track: Track) => {
        // Add to playlist if not already there
        setCurrentTracks(prev => {
            const exists = prev.some(t => t.id === track.id);
            if (exists) return prev;
            return [...prev, track];
        });
        
        // Switch to player tab
        setActiveTab('player');
    };

    return (
        <div className="min-h-screen bg-[#E9E9E9] flex flex-col items-center justify-start p-4 font-['Arial',_sans-serif]">
            <div className="w-full max-w-6xl mx-auto bg-white border border-[#CCCCCC] shadow-md">
                <header className="flex justify-between items-center p-2 bg-[#003399] border-b-2 border-black">
                    <h1 className="text-2xl font-bold text-white">
                        AI MusicBox
                    </h1>
                    <nav className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('player')}
                            className={`px-4 py-2 text-sm font-medium rounded ${
                                activeTab === 'player'
                                    ? 'bg-white text-[#003399]'
                                    : 'bg-[#73AAD6] text-white hover:bg-[#5a8bb8]'
                            }`}
                        >
                            Music Player
                        </button>
                        <button
                            onClick={() => setActiveTab('lyrics')}
                            className={`px-4 py-2 text-sm font-medium rounded ${
                                activeTab === 'lyrics'
                                    ? 'bg-white text-[#003399]'
                                    : 'bg-[#73AAD6] text-white hover:bg-[#5a8bb8]'
                            }`}
                        >
                            Lyrics Generator
                        </button>
                        <button
                            onClick={() => setActiveTab('library')}
                            className={`px-4 py-2 text-sm font-medium rounded ${
                                activeTab === 'library'
                                    ? 'bg-white text-[#003399]'
                                    : 'bg-[#73AAD6] text-white hover:bg-[#5a8bb8]'
                            }`}
                        >
                            Audio Library
                        </button>
                        <button
                            onClick={() => setActiveTab('debug')}
                            className={`px-4 py-2 text-sm font-medium rounded ${
                                activeTab === 'debug'
                                    ? 'bg-white text-[#003399]'
                                    : 'bg-[#73AAD6] text-white hover:bg-[#5a8bb8]'
                            }`}
                        >
                            🔧 Debug
                        </button>
                    </nav>
                </header>

                <main className="p-6">
                    <ErrorBoundary>
                        {activeTab === 'player' && (
                            <div className="flex flex-col items-center justify-center">
                                <ConfigurableMusicPlayer
                                    maxPlaylistSize={10}
                                    enableGenerator={true}
                                    theme="retro"
                                    size="full"
                                    initialTracks={currentTracks}
                                    onTrackGenerated={handleTrackGenerated}
                                />
                            </div>
                        )}
                        
                        {activeTab === 'lyrics' && (
                            <LyricsGenerator 
                                className="max-w-4xl mx-auto"
                            />
                        )}
                        
                        {activeTab === 'library' && (
                            <AudioLibrary 
                                onTrackSelect={handleLibraryTrackSelect}
                                className="max-w-4xl mx-auto"
                            />
                        )}
                        
                        {activeTab === 'debug' && (
                            <div className="max-w-4xl mx-auto">
                                <AudioDebugger />
                            </div>
                        )}
                    </ErrorBoundary>
                </main>
            </div>
        </div>
    );
};

export default App;
