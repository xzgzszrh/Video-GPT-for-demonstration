import OpenAI from "openai";

export const runtime = "edge";

// 在这里定义你的自定义 API key 和 base URL
const CUSTOM_API_KEY = process.env.STT_API_KEY;
const CUSTOM_BASE_URL = process.env.STT_API_BASE_URL;

// 定义重试次数和超时设置
const MAX_RETRIES = 3;
const TIMEOUT_MS = 30000; // 30秒超时

/**
 * 带重试机制的延迟函数
 * @param ms 延迟毫秒数
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: Request) {
  console.log("[STT] Received speech-to-text request");
  console.log(`[STT] Using API base URL: ${CUSTOM_BASE_URL}`);
  
  try {
    const formData = await req.formData();
    console.log("[STT] Successfully parsed form data");
    
    const file = formData.get("file") as File;
    const lang = formData.get("lang") as string;
    
    console.log(`[STT] Request parameters - Language: ${lang}, File size: ${file ? file.size : 'N/A'} bytes, File type: ${file ? file.type : 'N/A'}`);

    if (!CUSTOM_API_KEY) {
      console.error("[STT] Error: No API key provided");
      return Response.json({
        error: "No API key provided.",
      });
    }

    if (!file) {
      console.error("[STT] Error: No audio file provided");
      return Response.json({
        error: "No audio file provided.",
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
          language: lang,
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
