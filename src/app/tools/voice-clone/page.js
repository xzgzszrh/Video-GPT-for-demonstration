"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function VoiceClonePage() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("cn");
  const [modelType, setModelType] = useState("1");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [response, setResponse] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState("");
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [uploadedAudio, setUploadedAudio] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const statusIntervalRef = useRef(null);

  // 开始录音
  const startRecording = async () => {
    try {
      setError("");
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioBlob);
        setUploadedAudio(null); // 移除已上传的文件
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("录音错误:", err);
      setError("无法访问麦克风，请确保已授予权限");
    }
  };

  // 停止录音
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // 停止所有音轨
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // 处理文件上传
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 检查文件类型
      //const validTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/m4a', 'audio/aac', 'audio/pcm'];
      /*if (!validTypes.includes(file.type)) {
        setError("请上传有效的音频文件（WAV, MP3, OGG, M4A, AAC, PCM）");
        return;
      }*/
      
      // 检查文件大小
      if (file.size > 10 * 1024 * 1024) { // 10MB
        setError("文件大小超过10MB");
        return;
      }
      
      setUploadedAudio(file);
      setRecordedAudio(null); // 移除录制的音频
      setError("");
    }
  };

  // 触发文件输入
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // 提交语音克隆请求
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const audioFile = recordedAudio || uploadedAudio;
    if (!audioFile) {
      setError("请先录制或上传音频文件");
      return;
    }

    setIsLoading(true);
    setError("");
    setResponse(null);
    setStatusData(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioFile);
      if (text.trim()) {
        formData.append("text", text);
      }
      formData.append("language", language);
      formData.append("model_type", modelType);

      const response = await fetch("/api/voiceclone", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "语音克隆失败");
      }

      setResponse(data);
      
      // 如果返回成功，则开始检查状态
      if (data.BaseResp && data.BaseResp.StatusCode === 0) {
        startStatusCheck();
      }
    } catch (err) {
      console.error("Voice Clone Error:", err);
      setError(err.message || "语音克隆处理时出错");
    } finally {
      setIsLoading(false);
    }
  };

  // 开始检查状态
  const startStatusCheck = () => {
    // 清除之前的检查间隔
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
    }
    
    // 立即检查一次状态
    checkStatus();
    
    // 设置检查间隔，20秒检查一次
    statusIntervalRef.current = setInterval(() => {
      checkStatus();
    }, 20000); // 20秒
  };

  // 检查状态
  const checkStatus = async () => {
    try {
      setIsCheckingStatus(true);
      
      const response = await fetch(`/api/voiceclone?speaker_id=${response?.speaker_id || ''}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "检查状态失败");
      }
      
      setStatusData(data);
      
      // 如果状态为成功或活动，则停止检查
      if (data.status === 2 || data.status === 4) {
        clearInterval(statusIntervalRef.current);
        statusIntervalRef.current = null;
      }
    } catch (err) {
      console.error("Status Check Error:", err);
      // 忽略检查状态错误
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // 手动检查状态
  const handleCheckStatus = async () => {
    if (!response?.speaker_id) {
      setError("没有可用的语音ID，无法检查状态");
      return;
    }
    
    await checkStatus();
  };

  // 清除检查间隔
  useEffect(() => {
    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
    };
  }, []);

  // 渲染状态文本
  const renderStatusText = (status) => {
    switch(status) {
      case 0: return "等待语音";
      case 1: return "处理中";
      case 2: return "处理成功";
      case 3: return "处理失败";
      case 4: return "状态异常";
      default: return "未知状态";
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-white">语音克隆训练工具</h1>
        <Link href="/tools" className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
          返回工具箱
        </Link>
      </div>
      
      <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <p className="text-gray-400">使用火山引擎接口进行语音克隆训练，录制或上传您的声音样本并输入文本进行克隆</p>
        </div>
        <div className="p-6 bg-gray-900">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                录制或上传声音样本
              </label>
              <div className="flex flex-wrap gap-4 mb-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md text-white font-medium ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? '停止录音' : '开始录音'}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700"
                  onClick={triggerFileInput}
                >
                  上传音频文件
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="audio/*"
                />
              </div>
              {recordedAudio && (
                <div className="mt-2">
                  <p className="text-sm text-green-400 mb-2">√ 已录制声音样本</p>
                  <audio 
                    controls 
                    src={URL.createObjectURL(recordedAudio)} 
                    className="w-full"
                  />
                </div>
              )}
              {uploadedAudio && (
                <div className="mt-2">
                  <p className="text-sm text-green-400 mb-2">√ 已上传声音样本: {uploadedAudio.name}</p>
                  <audio 
                    controls 
                    src={URL.createObjectURL(uploadedAudio)} 
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                语言选择
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800 border-gray-700"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="cn">中文</option>
                <option value="en">英文</option>
                <option value="ja">日语</option>
                <option value="es">西班牙语</option>
                <option value="id">印尼语</option>
                <option value="pt">葡萄牙语</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                模型类型
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800 border-gray-700"
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
              >
                <option value="1">2.0版本</option>
                <option value="0">1.0版本</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                输入文本（可选）
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-md h-36 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800 border-gray-700"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="请输入要用您的声音朗读的文本内容"
              />
            </div>

            <div className="flex space-x-4 mb-6">
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white font-medium ${isLoading ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={isLoading || (!recordedAudio && !uploadedAudio)}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    处理中...
                  </>
                ) : "生成克隆语音"}
              </button>
              
              {response?.speaker_id && (
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md text-white font-medium ${isCheckingStatus ? 'bg-gray-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                  onClick={handleCheckStatus}
                  disabled={isCheckingStatus}
                >
                  {isCheckingStatus ? '检查中...' : '检查状态'}
                </button>
              )}
            </div>

            {error && (
              <div className="p-4 mb-4 text-sm text-red-400 bg-red-900 bg-opacity-50 rounded-lg">
                {error}
              </div>
            )}

            {response && (
              <div className="mt-6 p-4 bg-green-900 bg-opacity-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2 text-gray-300">克隆语音结果</h3>
                <pre className="whitespace-pre-wrap text-sm text-gray-300 overflow-auto max-h-60">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            )}

            {statusData && (
              <div className="mt-6 p-4 bg-blue-900 bg-opacity-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2 text-gray-300">克隆语音状态</h3>
                <div className="mb-2">
                  <span className="font-semibold">语音ID: </span>
                  <span>{statusData.speaker_id}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">状态: </span>
                  <span className={statusData.status === 2 || statusData.status === 4 ? 'text-green-400' : 'text-yellow-400'}>
                    {renderStatusText(statusData.status)}
                  </span>
                </div>
                {statusData.create_time && (
                  <div className="mb-2">
                    <span className="font-semibold">创建时间: </span>
                    <span>{new Date(statusData.create_time).toLocaleString()}</span>
                  </div>
                )}
                {statusData.demo_audio && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2 text-gray-300">示例音频</h4>
                    <audio controls src={statusData.demo_audio} className="w-full" />
                    <p className="text-xs text-gray-400 mt-1">注意：示例音频仅在状态为成功或活动时有效</p>
                  </div>
                )}
                <pre className="whitespace-pre-wrap text-sm text-gray-300 overflow-auto max-h-40 mt-2">
                  {JSON.stringify(statusData, null, 2)}
                </pre>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
