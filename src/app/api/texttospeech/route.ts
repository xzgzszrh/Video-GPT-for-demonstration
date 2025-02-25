export const runtime = "edge";

export async function POST(req: Request) {
  const formData = await req.formData();
  const input = formData.get("input") as string;
  
  // 根据环境变量选择TTS提供商
  const provider = process.env.TTS_PROVIDER || 'volcano';
  
  if (provider === 'openai') {
    // 使用OpenAI的TTS服务
    const response = await fetch('/api/texttospeech/route-OpenAI', {
      method: 'POST',
      body: formData,
    });
    return response;
  }
  
  // 默认使用火山引擎TTS
  const requestBody = {
    app: {
      appid: process.env.VOLCANO_APP_ID,
      token: process.env.VOLCANO_TOKEN,
      cluster: process.env.VOLCANO_CLUSTER
    },
    user: {
      uid: "uid123"
    },
    audio: {
      voice_type: process.env.VOLCANO_VOICE_TYPE,
      encoding: "mp3",
      speed_ratio: 0.9
    },
    request: {
      reqid: "uuid",
      text: input,
      operation: "query"
    }
  };

  try {
    const response = await fetch('https://openspeech.bytedance.com/api/v1/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer;${process.env.VOLCANO_TOKEN}`,
        'Resource-Id': 'volc.megatts.voiceclone',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 3000) {
      throw new Error(`API error! message: ${data.message}`);
    }

    const audioBuffer = Buffer.from(data.data, 'base64');

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString()
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({
      error: "Failed to generate audio.",
      details: error.message
    }, { status: 500 });
  }
}
