import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
    console.warn("VITE_API_KEY environment variable not set. Gemini AI features will not work.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export async function generateLyrics(musicDetail: string, songName?: string): Promise<string> {
    if (!ai) throw new Error("Gemini AI not initialized. Check API Key.");
    
    try {
        const prompt = `Create compelling song lyrics with the following specifications:

${songName ? `Song Title: "${songName}"` : ''}
Musical Style/Theme: "${musicDetail || 'upbeat pop song'}"

Requirements:
- Write lyrics that reflect the song title and musical theme
- Create a cohesive narrative or emotional journey
- Use vivid imagery and relatable emotions
- Keep the language natural and singable
- Structure should flow well for musical performance
- CRITICAL: Keep the total length to max of 600 characters (including spaces and line breaks)
- Avoid clichés, aim for originality and authenticity

Do not include structural labels like [Verse], [Chorus], [Bridge]. Just provide the raw lyrics with natural line breaks.

Focus on creating lyrics that would genuinely connect with listeners and complement the specified musical style. Keep it concise but impactful.`;
        
        const response = await ai.models.generateContent({ 
            model: "gemini-2.5-flash", 
            contents: prompt 
        });
        
        const lyricsText = response.text;
        if (!lyricsText) throw new Error("No lyrics were generated.");
        
        return lyricsText.trim();
    } catch (error) {
        console.error("Error calling Gemini API for lyrics:", error);
        throw new Error("Failed to generate lyrics from Gemini API.");
    }
}