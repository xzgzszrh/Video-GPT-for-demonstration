"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLocalStorage } from "../../../lib/use-local-storage";
import { translations } from "../../../lib/i18n";
import html2canvas from "html2canvas";

// 情绪颜色映射函数
function getEmotionColor(value) {
  if (value === null) return '#FFFFFF';
  if (value <= 4) {
    // 从绿色渐变到蓝色
    const ratio = value / 4;
    const r = Math.round(0 + ratio * 0);
    const g = Math.round(255 - ratio * 255);
    const b = Math.round(0 + ratio * 255);
    return `rgb(${r},${g},${b})`;
  } else {
    // 从蓝色渐变到红色
    const ratio = (value - 4) / 5;
    const r = Math.round(0 + ratio * 255);
    const g = Math.round(0);
    const b = Math.round(255 - ratio * 255);
    return `rgb(${r},${g},${b})`;
  }
}

// 情绪对应的emoji表情
function getEmotionEmoji(value) {
  if (value === null) return '❓';
  if (value === 0) return '😌';
  if (value <= 2) return '🙂';
  if (value <= 4) return '😐';
  if (value <= 6) return '😕';
  if (value <= 8) return '😟';
  return '😡';
}

// 将base64转换为Blob对象
function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

export default function PageSimulationTool() {
  const [interfaceLang, setInterfaceLang] = useLocalStorage("interface-lang", "zh");
  const [modelOutput, setModelOutput] = useState("");
  const [emotionScore, setEmotionScore] = useState(5); // 默认中等情绪值
  const [generateAudio, setGenerateAudio] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraImage, setCameraImage] = useState(null);
  const [volumePercentage, setVolumePercentage] = useState(0.5); // 音量显示百分比
  const [showVolumeIndicator, setShowVolumeIndicator] = useState(true); // 是否显示音量指示器
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);
  const audioRef = useRef(null);
  
  // 处理摄像头图片上传
  const handleCameraImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // 检查是否为图片文件
    if (!file.type.startsWith('image/')) {
      alert(interfaceLang === 'en' ? 'Please upload an image file' : '请上传图片文件');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setCameraImage(e.target.result);
    };
    reader.onerror = () => {
      alert(interfaceLang === 'en' ? 'Error reading file' : '读取文件时出错');
    };
    reader.readAsDataURL(file);
  };
  
  // 触发文件选择器
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // 清除摄像头图片
  const clearCameraImage = () => {
    setCameraImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 生成语音
  const generateVoice = async () => {
    if (!modelOutput.trim()) {
      alert(interfaceLang === 'en' ? 'Please enter model output text' : '请输入模型输出文本');
      return;
    }
    
    try {
      setIsGeneratingAudio(true);
      
      const texttospeechFormData = new FormData();
      texttospeechFormData.append("input", modelOutput);
      texttospeechFormData.append("mode", "clone"); // 使用克隆模式
      
      const response = await fetch("/api/texttospeech", {
        method: "POST",
        body: texttospeechFormData,
      });
      
      if (!response.ok) {
        throw new Error(interfaceLang === 'en' ? 'Failed to generate audio' : '生成语音失败');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      // 自动播放生成的语音
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error generating voice:', error);
      alert(interfaceLang === 'en' ? `Error: ${error.message}` : `错误: ${error.message}`);
    } finally {
      setIsGeneratingAudio(false);
    }
  };
  
  // 截取预览区域的屏幕截图
  const captureScreenshot = async () => {
    if (!previewRef.current) return;
    
    try {
      setIsCapturing(true);
      
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // 提高截图质量
        backgroundColor: '#000000',
        logging: false,
        useCORS: true, // 允许跨域
        allowTaint: true, // 允许污染
        width: previewRef.current.offsetWidth,
        height: previewRef.current.offsetHeight,
        onclone: (documentClone) => {
          // 处理预览区域的样式
          const previewClone = documentClone.querySelector('[data-preview="true"]');
          if (previewClone) {
            previewClone.style.width = `${previewRef.current.offsetWidth}px`;
            previewClone.style.height = `${previewRef.current.offsetHeight}px`;
          }
        }
      });
      
      const screenshotDataUrl = canvas.toDataURL('image/png');
      setScreenshotUrl(screenshotDataUrl);
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = screenshotDataUrl;
      link.download = `chat-simulation-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
      link.click();
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      alert(interfaceLang === 'en' ? `Screenshot error: ${error.message}` : `截图错误: ${error.message}`);
    } finally {
      setIsCapturing(false);
    }
  };
  
  // 清除生成的语音
  const clearAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setAudioUrl(null);
  };
  
  // 切换音量指示器显示
  const toggleVolumeIndicator = () => {
    setShowVolumeIndicator(!showVolumeIndicator);
  };
  
  // 调整音量指示器大小
  const handleVolumeChange = (e) => {
    setVolumePercentage(parseFloat(e.target.value));
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6 bg-black text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-white">
          {interfaceLang === 'en' ? 'Page Simulation Tool' : '页面模拟工具'}
        </h1>
        <Link href="/tools" className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
          {interfaceLang === 'en' ? 'Back to Tools' : '返回工具箱'}
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 控制面板 */}
        <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">
              {interfaceLang === 'en' ? 'Control Panel' : '控制面板'}
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* 摄像头图片上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {interfaceLang === 'en' ? 'Camera Image' : '摄像头画面'}
              </label>
              <div className="flex flex-col space-y-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleCameraImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div className="flex space-x-2">
                  <button
                    onClick={triggerFileUpload}
                    className="px-4 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700"
                  >
                    {interfaceLang === 'en' ? 'Upload Image' : '上传图片'}
                  </button>
                  {cameraImage && (
                    <button
                      onClick={clearCameraImage}
                      className="px-4 py-2 rounded-md text-white font-medium bg-red-600 hover:bg-red-700"
                    >
                      {interfaceLang === 'en' ? 'Clear Image' : '清除图片'}
                    </button>
                  )}
                </div>
                {cameraImage && (
                  <div className="mt-2 border border-gray-700 rounded-md overflow-hidden">
                    <img 
                      src={cameraImage} 
                      alt="Camera Preview" 
                      className="w-full h-auto max-h-32 object-cover" 
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* 音量指示器控制 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {interfaceLang === 'en' ? 'Volume Indicator' : '音量指示器'}
              </label>
              <div className="flex items-center space-x-4 mb-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showVolumeIndicator}
                    onChange={toggleVolumeIndicator}
                    className="w-4 h-4 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-300">
                    {interfaceLang === 'en' ? 'Show Indicator' : '显示指示器'}
                  </span>
                </label>
              </div>
              {showVolumeIndicator && (
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volumePercentage}
                    onChange={handleVolumeChange}
                    className="flex-grow h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="w-12 text-center">{Math.round(volumePercentage * 100)}%</span>
                </div>
              )}
            </div>
            
            {/* 模型输出文本 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {interfaceLang === 'en' ? 'Model Output Text' : '模型输出文本'}
              </label>
              <textarea
                value={modelOutput}
                onChange={(e) => setModelOutput(e.target.value)}
                className="w-full h-40 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={interfaceLang === 'en' ? 'Enter text that the model would output...' : '输入模型会输出的文本...'}
              />
            </div>
            
            {/* 情绪值滑块 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {interfaceLang === 'en' ? 'Emotion Score (0-9)' : '情绪值 (0-9)'}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="9"
                  value={emotionScore}
                  onChange={(e) => setEmotionScore(parseInt(e.target.value))}
                  className="flex-grow h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xl">{getEmotionEmoji(emotionScore)}</span>
                <span className="w-8 text-center">{emotionScore}</span>
              </div>
              <div 
                className="h-4 w-full mt-2 rounded-full" 
                style={{ background: `linear-gradient(to right, rgb(0,255,0), rgb(0,0,255), rgb(255,0,0))` }}
              ></div>
            </div>
            
            {/* 生成语音选项 */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={generateAudio}
                  onChange={(e) => setGenerateAudio(e.target.checked)}
                  className="w-4 h-4 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-300">
                  {interfaceLang === 'en' ? 'Generate Audio from Text' : '根据文本生成语音'}
                </span>
              </label>
            </div>
            
            {/* 语言切换 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {interfaceLang === 'en' ? 'Interface Language' : '界面语言'}
              </label>
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 rounded-md ${interfaceLang === "zh" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
                  onClick={() => setInterfaceLang("zh")}
                >
                  中文
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${interfaceLang === "en" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
                  onClick={() => setInterfaceLang("en")}
                >
                  English
                </button>
              </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-3">
              {generateAudio && (
                <button
                  onClick={generateVoice}
                  disabled={isGeneratingAudio || !modelOutput.trim()}
                  className={`px-4 py-2 rounded-md text-white font-medium ${isGeneratingAudio || !modelOutput.trim() ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isGeneratingAudio ? 
                    (interfaceLang === 'en' ? 'Generating...' : '生成中...') : 
                    (interfaceLang === 'en' ? 'Generate Audio' : '生成语音')
                  }
                </button>
              )}
              
              {audioUrl && (
                <button
                  onClick={clearAudio}
                  className="px-4 py-2 rounded-md text-white font-medium bg-red-600 hover:bg-red-700"
                >
                  {interfaceLang === 'en' ? 'Clear Audio' : '清除语音'}
                </button>
              )}
              
              <button
                onClick={captureScreenshot}
                disabled={isCapturing}
                className={`px-4 py-2 rounded-md text-white font-medium ${isCapturing ? 'bg-gray-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isCapturing ? 
                  (interfaceLang === 'en' ? 'Capturing...' : '截图中...') : 
                  (interfaceLang === 'en' ? 'Capture Screenshot' : '截取屏幕截图')
                }
              </button>
            </div>
          </div>
        </div>
        
        {/* 预览区域 */}
        <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">
              {interfaceLang === 'en' ? 'Preview' : '预览'}
            </h2>
          </div>
          
          <div ref={previewRef} className="antialiased w-full p-4 flex flex-col justify-center items-center bg-black" data-preview="true">
            <div className="w-full h-full grid grid-cols-1 justify-content-center bg-black max-w-3xl mx-auto">
              {/* 摄像头图片区域 */}
              <div className="relative">
                {cameraImage ? (
                  <img
                    src={cameraImage}
                    className="h-auto w-full aspect-[4/3] object-cover rounded-[1rem] bg-gray-900"
                    alt="Camera Feed"
                  />
                ) : (
                  <div className="h-auto w-full aspect-[4/3] rounded-[1rem] bg-gray-900 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p>{interfaceLang === 'en' ? 'No camera image' : '无摄像头画面'}</p>
                      <p className="text-sm mt-1">{interfaceLang === 'en' ? 'Upload an image in the control panel' : '请在控制面板上传图片'}</p>
                    </div>
                  </div>
                )}
                
                {/* 音量指示器 */}
                {showVolumeIndicator && (
                  <div className="w-16 h-16 absolute bottom-4 left-4 flex justify-center items-center">
                    <div
                      className="w-16 h-16 bg-red-500 opacity-50 rounded-full"
                      style={{
                        transform: `scale(${Math.pow(volumePercentage, 4).toFixed(4)})`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
              
              {/* 模型输出区域 */}
              <div className="flex flex-col items-start justify-start p-8 text-md leading-relaxed relative">
                <div className="text-left mb-6 w-full">
                  <h1 className="text-base font-normal text-blue-400">
                    {translations[interfaceLang].title}
                  </h1>
                  <h2 className="text-4xl text-white font-bold mt-2">
                    {translations[interfaceLang].subtitle}
                  </h2>
                  {/* 情绪预测显示 */}
                  <div className="mt-3 flex items-center">
                    <span className="text-base font-normal text-gray-300">
                      {interfaceLang === 'en' ? 'Emotion Prediction:' : '情绪预测：'}
                    </span>
                    <span 
                      className="inline-block ml-2 w-4 h-4 rounded-full" 
                      style={{ backgroundColor: getEmotionColor(emotionScore) }}
                    ></span>
                    <span className="ml-2 text-xl">{getEmotionEmoji(emotionScore)}</span>
                  </div>
                </div>
                <div className="flex-grow flex items-center justify-center w-full py-8">
                  <div className="text-xl lg:text-2xl text-white leading-relaxed">
                    {modelOutput || (interfaceLang === 'en' ? 'Model output will appear here...' : '模型输出将显示在这里...')}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 底部按钮区域 */}
            <div className="flex flex-wrap justify-center p-4 opacity-50 gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50"
              >
                {translations[interfaceLang].startChat}
              </button>
              <button
                className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50"
              >
                {translations[interfaceLang].regenerate}
              </button>
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded-md ${
                    interfaceLang === "zh"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {translations[interfaceLang].chinese}
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${
                    interfaceLang === "en"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {translations[interfaceLang].english}
                </button>
              </div>
            </div>
          </div>
          
          {/* 音频播放器 */}
          {audioUrl && (
            <div className="p-4 border-t border-gray-700">
              <audio ref={audioRef} controls className="w-full" src={audioUrl}></audio>
            </div>
          )}
        </div>
      </div>
      
      {/* 截图预览 */}
      {screenshotUrl && (
        <div className="mt-6">
          <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold">
                {interfaceLang === 'en' ? 'Screenshot Preview' : '截图预览'}
              </h2>
            </div>
            <div className="p-4">
              <img 
                src={screenshotUrl} 
                alt="Screenshot" 
                className="max-w-full h-auto rounded-md" 
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-400">
        <p>
          {interfaceLang === 'en' 
            ? 'This tool allows developers to simulate chat pages and generate screenshots for testing and development purposes.' 
            : '此工具允许开发者模拟聊天页面并生成截图，用于测试和开发目的。'}
        </p>
        <p className="mt-2">
          {interfaceLang === 'en'
            ? 'You can customize the model output text, emotion score, and optionally generate audio from the text.'
            : '您可以自定义模型输出文本、情绪分数，并可选择从文本生成语音。'}
        </p>
      </div>
    </div>
  );
}
