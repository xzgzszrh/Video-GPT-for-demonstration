import OpenAI from "openai";

export const runtime = "edge";

// 在这里定义你的自定义 API key 和 base URL
const CUSTOM_API_KEY = process.env.STT_API_KEY;
const CUSTOM_BASE_URL = process.env.STT_API_BASE_URL;

// 百度语音识别API相关配置
const BAIDU_APP_ID = process.env.BAIDU_VOICE_APP_ID;
const BAIDU_API_KEY = process.env.BAIDU_VOICE_API_KEY;
const BAIDU_SECRET_KEY = process.env.BAIDU_VOICE_SECRET_KEY;

// 语音识别提供商选择
const STT_PROVIDER = process.env.STT_PROVIDER || 'openai'; // 默认使用OpenAI

// 定义重试次数和超时设置
const MAX_RETRIES = 3;
const TIMEOUT_MS = 30000; // 30秒超时

/**
 * 带重试机制的延迟函数
 * @param ms 延迟毫秒数
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 生成唯一标识符 (替代 crypto.createHash)
 */
async function generateUniqueId() {
  // 使用当前时间戳和随机数生成唯一ID
  const timestamp = Date.now().toString();
  const randomNum = Math.random().toString();
  const data = new TextEncoder().encode(timestamp + randomNum);
  
  // 使用 Web Crypto API 计算 SHA-256 哈希
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // 将哈希值转换为十六进制字符串
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex.slice(0, 32); // 截取前32个字符作为ID
}

/**
 * 获取百度API的access_token
 */
async function getBaiduAccessToken() {
  const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_API_KEY}&client_secret=${BAIDU_SECRET_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get Baidu access token: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error(`[STT] Error getting Baidu access token: ${error.message}`);
    throw error;
  }
}

/**
 * 使用百度API进行语音识别
 */
