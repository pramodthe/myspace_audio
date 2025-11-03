import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Track } from '../../types/music';
import { ThemeName } from '../../types/theme';
import { useThemeStyles } from './ThemeProvider';
import './MusicPlayerUI.css';

interface MusicPlayerUIProps {
    currentTrack: Track | null;
    isPlaying: boolean;
    onPlayPause: () => void;
    onEnded: () => void;
    theme?: ThemeName;
    size?: 'compact' | 'full';
}

export const MusicPlayerUI: React.FC<MusicPlayerUIProps> = ({ 
    currentTrack, 
    isPlaying, 
    onPlayPause, 
    onEnded,
    theme = 'retro' as ThemeName,
    size = 'full'
}) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const timeRef = useRef<HTMLDivElement>(null);
    const volumeBarRef = useRef<HTMLDivElement>(null);
    const eqRefs = [
        useRef<HTMLDivElement>(null), 
        useRef<HTMLDivElement>(null), 
        useRef<HTMLDivElement>(null), 
        useRef<HTMLDivElement>(null)
    ];
    const rafRef = useRef<number | null>(null);
    const [volume, setVolume] = useState(100);

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const { getThemeDataAttribute } = useThemeStyles(theme);
    const className = useMemo(() => 
        ["music-player", isPlaying ? "playing" : "", `size-${size}`].filter(Boolean).join(" "), 
        [isPlaying, size]
    );

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        
        if (currentTrack?.audioSrc) {
            if (audio.src !== currentTrack.audioSrc) {
                audio.src = currentTrack.audioSrc;
            }
            if (isPlaying) {
                if (audio.ended) audio.currentTime = 0;
                const playAudio = () => audio.play().catch(e => console.error("Playback failed:", e));
                if (audio.readyState > 2) playAudio();
                else {
                    const canPlayListener = () => {
                        playAudio();
                        audio.removeEventListener('canplay', canPlayListener);
                    };
                    audio.addEventListener('canplay', canPlayListener);
                    return () => audio.removeEventListener('canplay', canPlayListener);
                }
            } else {
                audio.pause();
            }
        } else {
            audio.pause();
            audio.src = '';
        }
    }, [currentTrack, isPlaying]);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume / 100;
    }, [volume]);

    useEffect(() => {
        const tick = () => {
            if (!isPlaying) return;
            eqRefs.forEach(r => r.current?.style.setProperty("--level", `${Math.floor(Math.random() * 101)}`));
            if (audioRef.current && timeRef.current) {
                const s = Math.floor(audioRef.current.currentTime);
                const seconds = s % 60, minutes = Math.floor(s / 60) % 60, hours = Math.floor(s / 3600);
                timeRef.current.textContent = `${hours ? `${pad(hours)}:` : ""}${pad(minutes)}:${pad(seconds)}`;
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        if (isPlaying) rafRef.current = requestAnimationFrame(tick);
        else {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            eqRefs.forEach(r => r.current?.style.setProperty("--level", "0"));
            if (audioRef.current && timeRef.current) {
                 const s = Math.floor(audioRef.current.currentTime);
                 const seconds = s % 60, minutes = Math.floor(s / 60) % 60, hours = Math.floor(s / 3600);
                 timeRef.current.textContent = `${hours ? `${pad(hours)}:` : ""}${pad(minutes)}:${pad(seconds)}`;
            }
        }
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) };
    }, [isPlaying]);

    const setVolumeFromClientX = (clientX: number, el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        const newVol = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        el.style.setProperty("--volume", `${newVol}`);
        setVolume(newVol);
    };

    return (
        <div className={className} {...getThemeDataAttribute()}>
            <audio ref={audioRef} onEnded={onEnded} preload="metadata" />
            <div className="music-player-content">
                <button className="music-player-button" onClick={onPlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
                    <svg className="play" viewBox="0 0 24 24"><path d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" /></svg>
                    <svg className="pause" viewBox="0 0 24 24"><path d="M7.5 4.5a.75.75 0 0 0-.75.75v13.5a.75.75 0 0 0 .75.75H9a.75.75 0 0 0 .75-.75V5.25A.75.75 0 0 0 9 4.5zm7.5 0a.75.75 0 0 0-.75.75v13.5a.75.75 0 0 0 .75.75h1.5a.75.75 0 0 0 .75-.75V5.25a.75.75 0 0 0-.75-.75z" /></svg>
                </button>
                <div className="music-player-info">
                    <div className="music-player-display">
                        <span className="title">{currentTrack?.title || "No Track"}</span>
                        <span className="artist">{currentTrack?.artist ? ` by ${currentTrack.artist}` : ""}</span>
                    </div>
                    {size === 'full' && (
                        <div className="music-player-equalizer" aria-hidden>
                            <div ref={eqRefs[0]} className="music-player-bar" />
                            <div ref={eqRefs[1]} className="music-player-bar" />
                            <div ref={eqRefs[2]} className="music-player-bar" />
                            <div ref={eqRefs[3]} className="music-player-bar" />
                        </div>
                    )}
                </div>
                <div className="music-player-playback-info">
                    {size === 'full' ? (
                        <div className="music-player-volume" aria-label="Volume">
                            <div onClick={() => { if(volumeBarRef.current) volumeBarRef.current.style.setProperty("--volume", "0"); setVolume(0); }} title="Mute" style={{ cursor: 'pointer' }}>
                                <svg viewBox="0 0 24 24"><path d="M16.451 2.558A1.47 1.47 0 0 0 15.439 3l-4.5 4.5H9.008c-1.141 0-2.318.663-2.66 1.904A9.8 9.8 0 0 0 6 12c0 .898.12 1.769.35 2.596.34 1.24 1.519 1.904 2.66 1.904h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06c0-.918-.765-1.521-1.549-1.502" /></svg>
                            </div>
                            <div ref={volumeBarRef} className="music-player-bar" onClick={(e: React.MouseEvent<HTMLDivElement>) => setVolumeFromClientX(e.clientX, e.currentTarget)} onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => e.buttons & 1 && setVolumeFromClientX(e.clientX, e.currentTarget)} role="slider" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(volume)} title="Volume"/>
                            <div onClick={() => { if(volumeBarRef.current) volumeBarRef.current.style.setProperty("--volume", "100"); setVolume(100); }} title="Max volume" style={{ cursor: 'pointer' }}>
                                <svg viewBox="0 0 24 24"><path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06zM13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.8 9.8 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06zm5.084 1.046a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06" /></svg>
                            </div>
                        </div>
                    ) : (
                        <div className="music-player-volume-compact" aria-label="Volume">
                            <div onClick={() => setVolume(volume > 0 ? 0 : 100)} title={volume > 0 ? "Mute" : "Unmute"} style={{ cursor: 'pointer' }}>
                                <svg viewBox="0 0 24 24">
                                    {volume > 0 ? (
                                        <path d="M16.451 2.558A1.47 1.47 0 0 0 15.439 3l-4.5 4.5H9.008c-1.141 0-2.318.663-2.66 1.904A9.8 9.8 0 0 0 6 12c0 .898.12 1.769.35 2.596.34 1.24 1.519 1.904 2.66 1.904h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06c0-.918-.765-1.521-1.549-1.502" />
                                    ) : (
                                        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.8 9.8 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06zm8.25 8.94a.75.75 0 0 1-1.06 1.06L18.44 12l2.25-2.06a.75.75 0 0 1 1.06 1.06L20.56 12l1.19 1.06z" />
                                    )}
                                </svg>
                            </div>
                            {/* Hidden volume bar for compact mode to maintain volume state */}
                            <div ref={volumeBarRef} className="music-player-bar" style={{ display: 'none' }} />
                        </div>
                    )}
                    <div ref={timeRef} className="music-player-time">00:00</div>
                </div>
            </div>
        </div>
    );
};