import { StreamingTextResponse } from 'ai';

export const runtime = "edge";

// 定义不同场景的API密钥
const API_KEYS = {
  demo: process.env.CHAT_API_KEY_DEMO,
  scene1: process.env.CHAT_API_KEY_SCENE1,
  scene2: process.env.CHAT_API_KEY_SCENE2,
  scene3: process.env.CHAT_API_KEY_SCENE3,
};

const CUSTOM_BASE_URL = process.env.CHAT_API_BASE_URL;

export async function POST(req) {
  const json = await req.json();
  const { messages, lang, token, scene = 'demo' } = json;

  // 根据场景选择API密钥
  const sceneApiKey = API_KEYS[scene];
  // 优先级：前端传入的token > 场景对应的密钥
  const apiKey = token || sceneApiKey;

  if (!apiKey) {
    return Response.json({
      error: "No API key provided.",
    });
  }

  const params = {
    model: "claude-3-5-sonnet",
    stream: true,
    temperature: 1.0,
    messages: messages,
    max_tokens: 2000,
  };
  
  console.log('Request parameters:', params);
  
  try {
    const response = await fetch(`${CUSTOM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                controller.close();
                return;
              }
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0]?.delta?.content || '';
                if (content) {
                  controller.enqueue(content);
                }
              } catch (e) {
                console.error('Error parsing JSON:', e);
              }
            }
          }
        }

        controller.close();
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in request:', error);
    return Response.json({
      error: "An error occurred during the request.",
      details: error.message,
    }, { status: 500 });
  }
}
