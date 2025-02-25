import OpenAI from "openai";

export const runtime = "edge";

const CUSTOM_API_KEY = process.env.OPENAI_TTS_API_KEY;
const CUSTOM_BASE_URL = process.env.OPENAI_TTS_BASE_URL;

export async function POST(req: Request) {
  console.log('OpenAI TTS Config:', {
    baseURL: CUSTOM_BASE_URL,
    hasApiKey: !!CUSTOM_API_KEY
  });

  const formData = await req.formData();
  const input = formData.get("input") as string;

  console.log('OpenAI TTS Request:', {
    input: input.substring(0, 100) + '...',
    timestamp: new Date().toISOString()
  });

  if (!CUSTOM_API_KEY) {
    console.error('OpenAI TTS Error: No API key provided');
    return Response.json({
      error: "No API key provided.",
    }, { status: 401 });
  }

  const openai = new OpenAI({
    apiKey: CUSTOM_API_KEY,
    baseURL: CUSTOM_BASE_URL,
  });

  try {
    console.log('Creating OpenAI speech...');
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "onyx",
      input,
      speed: 1.0,
      response_format: "opus", 
    });

    console.log('OpenAI speech created successfully');
    
    // Fetching the audio data as an ArrayBuffer
    const arrayBuffer = await mp3.arrayBuffer();
    console.log('Audio buffer size:', arrayBuffer.byteLength, 'bytes');

    // Converting ArrayBuffer to Blob
    const blob = new Blob([arrayBuffer], { type: "audio/opus" });

    // Returning the Blob directly to the client
    return new Response(blob, {
      headers: {
        "Content-Type": "audio/opus", 
        "Content-Length": blob.size.toString()
      },
    });
  } catch (error) {
    console.error('OpenAI TTS Error:', {
      message: error.message,
      stack: error.stack,
      config: {
        baseURL: CUSTOM_BASE_URL,
        hasApiKey: !!CUSTOM_API_KEY
      }
    });
    
    return Response.json({
      error: "An error occurred during the OpenAI request.",
      details: error.message,
    }, { status: 500 });
  }
}
