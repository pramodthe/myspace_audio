import React, { useState, useRef } from 'react';

export const AudioDebugger: React.FC = () => {
  const [testUrl, setTestUrl] = useState('http://localhost:8000/download-audio/c83f3ecb-5bec-453f-94cf-f7f518d279df');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const testAudioLoad = async () => {
    setStatus('Testing audio load...');
    setError('');
    
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    // Add event listeners
    const onLoadStart = () => setStatus('Load started...');
    const onCanPlay = () => setStatus('Can play - audio loaded successfully!');
    const onError = (e: any) => {
      setError(`Audio error: ${e.target.error?.message || 'Unknown error'}`);
      setStatus('Error loading audio');
    };
    const onLoadedData = () => setStatus('Audio data loaded');
    
    audio.addEventListener('loadstart', onLoadStart);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);
    audio.addEventListener('loadeddata', onLoadedData);
    
    try {
      audio.src = testUrl;
      audio.load();
    } catch (err) {
      setError(`Exception: ${err}`);
    }
    
    // Cleanup
    setTimeout(() => {
      audio.removeEventListener('loadstart', onLoadStart);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('loadeddata', onLoadedData);
    }, 5000);
  };

  const testPlay = async () => {
    if (!audioRef.current) return;
    
    try {
      setStatus('Attempting to play...');
      await audioRef.current.play();
      setStatus('Playing successfully!');
    } catch (err: any) {
      setError(`Play error: ${err.message}`);
      setStatus('Play failed');
    }
  };

  const testFetch = async () => {
    setStatus('Testing fetch...');
    setError('');
    
    try {
      const response = await fetch(testUrl);
      if (response.ok) {
        const blob = await response.blob();
        setStatus(`Fetch successful! Content-Type: ${response.headers.get('content-type')}, Size: ${blob.size} bytes`);
      } else {
        setError(`Fetch failed: ${response.status} ${response.statusText}`);
      }
    } catch (err: any) {
      setError(`Fetch error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '8px' }}>
      <h3>🔧 Audio Debug Tool</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Test URL:</label>
        <input 
          type="text" 
          value={testUrl} 
          onChange={(e) => setTestUrl(e.target.value)}
          style={{ width: '100%', padding: '5px', marginTop: '5px' }}
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <button onClick={testFetch} style={{ marginRight: '10px', padding: '8px 16px' }}>
          Test Fetch
        </button>
        <button onClick={testAudioLoad} style={{ marginRight: '10px', padding: '8px 16px' }}>
          Test Audio Load
        </button>
        <button onClick={testPlay} style={{ padding: '8px 16px' }}>
          Test Play
        </button>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Status:</strong> <span style={{ color: 'blue' }}>{status}</span>
      </div>
      
      {error && (
        <div style={{ marginBottom: '10px' }}>
          <strong>Error:</strong> <span style={{ color: 'red' }}>{error}</span>
        </div>
      )}
      
      <audio ref={audioRef} controls style={{ width: '100%' }}>
        Your browser does not support the audio element.
      </audio>
      
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <p><strong>Debug Info:</strong></p>
        <p>• Check browser console for additional errors</p>
        <p>• Ensure backend is running on http://localhost:8000</p>
        <p>• Try the audio controls above manually</p>
      </div>
    </div>
  );
};