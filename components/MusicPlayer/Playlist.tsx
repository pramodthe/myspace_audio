import React from 'react';
import { Track } from '../../types/music';

interface PlaylistProps {
    playlist: Track[];
    currentTrackIndex: number | null;
    onSelectTrack: (index: number) => void;
    onRemoveTrack?: (index: number) => void;
    onOpenModal?: () => void;
    isPlaylistFull: boolean;
    maxPlaylistSize?: number;
}

export const Playlist: React.FC<PlaylistProps> = ({ 
    playlist, 
    currentTrackIndex, 
    onSelectTrack, 
    onRemoveTrack,
    onOpenModal, 
    isPlaylistFull,
    maxPlaylistSize = 5
}) => (
    <div className="playlist w-[296px]">
        <style>{`.playlist { background: #dcdcdc; border: 1px solid #9b9b9b; border-top: none; border-radius: 0 0 2px 2px; overflow: hidden; font-family: Arial, sans-serif; } .playlist .header { display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 4px 6px; font-size: 12px; font-weight: 700; color: #333; background: linear-gradient(#f9f9f9, #c9c9c9); border-bottom: 1px solid #9b9b9b; } .playlist .header .title { flex: 1; } .playlist .header .count { font-size: 11px; color: #666; font-weight: 400; } .playlist .list { max-height: 190px; overflow: auto; background: #ececec; } .playlist .row { display: grid; grid-template-columns: 22px 1fr 20px; align-items: center; gap: 6px; padding: 6px 6px; font-size: 12px; color: #333; border-bottom: 1px solid #d0d0d0; cursor: pointer; outline: none; } .playlist .row:hover { background: #f7f7f7; } .playlist .row:focus { box-shadow: inset 0 0 0 2px #bdbdbd; } .playlist .row.active { background: #ffffff; font-weight: 600; } .playlist .row .num { color: #666; text-align: right; padding-right: 2px; } .playlist .row .name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .playlist .row .artist { color: #666; font-weight: 400; } .playlist .row .remove-btn { background: none; border: none; color: #999; cursor: pointer; font-size: 14px; padding: 0; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; border-radius: 2px; } .playlist .row .remove-btn:hover { background: #ff4444; color: white; } .playlist .list .empty-message { padding: 10px; font-size: 12px; color: #666; text-align: center; font-style: italic; } .playlist .row.action-row { font-weight: bold; color: #003399; grid-template-columns: 22px 1fr; } .playlist .row.action-row .num { color: #003399; font-weight: bold; } .playlist .row.action-row:hover { background: #e0e8f5; }`}</style>
        <div className="header">
            <div className="title">Track</div>
            <div className="count">{playlist.length}/{maxPlaylistSize}</div>
        </div>
        <div className="list">
            {playlist.length === 0 && !isPlaylistFull && (
                <div className="empty-message">Your generated songs will appear here.</div>
            )}
            {playlist.map((track, index) => (
                <div 
                    key={track.id} 
                    className={`row ${currentTrackIndex === index ? 'active' : ''}`} 
                >
                    <div className="num">{index + 1}.</div>
                    <div 
                        className="name"
                        onClick={() => onSelectTrack(index)} 
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectTrack(index)} 
                        tabIndex={0} 
                        role="button" 
                        aria-pressed={currentTrackIndex === index}
                        style={{ cursor: 'pointer' }}
                    >
                        {track.title}
                        <span className="artist"> by {track.artist}</span>
                    </div>
                    {onRemoveTrack && (
                        <button 
                            className="remove-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveTrack(index);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.stopPropagation();
                                    onRemoveTrack(index);
                                }
                            }}
                            title="Remove track"
                            aria-label={`Remove ${track.title}`}
                        >
                            ×
                        </button>
                    )}
                </div>
            ))}
            {!isPlaylistFull && onOpenModal && (
                 <div 
                    className="row action-row" 
                    onClick={onOpenModal} 
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenModal()} 
                    tabIndex={0} 
                    role="button"
                >
                    <div className="num">+</div>
                    <div className="name">Create a new Song</div>
                </div>
            )}
        </div>
    </div>
);