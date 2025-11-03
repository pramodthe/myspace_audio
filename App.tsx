import React from 'react';
import { ConfigurableMusicPlayer } from './components/ConfigurableMusicPlayer';

const App: React.FC = () => {

    return (
        <div className="min-h-screen bg-[#E9E9E9] flex flex-col items-center justify-start p-4 font-['Arial',_sans-serif]">
            <div className="w-full max-w-4xl mx-auto bg-white border border-[#CCCCCC] shadow-md">
                 <header className="flex justify-between items-center p-2 bg-[#003399] border-b-2 border-black">
                    <h1 className="text-2xl font-bold text-white">
                        AI MusicBox
                    </h1>
                </header>

                <main className="p-6 flex flex-col items-center justify-center">
                   {/* Using the new configurable component with default settings */}
                   <ConfigurableMusicPlayer
                       maxPlaylistSize={5}
                       enableGenerator={true}
                       theme="retro"
                       size="full"
                   />
                </main>
            </div>
        </div>
    );
};

export default App;