async function baiduSpeechToText(file: File) {
  console.log(`[STT] Using Baidu API for speech recognition, file type: ${file.type}, size: ${file.size} bytes`);
  
  try {
    // 获取access_token
    const accessToken = await getBaiduAccessToken();
    console.log(`[STT] Successfully obtained Baidu access token`);
    
    // 准备音频数据
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const base64Data = btoa(String.fromCharCode.apply(null, buffer));
    
    // 准备请求参数
    const speechLength = buffer.length;
    const cuid = await generateUniqueId(); // 生成唯一标识符
    
    // 构建请求体
    const requestBody = {
      format: 'm4a', // 音频格式，使用wav格式（16位编码）
      rate: 16000, // 采样率，16kHz
      channel: 1, // 声道数，单声道
      cuid: cuid,
      token: accessToken,
      speech: base64Data,
      len: speechLength,
      dev_pid: 80001 // 添加dev_pid参数，值为80001，表示识别普通话
    };
    
    console.log(`[STT] Baidu API request parameters: format=${requestBody.format}, rate=${requestBody.rate}, channel=${requestBody.channel}, speech length=${requestBody.len}`);
    
    // 发送请求到百度API
    const response = await fetch('https://vop.baidu.com/pro_api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`Baidu API request failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // 检查返回结果
    if (result.err_no !== 0) {
      throw new Error(`Baidu API error: ${result.err_msg}, code: ${result.err_no}`);
    }
    
    console.log(`[STT] Baidu API raw result: ${JSON.stringify(result)}`);
    
    // 返回与OpenAI格式兼容的结果
    return {
      text: Array.isArray(result.result) ? result.result[0] || "" : "",
      _original: result // 保留原始结果以便调试
    };
  } catch (error) {
    console.error(`[STT] Baidu speech recognition error: ${error.message}`);
    throw error;
  }
}

export async function POST(req: Request) {
  console.log(`[STT] Received speech-to-text request using provider: ${STT_PROVIDER}`);
  
  try {
    const formData = await req.formData();
    console.log("[STT] Successfully parsed form data");
    
    const file = formData.get("file") as File;
    
    console.log(`[STT] Request parameters - File size: ${file ? file.size : 'N/A'} bytes, File type: ${file ? file.type : 'N/A'}`);

    if (!file) {
      console.error("[STT] Error: No audio file provided");
      return Response.json({
        error: "No audio file provided.",
      });
    }

    // 根据提供商选择不同的语音识别服务
    if (STT_PROVIDER === 'baidu') {
      // 检查百度API所需的凭据
      if (!BAIDU_API_KEY || !BAIDU_SECRET_KEY) {
        console.error("[STT] Error: Missing Baidu API credentials");
        return Response.json({
          error: "Missing Baidu API credentials.",
        });
      }
      
      try {
        // 使用百度API进行语音识别
        const transcription = await baiduSpeechToText(file);
        console.log(`[STT] Baidu transcription successful, text: ${transcription.text.substring(0, 50)}${transcription.text.length > 50 ? '...' : ''}`);
        return Response.json(transcription);
      } catch (error) {
        console.error(`[STT] Baidu transcription failed: ${error.message}`);
        return Response.json({
          error: "Baidu speech recognition failed.",
          details: error.message
        }, { status: 500 });
      }
    } else {
      // 默认使用OpenAI API
      if (!CUSTOM_API_KEY) {
        console.error("[STT] Error: No OpenAI API key provided");
        return Response.json({
          error: "No OpenAI API key provided.",
        });
      }

      console.log(`[STT] Initializing OpenAI client with base URL: ${CUSTOM_BASE_URL || 'default OpenAI URL'}`);
      const openai = new OpenAI({
        apiKey: CUSTOM_API_KEY,
        baseURL: CUSTOM_BASE_URL,
        timeout: TIMEOUT_MS,
        maxRetries: MAX_RETRIES,
      });

      let retries = 0;
      let lastError = null;

      // 实现重试逻辑
      while (retries <= MAX_RETRIES) {
        try {
          console.log(`[STT] Attempt ${retries + 1}/${MAX_RETRIES + 1}: Sending transcription request to OpenAI API`);
          console.log(`[STT] Network info - API URL: ${CUSTOM_BASE_URL}, Timeout: ${TIMEOUT_MS}ms`);
          
          const startTime = Date.now();
          const transcription = await openai.audio.transcriptions.create({
            file,
            model: "whisper-1",
            language: "en",
          });
          const endTime = Date.now();

          console.log(`[STT] Transcription successful, took ${endTime - startTime}ms, text length: ${transcription.text.length} characters`);
          return Response.json(transcription);
        } catch (error) {
          lastError = error;
          retries++;
          
          // 记录详细的错误信息
          console.error(`[STT] Attempt ${retries}/${MAX_RETRIES + 1} failed: ${error.message}`);
          
          if (error.message.includes('Connection') || error.message.includes('ECONNREFUSED') || 
              error.message.includes('timeout') || error.message.includes('network')) {
            console.error(`[STT] Network error detected: ${error.message}`);
            
            // 如果还有重试次数，则等待后重试
            if (retries <= MAX_RETRIES) {
              const waitTime = 1000 * retries; // 递增等待时间
              console.log(`[STT] Waiting ${waitTime}ms before retry ${retries}`);
              await delay(waitTime);
              continue;
            }
          } else {
            // 非网络错误直接跳出循环
            console.error(`[STT] Non-network error, not retrying: ${error.message}`);
            break;
          }
        }
      }

      // 所有重试都失败，返回详细错误信息
      console.error(`[STT] All ${MAX_RETRIES + 1} attempts failed`);
      console.error(`[STT] Final error during processing: ${lastError.message}`);
      console.error(`[STT] Error stack: ${lastError.stack}`);
      
      // 网络诊断信息
      console.log(`[STT] Network diagnostic - API URL: ${CUSTOM_BASE_URL}, API Key length: ${CUSTOM_API_KEY?.length || 0}`);
      
      // 构建详细的错误信息对象
      const errorDetails = {
        name: lastError.name,
        message: lastError.message,
        stack: lastError.stack,
        code: lastError.code,
        status: lastError.status,
        response: lastError.response ? {
          status: lastError.response.status,
          statusText: lastError.response.statusText,
          headers: JSON.stringify(Object.fromEntries(lastError.response.headers || [])),
          data: lastError.response.data
        } : 'No response data',
        networkInfo: {
          apiBaseUrl: CUSTOM_BASE_URL,
          timeout: TIMEOUT_MS,
          retries: MAX_RETRIES,
          fileSize: file ? file.size : 'N/A',
          fileType: file ? file.type : 'N/A'
        }
      };
      
      console.error(`[STT] Detailed error information: ${JSON.stringify(errorDetails, null, 2)}`);
      
      return Response.json({
        error: "An error occurred during transcription after multiple retries.",
        details: lastError.message,
        errorInfo: errorDetails
      }, { status: 500 });
    }
  } catch (error) {
    // 处理整体流程中的错误
    console.error(`[STT] Unexpected error in request processing: ${error.message}`);
    console.error(`[STT] Error stack: ${error.stack}`);
    
    return Response.json({
      error: "An unexpected error occurred while processing the request.",
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
