import React, { useState } from 'react';
import { useAudioApi } from '../hooks/useAudioApi';
import { Track } from './MusicPlayer/types';

interface AudioLibraryProps {
  onTrackSelect: (track: Track) => void;
  className?: string;
}

export const AudioLibrary: React.FC<AudioLibraryProps> = ({ 
  onTrackSelect, 
  className = '' 
}) => {
  const { 
    audioFiles, 
    audioStats, 
    isLoading, 
    error, 
    deleteAudio, 
    convertToTrack, 
    refreshFiles,
    clearError 
  } = useAudioApi();
  
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (fileId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent track selection
    
    if (!confirm('Are you sure you want to delete this audio file?')) {
      return;
    }

    try {
      setDeletingId(fileId);
      await deleteAudio(fileId);
    } catch (err) {
      // Error is handled by the hook
    } finally {
      setDeletingId(null);
    }
  };

  const handleTrackClick = (audioFile: any) => {
    const track = convertToTrack(audioFile);
    onTrackSelect(track);
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading && audioFiles.length === 0) {
    return (
      <div className={`audio-library ${className}`}>
        <div className="loading">Loading audio library...</div>
      </div>
    );
  }

  return (
    <div className={`audio-library ${className}`}>
      <style>{`
        .audio-library {
          background: white;
          border: 1px solid #CCCCCC;
          border-radius: 4px;
          padding: 16px;
          font-family: Arial, sans-serif;
        }
        
        .audio-library .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #EEEEEE;
        }
        
        .audio-library .title {
          font-size: 18px;
          font-weight: bold;
          color: #003399;
        }
        
        .audio-library .stats {
          font-size: 12px;
          color: #666;
        }
        
        .audio-library .refresh-btn {
          background: #73AAD6;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .audio-library .refresh-btn:hover {
          background: #5a8bb8;
        }
        
        .audio-library .error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
          padding: 8px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 14px;
        }
        
        .audio-library .error .close-btn {
          float: right;
          background: none;
          border: none;
          color: #721c24;
          cursor: pointer;
          font-weight: bold;
        }
        
        .audio-library .empty {
          text-align: center;
          color: #666;
          padding: 32px;
          font-style: italic;
        }
        
        .audio-library .file-list {
          display: grid;
          gap: 8px;
        }
        
        .audio-library .file-item {
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid #DDD;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .audio-library .file-item:hover {
          background-color: #f8f9fa;
        }
        
        .audio-library .file-info {
          flex: 1;
          min-width: 0;
        }
        
        .audio-library .file-name {
          font-weight: bold;
          color: #003399;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .audio-library .file-meta {
          font-size: 12px;
          color: #666;
          display: flex;
          gap: 16px;
        }
        
        .audio-library .delete-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 11px;
          margin-left: 8px;
        }
        
        .audio-library .delete-btn:hover {
          background: #c82333;
        }
        
        .audio-library .delete-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .audio-library .loading {
          text-align: center;
          color: #666;
          padding: 32px;
        }
      `}</style>
      
      <div className="header">
        <div>
          <div className="title">Audio Library</div>
          {audioStats && (
            <div className="stats">
              {audioStats.total_files} files • {formatFileSize(audioStats.total_size)}
            </div>
          )}
        </div>
        <button 
          className="refresh-btn" 
          onClick={refreshFiles}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="error">
          <button className="close-btn" onClick={clearError}>×</button>
          {error}
        </div>
      )}

      {audioFiles.length === 0 ? (
        <div className="empty">
          No audio files found. Generate some music to get started!
        </div>
      ) : (
        <div className="file-list">
          {audioFiles.map((file) => (
            <div 
              key={file.id} 
              className="file-item"
              onClick={() => handleTrackClick(file)}
            >
              <div className="file-info">
                <div className="file-name">Generated Song {file.id}</div>
                <div className="file-meta">
                  <span>Created: {formatDate(file.created_at)}</span>
                  <span>Size: {formatFileSize(file.file_size)}</span>
                  <span>Duration: {formatDuration(file.duration)}</span>
                  <span>Status: {file.status}</span>
                </div>
              </div>
              <button
                className="delete-btn"
                onClick={(e) => handleDelete(file.file_id, e)}
                disabled={deletingId === file.file_id}
              >
                {deletingId === file.file_id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};