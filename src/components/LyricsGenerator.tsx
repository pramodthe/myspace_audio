import React, { useState } from 'react';
import { useAudioApi } from '../hooks/useAudioApi';
import { AudioApiError } from '../services/audioApi';

interface LyricsGeneratorProps {
  onLyricsGenerated?: (lyrics: string, wordCount: number) => void;
  className?: string;
}

export const LyricsGenerator: React.FC<LyricsGeneratorProps> = ({
  onLyricsGenerated,
  className = ''
}) => {
  const { generateLyrics, getLyricsThemes } = useAudioApi();
  
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [suggestedThemes, setSuggestedThemes] = useState<string[]>([]);
  const [showThemes, setShowThemes] = useState(false);

  const handleGenerateLyrics = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for your song');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await generateLyrics(topic, description);
      
      if (response.success) {
        setGeneratedLyrics(response.lyrics);
        setWordCount(response.word_count);
        setCharacterCount(response.character_count);
        
        if (onLyricsGenerated) {
          onLyricsGenerated(response.lyrics, response.word_count);
        }
      } else {
        setError('Failed to generate lyrics. Please try again.');
      }
    } catch (err) {
      console.error('Lyrics generation failed:', err);
      
      if (err instanceof AudioApiError) {
        setError(`Lyrics generation failed: ${err.message}`);
      } else {
        setError('Failed to generate lyrics. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGetThemes = async () => {
    try {
      const themes = await getLyricsThemes();
      setSuggestedThemes(themes);
      setShowThemes(true);
    } catch (err) {
      console.error('Failed to get themes:', err);
      // Use fallback themes
      setSuggestedThemes([
        'Love and relationships',
        'Dreams and aspirations',
        'Overcoming challenges',
        'Friendship and loyalty',
        'Adventure and exploration',
        'Self-discovery',
        'Nostalgia and memories',
        'Hope and inspiration'
      ]);
      setShowThemes(true);
    }
  };

  const handleThemeSelect = (theme: string) => {
    setTopic(theme);
    setShowThemes(false);
  };

  const handleCopyLyrics = () => {
    if (generatedLyrics) {
      navigator.clipboard.writeText(generatedLyrics);
    }
  };

  const handleClearLyrics = () => {
    setGeneratedLyrics('');
    setWordCount(0);
    setCharacterCount(0);
    setError(null);
  };

  return (
    <div className={`lyrics-generator ${className}`}>
      <style>{`
        .lyrics-generator {
          background: white;
          border: 1px solid #CCCCCC;
          border-radius: 4px;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .lyrics-generator .header {
          margin-bottom: 20px;
        }
        
        .lyrics-generator .title {
          font-size: 20px;
          font-weight: bold;
          color: #003399;
          margin-bottom: 8px;
        }
        
        .lyrics-generator .subtitle {
          font-size: 14px;
          color: #666;
        }
        
        .lyrics-generator .form-group {
          margin-bottom: 16px;
        }
        
        .lyrics-generator .form-group label {
          display: block;
          font-size: 14px;
          font-weight: bold;
          color: #003399;
          margin-bottom: 6px;
        }
        
        .lyrics-generator .input-with-button {
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }
        
        .lyrics-generator input,
        .lyrics-generator textarea {
          flex: 1;
          padding: 10px;
          border: 1px solid #DDD;
          border-radius: 4px;
          font-size: 14px;
          font-family: Arial, sans-serif;
        }
        
        .lyrics-generator textarea {
          min-height: 80px;
          resize: vertical;
        }
        
        .lyrics-generator .theme-btn {
          background: #28a745;
          color: white;
          border: 1px solid #1e7e34;
          padding: 10px 16px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          white-space: nowrap;
        }
        
        .lyrics-generator .theme-btn:hover {
          background: #218838;
        }
        
        .lyrics-generator .theme-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .lyrics-generator .themes-dropdown {
          margin-top: 8px;
          border: 1px solid #DDD;
          border-radius: 4px;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .lyrics-generator .themes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
          font-size: 14px;
          font-weight: bold;
        }
        
        .lyrics-generator .close-themes {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #666;
        }
        
        .lyrics-generator .themes-list {
          max-height: 200px;
          overflow-y: auto;
        }
        
        .lyrics-generator .theme-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 12px;
          border: none;
          background: none;
          font-size: 14px;
          cursor: pointer;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .lyrics-generator .theme-item:hover {
          background: #f8f9fa;
        }
        
        .lyrics-generator .theme-item:last-child {
          border-bottom: none;
        }
        
        .lyrics-generator .generate-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .lyrics-generator .generate-btn:hover {
          background: #0056b3;
        }
        
        .lyrics-generator .generate-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .lyrics-generator .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .lyrics-generator .error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 14px;
        }
        
        .lyrics-generator .result {
          margin-top: 20px;
          padding: 20px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
        }
        
        .lyrics-generator .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .lyrics-generator .result-title {
          font-size: 16px;
          font-weight: bold;
          color: #003399;
        }
        
        .lyrics-generator .result-stats {
          font-size: 12px;
          color: #666;
        }
        
        .lyrics-generator .result-actions {
          display: flex;
          gap: 8px;
        }
        
        .lyrics-generator .action-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 3px;
          font-size: 12px;
          cursor: pointer;
        }
        
        .lyrics-generator .action-btn:hover {
          background: #545b62;
        }
        
        .lyrics-generator .lyrics-text {
          background: white;
          border: 1px solid #DDD;
          border-radius: 4px;
          padding: 16px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-wrap;
          max-height: 400px;
          overflow-y: auto;
        }
      `}</style>
      
      <div className="header">
        <div className="title">🎵 AI Lyrics Generator</div>
        <div className="subtitle">Generate creative song lyrics using AI</div>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="topic">Song Topic *</label>
        <div className="input-with-button">
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Summer romance, Overcoming challenges, Dreams..."
            maxLength={100}
          />
          <button
            type="button"
            onClick={handleGetThemes}
            className="theme-btn"
            disabled={isGenerating}
          >
            💡 Get Ideas
          </button>
        </div>
        
        {showThemes && (
          <div className="themes-dropdown">
            <div className="themes-header">
              <span>Suggested themes:</span>
              <button 
                type="button" 
                onClick={() => setShowThemes(false)}
                className="close-themes"
              >
                ×
              </button>
            </div>
            <div className="themes-list">
              {suggestedThemes.map((theme, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleThemeSelect(theme)}
                  className="theme-item"
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Additional Description (Optional)</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more context about the mood, genre, or specific elements you want in the lyrics..."
          maxLength={300}
        />
      </div>

      <button
        onClick={handleGenerateLyrics}
        className="generate-btn"
        disabled={!topic.trim() || isGenerating}
      >
        {isGenerating ? (
          <>
            <div className="spinner" />
            Generating Lyrics...
          </>
        ) : (
          <>
            ✨ Generate Lyrics
          </>
        )}
      </button>

      {generatedLyrics && (
        <div className="result">
          <div className="result-header">
            <div>
              <div className="result-title">Generated Lyrics</div>
              <div className="result-stats">
                {wordCount} words • {characterCount} characters
              </div>
            </div>
            <div className="result-actions">
              <button
                onClick={handleCopyLyrics}
                className="action-btn"
                title="Copy to clipboard"
              >
                📋 Copy
              </button>
              <button
                onClick={handleClearLyrics}
                className="action-btn"
                title="Clear lyrics"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
          <div className="lyrics-text">
            {generatedLyrics}
          </div>
        </div>
      )}
    </div>
  );
};