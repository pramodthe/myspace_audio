import React, { useState, useEffect } from 'react';
import { Track } from './types';

// Sample demo tracks for frontend-only demo
const DEMO_TRACKS = [
    {
        title: "Midnight City Lights",
        artist: "AI Bard",
        audioSrc: "https://www.w3schools.com/html/horse.mp3",
        imageUrl: "https://picsum.photos/seed/midnight/500/500"
    },
    {
        title: "Summer Breeze",
        artist: "AI Bard", 
        audioSrc: "https://www.w3schools.com/html/horse.mp3",
        imageUrl: "https://picsum.photos/seed/summer/500/500"
    },
    {
        title: "Electric Dreams",
        artist: "AI Bard",
        audioSrc: "https://www.w3schools.com/html/horse.mp3", 
        imageUrl: "https://picsum.photos/seed/electric/500/500"
    }
];

// Sample lyrics for demo
const SAMPLE_LYRICS = [
    "Walking through the city lights tonight\nNeon signs are burning bright\nEvery step feels so alive\nIn this moment we will thrive",
    "Summer breeze is calling me\nTo a place where I can be free\nUnderneath the starlit sky\nTime just seems to pass us by",
    "Electric dreams are all around\nIn this digital playground\nPixels dancing in the air\nMagic moments everywhere"
];

interface GeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTrackGenerated: (track: Track) => void;
}

