"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function FaceEmotionPage() {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [faceData, setFaceData] = useState(null);
  const [error, setError] = useState("");
  const [selectedFace, setSelectedFace] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [imageSource, setImageSource] = useState("camera"); // "camera" or "upload"
  
  // Start the camera when component mounts or when returning to camera view
  useEffect(() => {
    if (!capturedImage && imageSource === "camera") {
      startCamera();
    }
    
    // Cleanup function to stop the camera when component unmounts
    return () => {
      stopCamera();
    };
  }, [capturedImage, imageSource]);
  
  // Function to stop the camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };
  
  // Function to start the camera
  const startCamera = async () => {
    try {
      // Stop any existing stream first
      stopCamera();
      
      console.log("Starting camera...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user" 
        } 
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        console.log("Camera started successfully");
      } else {
        console.error("Video element not available");
      }
      
      setError("");
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("无法访问摄像头，请确保您已授予摄像头权限。");
    }
  };
  
  // Function to capture image from video
  const captureImage = () => {
    if (!videoRef.current) {
      setError("视频元素未初始化");
      return;
    }
    
    try {
      const video = videoRef.current;
      
      // Create a temporary canvas element
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get data URL from canvas
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageDataUrl);
      setFaceData(null);
      setSelectedFace(null);
      console.log("Image captured successfully");
    } catch (err) {
      console.error("Error capturing image:", err);
      setError("拍照过程中出错: " + err.message);
    }
  };
  
  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      setError("请上传图片文件");
      return;
    }
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target.result);
        setFaceData(null);
        setSelectedFace(null);
        console.log("Image uploaded successfully");
      };
      reader.onerror = () => {
        setError("读取文件时出错");
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("上传图片过程中出错: " + err.message);
    }
  };
  
  // Function to trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Function to reset and return to camera view
  const resetCamera = () => {
    setCapturedImage(null);
    setFaceData(null);
    setSelectedFace(null);
    setError("");
    // Camera will restart automatically due to useEffect dependency on capturedImage
  };
  
  // Function to switch between camera and upload
  const switchImageSource = (source) => {
    setImageSource(source);
    setCapturedImage(null);
    setFaceData(null);
    setSelectedFace(null);
    setError("");
  };
  
  // Function to analyze the captured image
  const analyzeImage = async () => {
    if (!capturedImage) {
      setError("请先拍照或上传图片");
      return;
    }
    
    try {
      setAnalyzing(true);
      setError("");
      setFaceData(null);
      setSelectedFace(null);
      
      const response = await fetch("/api/face-emotion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: capturedImage
        })
      });
      
      const data = await response.json();
      
      if (response.status === 429) {
        // Rate limit exceeded
        setError(`请求频率过高，请等待 ${data.retryAfter || 1} 秒后再试`);
        setCountdown(data.retryAfter || 1);
        
        // Start countdown timer
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return;
      }
      
      if (!response.ok) {
        throw new Error(data.message || "分析失败");
      }
      
      if (data.error_code) {
        throw new Error(`百度API错误: ${data.error_msg}`);
      }
      
      // Check if faces were detected
      if (data.result && data.result.face_num > 0) {
        setFaceData(data.result);
        drawFacesOnImage(data.result.face_list);
      } else {
        setError("未检测到人脸");
      }
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError(err.message || "分析过程中出错");
    } finally {
      setAnalyzing(false);
    }
  };
  
  // Function to draw face rectangles on the image
  const drawFacesOnImage = (faceList) => {
    if (!faceList || faceList.length === 0) return;
    
    try {
      // Create a new canvas for displaying the result
      const canvas = document.createElement('canvas');
      const img = new Image();
      
      img.onload = () => {
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;
        
        const context = canvas.getContext('2d');
        
        // Draw the image
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Draw rectangles around faces
        faceList.forEach((face, index) => {
          const { left, top, width, height } = face.location;
          
          // Draw rectangle
          context.lineWidth = 3;
          context.strokeStyle = "#00FF00";
          context.strokeRect(left, top, width, height);
          
          // Add face number
          context.fillStyle = "#00FF00";
          context.font = "20px Arial";
          context.fillText(`${index + 1}`, left, top - 5);
        });
        
        // Update the displayed image with face rectangles
        setCapturedImage(canvas.toDataURL('image/jpeg'));
      };
      
      img.src = capturedImage;
    } catch (err) {
      console.error("Error drawing faces:", err);
      setError("绘制人脸框时出错: " + err.message);
    }
  };
  
  // Function to handle image click to select a face
  const handleImageClick = (event) => {
    if (!faceData || !faceData.face_list || faceData.face_list.length === 0) return;
    
    try {
      // Get the image element
      const img = event.target;
      if (!img) {
        console.error("Image element not found");
        return;
      }
      
      const rect = img.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Scale coordinates if image is displayed at a different size than its internal dimensions
      const naturalWidth = img.naturalWidth || img.width;
      const naturalHeight = img.naturalHeight || img.height;
      const scaleX = naturalWidth / rect.width;
      const scaleY = naturalHeight / rect.height;
      const scaledX = x * scaleX;
      const scaledY = y * scaleY;
      
      // Check if click is inside any face rectangle
      for (let i = 0; i < faceData.face_list.length; i++) {
        const face = faceData.face_list[i];
        const { left, top, width, height } = face.location;
        
        if (
          scaledX >= left && 
          scaledX <= left + width && 
          scaledY >= top && 
          scaledY <= top + height
        ) {
          setSelectedFace({
            ...face,
            index: i
          });
          return;
        }
      }
      
      // If click is not on any face, deselect
      setSelectedFace(null);
    } catch (err) {
      console.error("Error handling image click:", err);
    }
  };
  
  // Function to translate emotion type to Chinese
  const translateEmotion = (type) => {
    const emotionMap = {
      angry: "愤怒",
      disgust: "厌恶",
      fear: "恐惧",
      happy: "高兴",
      sad: "伤心",
      surprise: "惊讶",
      neutral: "无表情",
      pouty: "撅嘴",
      grimace: "鬼脸"
    };
    
    return emotionMap[type] || type;
  };
  
  // Function to translate expression type to Chinese
  const translateExpression = (type) => {
    const expressionMap = {
      none: "不笑",
      smile: "微笑",
      laugh: "大笑"
    };
    
    return expressionMap[type] || type;
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-white">人脸情绪分析工具</h1>
        <Link href="/tools" className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
          返回工具箱
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera/Image Display */}
        <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold">图像获取</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => switchImageSource("camera")} 
                className={`px-3 py-1 rounded-md text-sm ${imageSource === "camera" ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                摄像头
              </button>
              <button 
                onClick={() => switchImageSource("upload")} 
                className={`px-3 py-1 rounded-md text-sm ${imageSource === "upload" ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                上传图片
              </button>
            </div>
          </div>
          
          <div className="relative">
            {!capturedImage ? (
              imageSource === "camera" ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto"
                />
              ) : (
                <div className="flex items-center justify-center bg-gray-800 p-10 h-64">
                  <div className="text-center">
                    <div className="mb-4 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 mb-4">点击下方按钮上传图片</p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                </div>
              )
            ) : (
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-auto cursor-pointer" 
                onClick={handleImageClick}
              />
            )}
            
            {analyzing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                  <p>分析中...</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 flex flex-wrap gap-2">
            {!capturedImage ? (
              imageSource === "camera" ? (
                <button
                  onClick={captureImage}
                  disabled={!stream || analyzing}
                  className={`px-4 py-2 rounded-md text-white font-medium ${!stream || analyzing ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  拍照
                </button>
              ) : (
                <button
                  onClick={triggerFileUpload}
                  disabled={analyzing}
                  className={`px-4 py-2 rounded-md text-white font-medium ${analyzing ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  选择图片
                </button>
              )
            ) : (
              <>
                <button
                  onClick={resetCamera}
                  disabled={analyzing}
                  className={`px-4 py-2 rounded-md text-white font-medium ${analyzing ? 'bg-gray-700 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {imageSource === "camera" ? "重新拍照" : "重新上传"}
                </button>
                
                <button
                  onClick={analyzeImage}
                  disabled={analyzing || countdown > 0}
                  className={`px-4 py-2 rounded-md text-white font-medium ${analyzing || countdown > 0 ? 'bg-gray-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {countdown > 0 ? `请等待 ${countdown} 秒` : "分析人脸"}
                </button>
              </>
            )}
          </div>
          
          {error && (
            <div className="p-4 bg-red-900 bg-opacity-50 text-red-200 mx-4 mb-4 rounded-md">
              {error}
            </div>
          )}
        </div>
        
        {/* Results Display */}
        <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">分析结果</h2>
          </div>
          
          <div className="p-6">
            {!faceData ? (
              <div className="text-center text-gray-400 py-10">
                <p>拍照或上传图片并分析后，人脸情绪分析结果将显示在这里</p>
                <p className="mt-4 text-sm">点击检测到的人脸可查看详细信息</p>
              </div>
            ) : faceData.face_num === 0 ? (
              <div className="text-center text-gray-400 py-10">
                <p>未检测到人脸</p>
              </div>
            ) : selectedFace ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">人脸 #{selectedFace.index + 1} 详细信息</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-3 rounded-md">
                    <div className="text-gray-400 text-sm">年龄</div>
                    <div className="text-xl font-medium">{Math.round(selectedFace.age)} 岁</div>
                  </div>
                  
                  <div className="bg-gray-800 p-3 rounded-md">
                    <div className="text-gray-400 text-sm">表情</div>
                    <div className="text-xl font-medium">{translateExpression(selectedFace.expression.type)}</div>
                    <div className="text-gray-400 text-xs">置信度: {Math.round(selectedFace.expression.probability * 100)}%</div>
                  </div>
                  
                  <div className="bg-gray-800 p-3 rounded-md">
                    <div className="text-gray-400 text-sm">情绪</div>
                    <div className="text-xl font-medium">{translateEmotion(selectedFace.emotion.type)}</div>
                    <div className="text-gray-400 text-xs">置信度: {Math.round(selectedFace.emotion.probability * 100)}%</div>
                  </div>
                  
                  <div className="bg-gray-800 p-3 rounded-md">
                    <div className="text-gray-400 text-sm">位置信息</div>
                    <div className="text-sm">
                      <div>左: {Math.round(selectedFace.location.left)}</div>
                      <div>上: {Math.round(selectedFace.location.top)}</div>
                      <div>宽: {Math.round(selectedFace.location.width)}</div>
                      <div>高: {Math.round(selectedFace.location.height)}</div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedFace(null)}
                  className="px-4 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 w-full mt-4"
                >
                  返回人脸列表
                </button>
              </div>
            ) : (
              <div>
                <p className="mb-4">检测到 {faceData.face_num} 个人脸，点击图像中的人脸查看详细信息</p>
                
                <div className="space-y-2">
                  {faceData.face_list.map((face, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-gray-800 rounded-md hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => setSelectedFace({...face, index})}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium">人脸 #{index + 1}</div>
                        <div className="text-sm text-gray-400">{Math.round(face.age)} 岁</div>
                      </div>
                      <div className="mt-1 text-sm">
                        <span className="text-gray-400">情绪: </span>
                        <span>{translateEmotion(face.emotion.type)}</span>
                        <span className="mx-2">|</span>
                        <span className="text-gray-400">表情: </span>
                        <span>{translateExpression(face.expression.type)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-400">
        <p>提示: 此工具使用百度人脸识别API进行人脸情绪分析。每秒只能进行一次分析请求。</p>
        <p>点击检测到的人脸可以查看详细的分析结果，包括年龄、表情和情绪等信息。</p>
      </div>
    </div>
  );
}
