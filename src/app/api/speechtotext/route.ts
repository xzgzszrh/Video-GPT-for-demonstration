import OpenAI from "openai";

export const runtime = "edge";

// 在这里定义你的自定义 API key 和 base URL
const CUSTOM_API_KEY = process.env.STT_API_KEY;
const CUSTOM_BASE_URL = process.env.STT_API_BASE_URL;

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const lang = formData.get("lang") as string;

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
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      language: "zh",
    });

    return Response.json(transcription);
  } catch (error) {
    return Response.json({
      error: "An error occurred during transcription.",
      details: error.message,
    }, { status: 500 });
  }
}
