"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLocalStorage } from "../../lib/use-local-storage";

const OnboardingModal = ({ isOpen, onClose, interfaceLang, setInterfaceLang }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState(false);
  const [chatId, setChatId] = useLocalStorage("chat-id", "");
  const [useChatId, setUseChatId] = useLocalStorage("use-chat-id", true);

  // Reset to first page when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(0);
    }
  }, [isOpen]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleLanguageSelect = (lang) => {
    setInterfaceLang(lang);
    setCurrentPage(currentPage + 1);
  };

  const handleNext = () => {
    // 如果是昵称输入页面，需要验证昵称
    if (currentPage === 2 && useChatId) {
      if (!nickname.trim()) {
        setNicknameError(true);
        return;
      }
      // 保存昵称作为chatId
      setChatId(nickname.trim());
      setNicknameError(false);
    }
    
    // 如果用户选择不使用chatId，跳过昵称输入页面
    if (currentPage === 1 && !useChatId) {
      setCurrentPage(currentPage + 2);
      return;
    }
    
    if (currentPage < 5) {
      setCurrentPage(currentPage + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleUseChatIdToggle = (value) => {
    setUseChatId(value);
    if (!value) {
      // 如果用户选择不使用chatId，清空chatId
      setChatId("");
      // 直接跳到下一页
      setCurrentPage(currentPage + 2);
    } else {
      // 如果用户选择使用chatId，进入昵称输入页面
      setCurrentPage(currentPage + 1);
    }
  };

  if (!isOpen) return null;

  // Content for each page based on selected language
  const pageContent = [
    // Page 1: Language Selection
    {
      title: {
        en: "Select Your Language",
        zh: "选择您的语言"
      },
      content: {
        en: "Please select your preferred language. This will determine the language for all content.",
        zh: "请选择您偏好的语言。这将决定所有内容的语言。"
      }
    },
    // Page 2: ChatId Option
    {
      title: {
        en: "Conversation Memory",
        zh: "对话记忆功能"
      },
      content: {
        en: "Would you like our AI to remember your conversation history? If yes, you'll need to provide a nickname.",
        zh: "您希望AI记住您的对话历史吗？如果是，您需要提供一个昵称。"
      }
    },
    // Page 3: Nickname Input
    {
      title: {
        en: "Enter Your Nickname",
        zh: "输入您的昵称"
      },
      content: {
        en: "Please enter a nickname. This helps our AI remember your conversation history.",
        zh: "请输入一个昵称。这将帮助AI记住您的对话历史。"
      }
    },
    // Page 4: Mobile Browser Recommendation
    {
      title: {
        en: "Use Mobile Browser",
        zh: "请使用手机浏览器"
      },
      content: {
        en: "Please ensure you are using a mobile browser to open this webpage, as we need to access your camera and microphone. If you're not using a mobile browser, you can click here to copy the link and paste it into your mobile browser.",
        zh: "请确保您使用手机浏览器打开本网页，因为我们需要确保能够正常访问您的摄像头和麦克风。如果您不是通过手机浏览器打开的，您可以点击这里一键复制链接，粘贴到浏览器进行访问。"
      }
    },
    // Page 5: Service Information
    {
      title: {
        en: "Technical Demonstration",
        zh: "技术展示"
      },
      content: {
        en: "This page is a technical demonstration of the 'Intelligent Driving Assistant'. Our servers are located in China, which may cause slower response times due to network issues. Thank you for your patience.",
        zh: "本页面为'智能驾驶助手'的技术展示，我们的服务器位于中国，可能会由于网络问题导致的回答速度较慢，感谢您的耐心等待。"
      }
    },
    // Page 6: Audio/Video Capture Indicator
    {
      title: {
        en: "Audio and Video Capture",
        zh: "音视频采集提示"
      },
      content: {
        en: "Your audio and video will only be captured when the indicator appears as a red dot as shown below.",
        zh: "只有此处显示为圆点时，您的声音和画面才会被采集。"
      },
      image: "/001.jpg"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Progress indicator */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
          <div 
            className="h-full bg-blue-500 transition-all duration-300" 
            style={{ width: `${(currentPage + 1) * (100 / pageContent.length)}%` }}
          ></div>
        </div>
        
        <div className="p-6">
          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-4">
            {pageContent[currentPage].title[interfaceLang] || pageContent[currentPage].title.en}
          </h2>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-300 text-lg">
              {pageContent[currentPage].content[interfaceLang] || pageContent[currentPage].content.en}
            </p>

            {/* Special content for specific pages */}
            {currentPage === 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleLanguageSelect("en")}
                  className={`py-3 px-4 rounded-lg text-white font-medium transition-colors ${interfaceLang === "en" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"}`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageSelect("zh")}
                  className={`py-3 px-4 rounded-lg text-white font-medium transition-colors ${interfaceLang === "zh" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"}`}
                >
                  中文
                </button>
              </div>
            )}

            {currentPage === 1 && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleUseChatIdToggle(true)}
                  className={`py-3 px-4 rounded-lg text-white font-medium transition-colors ${useChatId ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"}`}
                >
                  {interfaceLang === "en" ? "Yes" : "是"}
                </button>
                <button
                  onClick={() => handleUseChatIdToggle(false)}
                  className={`py-3 px-4 rounded-lg text-white font-medium transition-colors ${!useChatId ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"}`}
                >
                  {interfaceLang === "en" ? "No" : "否"}
                </button>
              </div>
            )}

            {currentPage === 2 && (
              <div className="mt-4">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    if (e.target.value.trim()) setNicknameError(false);
                  }}
                  placeholder={interfaceLang === "en" ? "Enter your nickname" : "请输入您的昵称"}
                  className={`w-full py-3 px-4 bg-gray-800 border ${nicknameError ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white focus:outline-none focus:border-blue-500`}
                />
                {nicknameError && (
                  <p className="text-red-500 mt-2">
                    {interfaceLang === "en" ? "Please enter a nickname" : "请输入昵称"}
                  </p>
                )}
              </div>
            )}

            {currentPage === 3 && (
              <button
                onClick={handleCopyLink}
                className="mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                {interfaceLang === "en" ? "Copy Link" : "一键复制链接"}
              </button>
            )}

            {showCopiedMessage && (
              <div className="mt-2 text-green-400">
                {interfaceLang === "en" ? "Link copied to clipboard!" : "链接已复制到剪贴板！"}
              </div>
            )}

            {currentPage === 5 && pageContent[currentPage].image && (
              <div className="mt-4 flex justify-center">
                <div className="relative w-full max-w-xs">
                  <Image 
                    src={pageContent[currentPage].image} 
                    alt="Audio/Video Capture Indicator" 
                    width={300} 
                    height={200} 
                    className="rounded-lg border border-gray-700"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            {currentPage > 0 ? (
              <button
                onClick={handleBack}
                className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
              >
                {interfaceLang === "en" ? "Back" : "返回"}
              </button>
            ) : (
              <div></div> // Empty div to maintain layout
            )}

            {currentPage !== 0 && currentPage !== 1 && (
              <button
                onClick={handleNext}
                className="py-2 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
              >
                {currentPage < 5 ? 
                  (interfaceLang === "en" ? "Next" : "下一步") : 
                  (interfaceLang === "en" ? "Get Started" : "开始使用")
                }
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