export const GeneratorModal: React.FC<GeneratorModalProps> = ({ 
    isOpen, 
    onClose, 
    onTrackGenerated 
}) => {
    const [songName, setSongName] = useState('');
    const [description, setDescription] = useState('');
    const [lyrics, setLyrics] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nameValid, setNameValid] = useState(false);
    const [descValid, setDescValid] = useState(false);

    useEffect(() => { 
        setNameValid(songName.trim().length > 0 && songName.trim().length <= 30); 
    }, [songName]);
    
    useEffect(() => { 
        setDescValid(description.trim().length >= 10 && description.trim().length <= 300); 
    }, [description]);

    const handleGenerateLyrics = async () => {
        if (!nameValid || !descValid) { 
            setError('Please fill in a valid song name and music description first.'); 
            return; 
        }
        
        setIsGeneratingLyrics(true); 
        setError(null);
        
        // Simulate API call delay for demo
        setTimeout(() => {
            const randomLyrics = SAMPLE_LYRICS[Math.floor(Math.random() * SAMPLE_LYRICS.length)];
            setLyrics(randomLyrics);
            setIsGeneratingLyrics(false);
        }, 1500);
    };

    const handleGenerate: React.FormEventHandler = async (e) => {
        e.preventDefault();
        
        if (!nameValid || !descValid) { 
            setError('Please fill out the song name and description correctly.'); 
            return; 
        }
        
        if (!lyrics.trim()) { 
            setError('Lyrics are required to generate music.'); 
            return; 
        }
        
        setIsLoading(true); 
        setError(null);
        
        // Simulate music generation with demo track
        setTimeout(() => {
            const randomTrack = DEMO_TRACKS[Math.floor(Math.random() * DEMO_TRACKS.length)];
            
            const newTrack: Track = { 
                id: `track-${Date.now()}`, 
                title: songName, 
                artist: 'AI Bard', 
                audioSrc: randomTrack.audioSrc, 
                imageUrl: `https://picsum.photos/seed/${Date.now()}/500/500` 
            };
            
            onTrackGenerated(newTrack);
            setSongName(''); 
            setDescription(''); 
            setLyrics('');
            setIsLoading(false);
        }, 2000);
    };

    if (!isOpen) return null;
    
    return (
        <div className="music-player">
            <style>{`:root { --lightBlue: #73AAD6; --lightestBlue: #D5E7FB; --blue: #0047AB; } .music-player .composer-overlay { position:fixed; inset:0; background:rgba(0,0,0,.55); display:grid; place-items:center; z-index:50; font-family: Arial, sans-serif;} .music-player .composer { width: 360px; border:1px solid var(--lightBlue, #73AAD6); border-radius:2px; background:var(--lightestBlue, #D5E7FB); box-shadow: 0 8px 24px rgba(0,0,0,.35); } .music-player .composer .titlebar { display:flex; align-items:center; justify-content:space-between; padding:6px 8px; background:var(--blue, #0047AB); border-bottom:1px solid var(--lightBlue, #73AAD6); } .music-player .composer .titlebar .title { font-weight:800; font-size:13px; color:#fff; } .music-player .composer .titlebar .close { appearance:none; border:1px solid var(--lightBlue, #73AAD6); background:#EBEBEB; width:20px; height:20px; border-radius:2px; cursor:pointer; font-weight:800; line-height:1; color:#1a1a1a; } .music-player .composer .body { padding:10px; background:var(--lightestBlue, #D5E7FB); } .music-player .composer fieldset { border:1px solid var(--lightBlue, #73AAD6); border-radius:2px; padding:8px; margin:0 0 8px 0; background:#fff; } .music-player .composer legend { padding:0 4px; font-size:12px; font-weight:700; color:var(--blue, #0047AB); } .music-player .composer label { display:block; font-size:12px; color:var(--blue, #0047AB); margin-bottom:4px; } .music-player .composer input, .music-player .composer textarea { width:100%; border:1px solid #9f9f9f; border-radius:2px; background:#fff; padding:6px; font-size:12px; color:#333; } .music-player .composer textarea#description { min-height: 70px; resize: vertical; } .music-player .composer textarea#lyrics { min-height: 140px; resize: vertical;} .music-player .composer .note { font-size:11px; color:#355; margin-top:4px; } .music-player .composer .lyrics-header { display:flex; justify-content:space-between; align-items:center; margin-bottom: 4px; } .music-player .composer .lyrics-header label { margin-bottom: 0; } .music-player .composer .actions { display:flex; justify-content:flex-end; gap:8px; padding:8px 10px 10px; background:#EBEBEB; border-top:1px solid var(--lightBlue, #73AAD6); } .music-player .composer .btn { position:relative; appearance:none; border:1px solid #8f8f8f; border-radius:3px; background:#EBEBEB; padding:8px 14px; font-weight:700; font-size:12px; cursor:pointer; color:#1a1a1a; display: inline-flex; align-items: center; justify-content: center; min-height: 32px; } .music-player .composer .btn:disabled { opacity: 0.6; cursor: not-allowed; } .music-player .composer .btn.primary { background:#FF7B00; color:#fff; border-color:#cc6a00; } .music-player .composer .spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation: spin 1s linear infinite; } .music-player .composer .ai-lyrics-button { display:inline-flex; align-items:center; justify-content:center; gap:6px; height:32px; min-width:110px; padding:0 12px; background-color:#5a67d8; color:#fff; font-size:13px; font-weight:bold; border:1px solid #434190; border-radius:4px; cursor:pointer; transition: background-color .2s, opacity .2s; box-shadow:0 1px 2px rgba(0,0,0,.1); } .music-player .composer .ai-lyrics-button:hover { background-color:#4c51bf; } .music-player .composer .ai-lyrics-button:disabled { opacity:.7; cursor:not-allowed; background-color:#8b8db5; } .music-player .composer .ai-lyrics-button .icon { flex-shrink:0; display:inline-block; width:16px; height:16px; background:url(https://storage.googleapis.com/lawinsider-public/assets/art-test-images/icon-spark-pencil-light.svg) no-repeat center/contain; } @keyframes spin { to { transform: rotate(360deg); } } .music-player .composer .error-message { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 8px; border-radius: 4px; font-size: 12px; margin-bottom: 8px; } .mandatory-star { color: red; margin-left: 2px; }`}</style>
            <div className="composer-overlay" role="dialog" aria-modal="true" aria-labelledby="composerTitle">
                <div className="composer">
                    <div className="titlebar">
                        <div id="composerTitle" className="title">Create a Song</div>
                        <button className="close" onClick={() => { setError(null); onClose(); }} aria-label="Close">×</button>
                    </div>
                    <form onSubmit={handleGenerate}>
                        <div className="body">
                            {error && <div className="error-message">{error}</div>}
                            <fieldset>
                                <legend>Song details</legend>
                                <label htmlFor="songName">Song name<span className="mandatory-star">*</span></label>
                                <input 
                                    id="songName" 
                                    name="songName" 
                                    value={songName} 
                                    onChange={(e) => setSongName(e.target.value)} 
                                    maxLength={30} 
                                    required 
                                    placeholder="e.g., Midnight City Lights" 
                                />
                                <label htmlFor="description" style={{ marginTop: 8 }}>Music description<span className="mandatory-star">*</span></label>
                                <textarea 
                                    id="description" 
                                    name="description" 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    placeholder="e.g., Upbeat indie rock ~120 BPM, summer-night vibes..." 
                                    minLength={10} 
                                    maxLength={300} 
                                    required 
                                    aria-describedby="desc-note"
                                />
                                <div id="desc-note" className="note">Valid input: 10–300 characters.</div>
                            </fieldset>
                            <fieldset>
                                <legend>Lyrics</legend>
                                <div className="lyrics-header">
                                    <label htmlFor="lyrics">Enter lyrics<span className="mandatory-star">*</span></label>
                                    <button 
                                        onClick={handleGenerateLyrics} 
                                        disabled={!nameValid || !descValid || isLoading || isGeneratingLyrics} 
                                        className="ai-lyrics-button" 
                                        type="button" 
                                        aria-label="Generate AI Lyrics"
                                    >
                                        {isGeneratingLyrics ? (
                                            <div className="spinner" />
                                        ) : (
                                            <>
                                                <i className="icon" />
                                                <span>AI Lyrics</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                <textarea 
                                    id="lyrics" 
                                    name="lyrics" 
                                    value={lyrics} 
                                    onChange={(e) => setLyrics(e.target.value)} 
                                    placeholder="Type your verses here… or let AI draft them" 
                                    required 
                                    aria-describedby="lyrics-note"
                                />
                                <div id="lyrics-note" className="note"> Max 600 characters allowed at the moment.</div>
                            </fieldset>
                        </div>
                        <div className="actions">
                            <button type="button" className="btn" onClick={() => { setError(null); onClose(); }}>
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="btn primary" 
                                disabled={!nameValid || !descValid || isLoading || isGeneratingLyrics}
                            >
                                {isLoading ? <div className="spinner" /> : 'Create Song'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};