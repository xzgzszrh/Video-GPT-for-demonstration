"use client";

import { useState } from "react";
import Link from "next/link";

export default function ApiStatusPage() {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testApiConnection = async () => {
    setIsLoading(true);
    setStatus(null);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'test' }],
          token: localStorage.getItem("ai-token") || "",
          scene: localStorage.getItem("scene") || "demo"
        })
      });
      
      if (response.ok) {
        setStatus({
          success: true,
          message: 'API连接正常'
        });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      setStatus({
        success: false,
        message: `API连接异常：${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-white">API状态监测工具</h1>
        <Link href="/tools" className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
          返回工具箱
        </Link>
      </div>
      
      <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700 p-6">
        <p className="text-gray-400 mb-6">此工具用于检测API连接状态，帮助开发人员排查API相关问题</p>
        
        <div className="mb-6">
          <button
            onClick={testApiConnection}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white font-medium ${isLoading ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                检测中...
              </>
            ) : "检测API连接"}
          </button>
        </div>
        
        {status && (
          <div className={`p-4 mb-4 text-sm rounded-lg ${status.success ? 'bg-green-900 bg-opacity-50 text-green-400' : 'bg-red-900 bg-opacity-50 text-red-400'}`}>
            {status.message}
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2 text-gray-300">API服务说明</h3>
          <ul className="list-disc pl-5 text-gray-400 space-y-2">
            <li>Chat API: 用于处理聊天对话请求</li>
            <li>Text-to-Speech API: 用于将文本转换为语音</li>
            <li>Speech-to-Text API: 用于将语音转换为文本</li>
            <li>Emotion API: 用于情绪分析</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
