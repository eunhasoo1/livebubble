import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { NextResponse } from 'next/server';

const apiKey = process.env.ELEVENLABS_API_KEY;
const client = apiKey ? new ElevenLabsClient({ apiKey }) : null;

export async function POST(request: Request) {
  try {
    if (!client) {
      return NextResponse.json(
        { error: 'ElevenLabs API key is not configured' },
        { status: 500 }
      );
    }

    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Using 'Rachel' voice ID: pNInz6obpgnuMvoWJtJC
    const audioStream = await client.textToSpeech.convert('gH1BJ9aP8S5NK4ekwipB', {
      text,
      modelId: 'eleven_multilingual_v2',
      outputFormat: 'mp3_44100_128',
      optimizeStreamingLatency: 4,
    });

    // The elevenlabs-js client returns a stream or a buffer.
    // In Next.js Route Handlers, we can return a Response with the stream.
    return new Response(audioStream as any, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error: any) {
    console.error('ElevenLabs TTS error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate speech' },
      { status: 500 }
    );
  }
}
