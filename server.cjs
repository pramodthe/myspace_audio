const express = require('express');
const cors = require('cors');
const https = require('https');
require('dotenv').config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate-music', async (req, res) => {
  console.log('🎵 Received music generation request');
  console.log('📝 Request body:', req.body);
  
  let { lyrics, prompt } = req.body;
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

  // Clean and validate lyrics
  lyrics = lyrics?.trim() || '';
  console.log('📏 Lyrics length:', lyrics.length);
  console.log('📝 First 100 chars of lyrics:', lyrics.substring(0, 100));
  
  if (lyrics.length < 10) {
    console.error('❌ Lyrics too short:', lyrics.length, 'characters');
    return res.status(400).json({ error: 'Lyrics must be at least 10 characters long' });
  }
  
  if (lyrics.length > 600) {
    console.warn('⚠️ Lyrics too long, truncating from', lyrics.length, 'to 600 characters');
    lyrics = lyrics.substring(0, 600);
  }

  console.log('🔑 API Token configured:', !!REPLICATE_API_TOKEN);

  if (!REPLICATE_API_TOKEN) {
    console.error('❌ No Replicate API token configured');
    return res.status(500).json({ error: 'Replicate API token not configured' });
  }

  try {
    console.log('Creating prediction...');
    
    // Create prediction with proper format
    const predictionData = JSON.stringify({
      input: { 
        lyrics: lyrics,
        prompt: prompt,
        sample_rate: 44100,
        bitrate: 256000,
        audio_format: "mp3"
      }
    });

    const options = {
      hostname: 'api.replicate.com',
      path: '/v1/models/minimax/music-1.5/predictions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': predictionData.length
      }
    };

    const prediction = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          console.log('📡 Raw API response:', data);
          if (res.statusCode >= 400) {
            reject(new Error(`API error: ${res.statusCode} ${data}`));
          } else {
            try {
              resolve(JSON.parse(data));
            } catch (parseError) {
              console.error('❌ JSON parse error:', parseError);
              console.error('❌ Raw response that failed to parse:', data);
              reject(new Error(`Invalid JSON response: ${data}`));
            }
          }
        });
      });
      req.on('error', reject);
      req.write(predictionData);
      req.end();
    });

    console.log('Prediction created:', prediction.id);

    // Poll for completion
    const predictionId = prediction.id;
    let finalPrediction = prediction;
    let attempts = 0;
    const maxAttempts = 60;

    while ((finalPrediction.status === 'starting' || finalPrediction.status === 'processing') && attempts < maxAttempts) {
      console.log(`Attempt ${attempts + 1}: Status is ${finalPrediction.status}`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const statusOptions = {
        hostname: 'api.replicate.com',
        path: `/v1/predictions/${predictionId}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${REPLICATE_API_TOKEN}`
        }
      };

      finalPrediction = await new Promise((resolve, reject) => {
        const req = https.request(statusOptions, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            console.log('📊 Status check response:', data);
            if (res.statusCode >= 400) {
              reject(new Error(`Status check error: ${res.statusCode} ${data}`));
            } else {
              try {
                resolve(JSON.parse(data));
              } catch (parseError) {
                console.error('❌ Status JSON parse error:', parseError);
                console.error('❌ Raw status response:', data);
                reject(new Error(`Invalid status JSON response: ${data}`));
              }
            }
          });
        });
        req.on('error', reject);
        req.end();
      });

      attempts++;
    }

    console.log('Final status:', finalPrediction.status);

    if (finalPrediction.status === 'succeeded' && finalPrediction.output) {
      console.log('✅ Music generation succeeded!');
      res.json({ audioUrl: finalPrediction.output });
    } else {
      console.error('❌ Music generation failed:', finalPrediction);
      const errorMessage = finalPrediction.error || 'Music generation failed or timed out';
      res.status(500).json({ error: errorMessage });
    }

  } catch (error) {
    console.error('Replicate API error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});