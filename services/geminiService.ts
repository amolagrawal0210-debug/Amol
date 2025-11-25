import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

// Initialize client
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Writes a string to a DataView for WAV header construction.
 */
const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

/**
 * Wraps raw PCM data in a WAV container.
 * Gemini TTS typically returns 24kHz, 16-bit mono PCM.
 */
const pcmToWav = (pcmData: Uint8Array, sampleRate: number = 24000, numChannels: number = 1, bitDepth: number = 16): Uint8Array => {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const totalDataLen = pcmData.length;
  const fileSize = totalDataLen + 36;

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, fileSize, true);
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true); // ByteRate
  view.setUint16(32, numChannels * (bitDepth / 8), true); // BlockAlign
  view.setUint16(34, bitDepth, true);

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, totalDataLen, true);

  // Combine header and data
  const wavBuffer = new Uint8Array(header.byteLength + pcmData.length);
  wavBuffer.set(new Uint8Array(header), 0);
  wavBuffer.set(pcmData, header.byteLength);

  return wavBuffer;
};

export type AccentType = 'Indian' | 'Hinglish' | 'American' | 'British' | 'Cybernetic';

// Map UI Voice IDs to Gemini API Voice Names
const VOICE_MAP: Record<string, string> = {
  'Kore': 'Kore',
  'Fenrir': 'Fenrir',
  'Puck': 'Puck',
  'Charon': 'Charon',
  'Zephyr': 'Zephyr',
  'RaviShastri': 'Fenrir', // Uses Fenrir as base
  'AakashChopra': 'Fenrir' // Uses Fenrir as base
};

/**
 * Generates speech from text using Gemini 2.5 Flash TTS.
 * @param userText The text to speak
 * @param voiceName The specific voice model to use
 * @param accent The desired accent/style
 */
export const generateSpeech = async (userText: string, voiceName: string = 'Kore', accent: AccentType = 'Hinglish'): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing.");
  }

  // 1. Determine Base Style Instruction based on Accent (Optimized for speed/brevity)
  let styleInstruction = "";
  
  switch (accent) {
    case 'Hinglish':
      styleInstruction = "Accent: Casual Hinglish. Tone: Youthful Indian.";
      break;
    case 'Indian':
      styleInstruction = "Accent: Professional Indian English. Tone: Formal.";
      break;
    case 'American':
      styleInstruction = "Accent: General American. Tone: Neutral Broadcast.";
      break;
    case 'British':
      styleInstruction = "Accent: British RP. Tone: Polished.";
      break;
    case 'Cybernetic':
      styleInstruction = "Accent: Robotic. Tone: Flat, Emotionless AI.";
      break;
    default:
      styleInstruction = "Speak naturally.";
  }

  // 2. Apply Specific Voice Persona Overrides (Prompt engineered for identity)
  if (voiceName === 'RaviShastri') {
    styleInstruction = "IMPERSONATE: Ravi Shastri (Cricket Commentator). Style: High energy, booming voice, electric enthusiasm. Accent: Loud Indian English.";
  } else if (voiceName === 'AakashChopra') {
    styleInstruction = "IMPERSONATE: Aakash Chopra (Cricket Commentator). Style: Poetic, flowery, dramatic Hindi/Hinglish. Rhythm: Commentary cadence.";
  } else if (voiceName === 'Puck') {
    styleInstruction += " Tone: Playful, High-pitched.";
  } else if (voiceName === 'Charon') {
    styleInstruction += " Tone: Deep, Gravelly.";
  }

  const fullPrompt = `System: ${styleInstruction}\nInput: ${userText}`;

  // 3. Resolve actual API voice name
  const apiVoiceName = VOICE_MAP[voiceName] || 'Kore';

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [
        {
          parts: [{ text: fullPrompt }]
        }
      ],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: apiVoiceName 
            }
          }
        }
      }
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(part => part.inlineData);

    if (!audioPart || !audioPart.inlineData || !audioPart.inlineData.data) {
      throw new Error("Gemini returned no audio.");
    }

    const base64Audio = audioPart.inlineData.data;
    
    // Convert Base64 to raw PCM binary
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Convert Raw PCM to WAV
    const wavBytes = pcmToWav(bytes);

    // Create Blob with correct WAV MIME type
    const blob = new Blob([wavBytes], { type: 'audio/wav' });
    
    return URL.createObjectURL(blob);

  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    throw new Error(error.message || "Failed to generate audio.");
  }
};