export const runtime = "edge";

export async function POST(req: Request) {
  // 复制请求以便后续处理
  const clonedReq = req.clone();
  
  const formData = await req.formData();
  const input = formData.get("input") as string;
  const mode = formData.get("mode") as string;
  const token = formData.get("token") as string;
  
  // 使用环境变量中的TTS_PROVIDER配置，若存在则优先使用环境变量中的配置
  const envProvider = process.env.TTS_PROVIDER?.toLowerCase();
  // 优先级：环境变量中的TTS_PROVIDER > 请求输入的mode
  const ttsProvider = envProvider || mode || 'volcano';
  
  console.log('TTS Request:', {
    input: input.substring(0, 100) + '...', // 只打印前100个字符
    requestedMode: mode,
    actualProvider: ttsProvider,
    envProvider: envProvider || 'not set',
    timestamp: new Date().toISOString()
  });
  
  if (ttsProvider === 'openai') {
    console.log('Using OpenAI TTS service');
    try {
      // 导入OpenAI TTS处理函数
      const { POST: openaiTtsHandler } = await import('./route-OpenAI');
      // 直接调用处理函数，传入复制的请求
      return openaiTtsHandler(clonedReq);
    } catch (error) {
      console.error('Error calling OpenAI TTS handler:', error);
      return Response.json({
        error: "Failed to process OpenAI TTS request.",
        details: error.message
      }, { status: 500 });
    }
  }
  
  // 默认使用火山引擎TTS（克隆模式）
  console.log('Using Volcano TTS service');
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

  console.log('Volcano TTS Request Body:', {
    ...requestBody,
    app: {
      ...requestBody.app,
      token: '***' // 隐藏敏感信息
    },
    request: {
      ...requestBody.request,
      text: input.substring(0, 100) + '...' // 只打印前100个字符
    }
  });

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

    console.log('Volcano TTS Response Status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Volcano TTS Response:', {
      code: data.code,
      message: data.message,
      hasData: !!data.data
    });

    if (data.code !== 3000) {
      throw new Error(`API error! message: ${data.message}`);
    }

    const audioBuffer = Buffer.from(data.data, 'base64');
    console.log('Audio Buffer Size:', audioBuffer.length, 'bytes');

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString()
      }
    });
  } catch (error) {
    console.error('TTS Error:', {
      message: error.message,
      stack: error.stack
    });
    return Response.json({
      error: "Failed to generate audio.",
      details: error.message
    }, { status: 500 });
  }
}
