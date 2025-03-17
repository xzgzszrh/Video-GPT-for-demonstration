import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface RequestBody {
  appid: string;
  speaker_id: string;
  audios: {
    audio_bytes: string;
    audio_format: string;
  }[];
  source: number;
  language: number;
  model_type: number;
  text?: string; // Optional text property
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const text = formData.get("text") as string || "";
    const language = formData.get("language") as string || "cn";
    const modelType = formData.get("model_type") as string || "1";

    if (!audioFile) {
      return NextResponse.json(
        { error: "Missing audio file" },
        { status: 400 }
      );
    }

    // 获取环境变量
    const appId = process.env.VOLCANO_APP_ID;
    const token = process.env.VOLCANO_TOKEN;
    const spkId = process.env.VOLCANO_VOICE_TYPE;

    if (!appId || !token) {
      return NextResponse.json(
        { error: "Missing Volcano API credentials" },
        { status: 500 }
      );
    }

    // 准备音频数据
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const audioBase64 = audioBuffer.toString('base64');
    
    // 获取文件格式
    // 从文件名获取格式
    let audioFormat = '';
    const fileName = audioFile.name.toLowerCase();
    if (fileName.endsWith('.wav')) audioFormat = 'wav';
    else if (fileName.endsWith('.mp3')) audioFormat = 'mp3';
    else if (fileName.endsWith('.ogg')) audioFormat = 'ogg';
    else if (fileName.endsWith('.m4a')) audioFormat = 'm4a';
    else if (fileName.endsWith('.aac')) audioFormat = 'aac';
    else if (fileName.endsWith('.pcm')) audioFormat = 'pcm';
    else {
      // 如果文件名没有指示格式，则从MIME类型获取
      const mimeType = audioFile.type.split('/')[1];
      if (mimeType === 'mpeg') audioFormat = 'mp3';
      else audioFormat = mimeType;
    }
    
    console.log(`Audio file: ${audioFile.name}, type: ${audioFile.type}, format: ${audioFormat}, size: ${audioBuffer.length} bytes`);

    // 设置语言参数
    let langCode = 0; // 默认中文
    switch(language) {
      case "en": langCode = 1; break;
      case "ja": langCode = 2; break;
      case "es": langCode = 3; break;
      case "id": langCode = 4; break;
      case "pt": langCode = 5; break;
      default: langCode = 0; // 中文
    }

    // 创建请求头
    const headers = {
      'Authorization': `Bearer;${token}`,
      'Resource-Id': 'volc.megatts.voiceclone',
      'Content-Type': 'application/json'
    };

    // 创建请求体
    const requestBody: RequestBody = {
      appid: appId,
      speaker_id: spkId,
      audios: [{
        audio_bytes: audioBase64,
        audio_format: audioFormat
      }],
      source: 2,
      language: langCode,
      model_type: parseInt(modelType)
    };
    
    // 如果有文本，则添加文本
    if (text.trim()) {
      requestBody.text = text;
    }

    console.log('Request headers:', JSON.stringify(headers));
    console.log('Request body structure:', JSON.stringify({
      ...requestBody,
      audios: [{ audio_bytes: '[BASE64_AUDIO_DATA]', audio_format: requestBody.audios[0].audio_format }]
    }));

    // 发送请求到火山API
    const response = await axios.post(
      "https://openspeech.bytedance.com/api/v1/mega_tts/audio/upload",
      requestBody,
      { headers }
    );

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data));

    // 处理响应
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Voice clone error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response headers:", JSON.stringify(error.response.headers));
      console.error("Response data:", JSON.stringify(error.response.data));
    }
    
    return NextResponse.json(
      { 
        error: error.message || "An error occurred during voice cloning",
        details: error.response?.data || {},
        status: error.response?.status
      },
      { status: error.response?.status || 500 }
    );
  }
}

interface StatusRequestBody {
  appid: string;
  speaker_id: string;
}

// 状态查询API
export async function GET(req: NextRequest) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(req.url);
    const speakerId = searchParams.get('speaker_id') || process.env.VOLCANO_VOICE_TYPE;

    // 获取环境变量
    const appId = process.env.VOLCANO_APP_ID;
    const token = process.env.VOLCANO_TOKEN;

    if (!appId || !token || !speakerId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // 创建请求头
    const headers = {
      'Authorization': `Bearer;${token}`,
      'Resource-Id': 'volc.megatts.voiceclone',
      'Content-Type': 'application/json'
    };

    // 创建请求体
    const requestBody: StatusRequestBody = {
      appid: appId,
      speaker_id: speakerId
    };

    console.log('Status check headers:', JSON.stringify(headers));
    console.log('Status check body:', JSON.stringify(requestBody));

    // 发送请求到火山API
    const response = await axios.post(
      "https://openspeech.bytedance.com/api/v1/mega_tts/status",
      requestBody,
      { headers }
    );

    console.log('Status response:', JSON.stringify(response.data));

    // 处理响应
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Voice clone status error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response headers:", JSON.stringify(error.response.headers));
      console.error("Response data:", JSON.stringify(error.response.data));
    }
    
    return NextResponse.json(
      { 
        error: error.message || "An error occurred while checking voice clone status",
        details: error.response?.data || {},
        status: error.response?.status
      },
      { status: error.response?.status || 500 }
    );
  }
}
