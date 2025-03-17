"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function TTSToolPage() {
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState("audio");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");
  const audioRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("请输入要转换的文本");
      return;
    }

    setIsLoading(true);
    setError("");
    setAudioUrl("");

    try {
      const formData = new FormData();
      formData.append("input", input);
      formData.append("mode", "volcano"); // 使用火山引擎接口

      const response = await fetch("/api/texttospeech", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "生成音频失败");
      }

      // 获取音频数据并创建Blob URL
      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      // 自动播放音频
      if (audioRef.current) {
        audioRef.current.play();
      }
    } catch (err) {
      console.error("TTS Error:", err);
      setError(err.message || "生成音频时出错");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;

    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `${fileName || "audio"}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-white">文字转语音调试工具</h1>
        <Link href="/tools" className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
          返回工具箱
        </Link>
      </div>
      
      <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <p className="text-gray-400">使用火山引擎接口将文字转换为语音，支持自定义文件名和下载</p>
        </div>
        <div className="p-6 bg-gray-900">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                输入文本
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-md h-36 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800 border-gray-700"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="请输入要转换为语音的文本内容"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                文件名
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-800 border-gray-700"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="输入保存的文件名（不含扩展名）"
              />
            </div>

            <div className="flex space-x-4 mb-6">
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white font-medium ${isLoading ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    处理中...
                  </>
                ) : "生成语音"}
              </button>

              <button
                type="button"
                className={`px-4 py-2 rounded-md border border-blue-600 text-blue-400 font-medium ${!audioUrl ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                disabled={!audioUrl}
                onClick={handleDownload}
              >
                下载音频
              </button>
            </div>

            {error && (
              <div className="p-4 mb-4 text-sm text-red-400 bg-red-900 bg-opacity-50 rounded-lg">
                {error}
              </div>
            )}

            {audioUrl && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2 text-gray-300">预览</h3>
                <audio
                  ref={audioRef}
                  controls
                  src={audioUrl}
                  className="w-full"
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
