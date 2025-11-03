// Service for calling Replicate API through our Node.js endpoint
export async function generateMusicWithReplicate(musicDetail: string, lyrics: string): Promise<string> {
    try {
        console.log("🎵 Starting Replicate music generation via API endpoint...");
        console.log("📝 Lyrics:", lyrics.substring(0, 100) + "...");
        console.log("🎼 Music style:", musicDetail);
        
        const response = await fetch('/api/generate-music', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lyrics: lyrics,
                prompt: musicDetail || 'upbeat pop song'
            })
        });
        
        console.log("📡 API Response status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error("❌ API Error:", errorData);
            throw new Error(`API error: ${response.status} - ${errorData.error || response.statusText}`);
        }
        
        const data = await response.json();
        console.log("✅ API Response data:", data);
        
        if (!data.audioUrl) {
            throw new Error("No audio URL received from API");
        }
        
        console.log("🔗 Received audio URL from Replicate:", data.audioUrl);
        
        // Fetch the audio file and convert to base64
        console.log("📥 Fetching audio from URL:", data.audioUrl);
        const audioResponse = await fetch(data.audioUrl);
        if (!audioResponse.ok) {
            throw new Error(`Failed to fetch audio: ${audioResponse.statusText}`);
        }
        
        console.log("📦 Audio response headers:", Object.fromEntries(audioResponse.headers.entries()));
        
        const arrayBuffer = await audioResponse.arrayBuffer();
        console.log("📊 Audio buffer size:", arrayBuffer.byteLength, "bytes");
        
        // Convert to base64 efficiently for large files
        const uint8Array = new Uint8Array(arrayBuffer);
        let binaryString = '';
        const chunkSize = 8192; // Process in chunks to avoid stack overflow
        
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
            const chunk = uint8Array.slice(i, i + chunkSize);
            binaryString += String.fromCharCode(...chunk);
        }
        
        const base64Audio = btoa(binaryString);
        
        console.log("🎶 Successfully converted Replicate audio to base64, length:", base64Audio.length);
        
        return base64Audio;
    } catch (error) {
        console.error("💥 Error calling Replicate API via endpoint:", error);
        throw error;
    }
}