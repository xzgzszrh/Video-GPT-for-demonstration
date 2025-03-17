import { NextResponse } from 'next/server';

export const runtime = "edge";

// 使用环境变量中的情绪识别API密钥
const EMOTION_API_KEY = process.env.EMOTION_API_KEY;
const CUSTOM_BASE_URL = process.env.EMOTION_API_BASE_URL || 'https://cloud.fastgpt.cn/api/v1';

export async function POST(req) {
  try {
    const { text, image_url, token } = await req.json();
    
    // 优先使用前端传入的token，否则使用环境变量中的EMOTION_API_KEY
    const apiKey = token || EMOTION_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        error: "No API key provided for emotion recognition.",
        score: null
      }, { status: 400 });
    }
    
    if (!text || !image_url) {
      return NextResponse.json({
        error: "Missing text or image_url.",
        score: null
      }, { status: 400 });
    }
    
    // 构建发送给LLM的消息
    const messages = [
      {
        role: "system",
        content: "你是一个情绪分析专家，负责分析驾驶员的情绪并评估其对驾驶安全的影响。你将观察驾驶员的行为、面部表情和对话内容，以判断驾驶员当前的情绪状态。基于情绪对驾驶安全的潜在影响，请根据以下标准评估情绪的严重程度，并将其划分为0到9的等级：0：情绪极佳，完全不会影响驾驶。2：情绪良好，可能会有轻微影响，但不至于影响驾驶安全。5：情绪中等，可能会导致注意力分散或轻微的驾驶干扰。7：情绪较严重，可能会显著影响驾驶集中力或判断。9：情绪非常严重，可能导致危险驾驶或完全失去对车辆控制。当你评估时，只有以下情绪对驾驶影响需要考虑：愤怒、悲伤、惊恐、厌恶、惊讶、过于开心、身体不适。请根据情绪的严重程度给出一个等级（0-9）。如果你无法判断当前情绪状态是否会影响驾驶，请输出5。请仅返回一个数字，并避免任何其他文字描述。"
      },
      {
        role: "user",
        content: [
          { type: "text", text: text },
          {
            type: "image_url",
            image_url: {
              url: image_url
            }
          }
        ]
      }
    ];
    
    // 发送请求到LLM API
    const response = await fetch(`${CUSTOM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // 使用支持视觉的模型
        messages: messages,
        max_tokens: 10,
        temperature: 0.2 // 低温度以获得更一致的结果
      })
    });
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return NextResponse.json({
        error: `HTTP error! status: ${response.status}`,
        score: null
      }, { status: response.status });
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();
    
    // 解析返回的内容为数字或null
    let score = null;
    if (content === 'null') {
      score = null;
    } else {
      const parsedScore = parseInt(content, 10);
      if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 9) {
        score = parsedScore;
      }
    }
    
    return NextResponse.json({ score });
  } catch (error) {
    console.error('Error in emotion recognition:', error);
    return NextResponse.json({
      error: "An error occurred during emotion recognition.",
      details: error.message,
      score: null
    }, { status: 500 });
  }
}
