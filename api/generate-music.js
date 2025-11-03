// Simple Node.js API endpoint for Replicate music generation
import https from 'https';

export default async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { lyrics, prompt } = req.body;
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

  if (!REPLICATE_API_TOKEN) {
    res.status(500).json({ error: 'Replicate API token not configured' });
    return;
  }

  try {
    // Create prediction
    const predictionData = JSON.stringify({
      input: { lyrics, prompt }
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
          if (res.statusCode >= 400) {
            reject(new Error(`API error: ${res.statusCode} ${data}`));
          } else {
            resolve(JSON.parse(data));
          }
        });
      });
      req.on('error', reject);
      req.write(predictionData);
      req.end();
    });

    // Poll for completion
    const predictionId = prediction.id;
    let finalPrediction = prediction;
    let attempts = 0;
    const maxAttempts = 60;

    while ((finalPrediction.status === 'starting' || finalPrediction.status === 'processing') && attempts < maxAttempts) {
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
            if (res.statusCode >= 400) {
              reject(new Error(`Status check error: ${res.statusCode} ${data}`));
            } else {
              resolve(JSON.parse(data));
            }
          });
        });
        req.on('error', reject);
        req.end();
      });

      attempts++;
    }

    if (finalPrediction.status === 'succeeded' && finalPrediction.output) {
      res.json({ audioUrl: finalPrediction.output });
    } else {
      res.status(500).json({ error: 'Music generation failed or timed out' });
    }

  } catch (error) {
    console.error('Replicate API error:', error);
    res.status(500).json({ error: error.message });
  }
};