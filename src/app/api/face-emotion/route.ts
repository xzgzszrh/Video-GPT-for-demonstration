import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Function to get Baidu access token
async function getBaiduAccessToken() {
  const clientId = process.env.BAIDU_API_KEY;
  const clientSecret = process.env.BAIDU_SECRET_KEY;
  
  if (!clientId || !clientSecret) {
    throw new Error("Baidu API credentials not configured");
  }
  
  try {
    const response = await axios.get(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
    );
    
    if (response.data && response.data.access_token) {
      return response.data.access_token;
    } else {
      throw new Error("Failed to get access token from Baidu API");
    }
  } catch (error) {
    console.error("Error getting Baidu access token:", error);
    throw error;
  }
}

// Function to detect faces using Baidu API
async function detectFaces(imageBase64: string) {
  try {
    const accessToken = await getBaiduAccessToken();
    
    const response = await axios.post(
      `https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=${accessToken}`,
      {
        image: imageBase64,
        image_type: "BASE64",
        face_field: "age,expression,emotion",
        max_face_num: 10,
        face_type: "LIVE"
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error detecting faces:", error);
    throw error;
  }
}

// Rate limiting variables
const requestTimestamps: { [ip: string]: number } = {};
const RATE_LIMIT_WINDOW = 1000; // 1 second in milliseconds

export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = req.headers.get("x-forwarded-for") || "unknown";
    
    // Apply rate limiting
    const now = Date.now();
    const lastRequestTime = requestTimestamps[clientIp] || 0;
    
    if (now - lastRequestTime < RATE_LIMIT_WINDOW) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded", 
          message: "Please wait before making another request",
          retryAfter: Math.ceil((RATE_LIMIT_WINDOW - (now - lastRequestTime)) / 1000)
        },
        { status: 429 }
      );
    }
    
    // Update timestamp for rate limiting
    requestTimestamps[clientIp] = now;
    
    // Get image data from request
    const data = await req.json();
    const { image } = data;
    
    if (!image) {
      return NextResponse.json(
        { error: "Missing image data" },
        { status: 400 }
      );
    }
    
    // Remove data:image/jpeg;base64, prefix if present
    const base64Image = image.replace(/^data:image\/(jpeg|png|jpg|bmp);base64,/, "");
    
    // Call Baidu API to detect faces
    const result = await detectFaces(base64Image);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in face emotion analysis:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to analyze face emotion", 
        message: error.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}
