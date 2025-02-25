import OpenAI from "openai";

export const runtime = "edge";

// 在这里定义你的自定义 API key 和 base URL
const CUSTOM_API_KEY = process.env.OPENAI_TTS_API_KEY;
const CUSTOM_BASE_URL = process.env.OPENAI_TTS_BASE_URL;

export async function POST(req: Request) {
  const formData = await req.formData();
  const input = formData.get("input") as string;

  if (!CUSTOM_API_KEY) {
    return Response.json({
      error: "No API key provided.",
    });
  }

  const openai = new OpenAI({
    apiKey: CUSTOM_API_KEY,
    baseURL: CUSTOM_BASE_URL,
  });

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "onyx",
      input,
      speed: 1.0,
      response_format: "opus",
    });

    // Fetching the audio data as an ArrayBuffer
    const arrayBuffer = await mp3.arrayBuffer();

    // Converting ArrayBuffer to Blob
    const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });

    // Returning the Blob directly to the client
    return new Response(blob, {
      headers: {
        "Content-Type": "audio/ogg",
      },
    });
  } catch (error) {
    console.error('Error in OpenAI request:', error);
    return Response.json({
      error: "An error occurred during the OpenAI request.",
      details: error.message,
    }, { status: 500 });
  }
}
