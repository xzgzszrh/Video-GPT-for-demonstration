import { StreamingTextResponse } from 'ai';

export const runtime = "edge";

const CUSTOM_API_KEY = process.env.CHAT_API_KEY;
const CUSTOM_BASE_URL = process.env.CHAT_API_BASE_URL;

const systemMessage = (lang) => {
  // 根据语言选择对应的系统提示词，默认使用英文
  const message = lang === 'zh' 
    ? process.env.CHAT_SYSTEM_MESSAGE_ZH 
    : process.env.CHAT_SYSTEM_MESSAGE_EN;
  
  // 如果环境变量中没有设置系统提示词，使用默认值
  return message || 'You are a helpful AI assistant that helps users with their questions and tasks.';
};

export async function POST(req) {
  const json = await req.json();
  const { messages, lang, token } = json;

  // 优先级：前端传入的token > 环境变量 > 代码中的固定值
  const apiKey = token || CUSTOM_API_KEY;

  if (!apiKey) {
    return Response.json({
      error: "No API key provided.",
    });
  }

  const params = {
    model: "claude-3-5-sonnet",
    stream: true,
    temperature: 1.0,
    messages: [{ role: "system", content: systemMessage(lang) }].concat(messages),
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
