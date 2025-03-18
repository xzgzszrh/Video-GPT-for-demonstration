"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// 语言翻译
const translations = {
  zh: {
    title: "智能情绪检测车机系统流程演示",
    subtitle: "展示我们系统的工作流程和关键环节",
    backToTools: "返回工具集",
    next: "下一步",
    prev: "上一步",
    steps: [
      "用户识别（小脑）",
      "用户数据",
      "图像分析（豆包模型）",
      "决策分析（DeepSeek-R1）",
      "执行干预",
      "总结"
    ],
    step1: {
      title: "第一步：用户识别（小脑）",
      description: "小脑由YOLO模型和语音监测模型组成，运行在设备本地（树莓派）。它可以对用户的声音和表情进行简单判断，当检测到可能的'坏情绪'，它会将其结果报告给大脑。",
      instruction: "请面对摄像头，尝试做出生气的表情，然后点击捕获按钮",
      captureBtn: "捕获和分析",
      emotionDetected: "检测到的情绪：",
      emotionScore: "情绪评分：",
      emotionWarning: "检测到生气情绪，可能影响安全驾驶！",
      tryAgain: "请再试一次，做出更明显的生气表情",
      success: "成功捕获生气情绪，点击下一步继续"
    },
    step2: {
      title: "第二步：用户数据",
      description: "系统收集和分析用户数据，包括身体状况、心理状态、偏好等，以更好地了解用户并做出个性化决策。",
      userProfile: "用户资料",
      basicInfo: "基本信息",
      name: "姓名",
      age: "年龄",
      gender: "性别",
      occupation: "职业",
      healthStatus: "健康状况",
      mentalStatus: "心理状态",
      preferences: "偏好",
      temperature: "温度偏好",
      music: "音乐偏好",
      scent: "气味偏好",
      drivingHabits: "驾驶习惯",
      familyInfo: "家庭信息",
      editProfile: "编辑资料",
      saveProfile: "保存资料"
    },
    step3: {
      title: "第三步：图像分析（豆包模型）",
      description: "系统使用豆包大模型分析用户的面部照片和外部交通照片，提取重要信息并与车辆数据进行进一步分析。",
      userImage: "用户面部照片",
      trafficImage: "外部交通照片",
      analyzing: "分析图像中...",
      analysisResult: "分析结果",
      userEmotion: "用户情绪状态",
      trafficCondition: "交通状况",
      potentialRisks: "潜在风险",
      analyzeBtn: "开始分析"
    },
    step4: {
      title: "第四步：决策分析（DeepSeek-R1）",
      description: "系统使用DeepSeek-R1深度思考模型整合和分析图像分析结果、用户资料和可用工具，结合知识库进行合理判断。",
      thinking: "模型思考中...",
      knowledgeBase: "知识库参考",
      conclusion: "分析结论",
      intervention: "干预计划",
      tools: "建议工具",
      analyzeBtn: "开始分析"
    },
    step5: {
      title: "第五步：执行干预",
      description: "基于DeepSeek模型的分析，系统使用豆包模型生成克隆语音对话并调用车载系统执行干预措施。",
      generating: "生成克隆语音中...",
      voiceMessage: "语音消息",
      actions: "执行动作",
      playVoice: "播放语音",
      executeBtn: "执行干预"
    },
    step6: {
      title: "总结",
      description: "这是一个简单的演示，展示我们如何完成情绪检测和干预判断过程。实际系统使用Python实现，逻辑更复杂、严谨，准确率更高。",
      thankYou: "感谢您的参与！",
      restart: "重新开始演示"
    }
  },
  en: {
    title: "Intelligent Emotion Detection Vehicle System Demo",
    subtitle: "Showcasing our system's workflow and key components",
    backToTools: "Back to Tools",
    next: "Next",
    prev: "Previous",
    steps: [
      "User Recognition (Small Brain)",
      "User Data",
      "Image Analysis (Doubao Model)",
      "Decision Analysis (DeepSeek-R1)",
      "Execute Intervention",
      "Summary"
    ],
    step1: {
      title: "Step 1: User Recognition (Small Brain)",
      description: "The small brain consists of a YOLO model and a voice monitoring model, running locally on the device (Raspberry Pi). It can make simple judgments about the user's voice and expressions, and when it detects possible 'bad emotions', it will report its findings to the big brain.",
      instruction: "Please face the camera, try to make an angry expression, then click the capture button",
      captureBtn: "Capture & Analyze",
      emotionDetected: "Emotion Detected:",
      emotionScore: "Emotion Score:",
      emotionWarning: "Angry emotion detected, may affect safe driving!",
      tryAgain: "Please try again, make a more obvious angry expression",
      success: "Successfully captured angry emotion, click next to continue"
    },
    step2: {
      title: "Step 2: User Data",
      description: "The system collects and analyzes user data, including physical condition, mental state, preferences, etc., to better understand the user and make personalized decisions.",
      userProfile: "User Profile",
      basicInfo: "Basic Information",
      name: "Name",
      age: "Age",
      gender: "Gender",
      occupation: "Occupation",
      healthStatus: "Health Status",
      mentalStatus: "Mental Status",
      preferences: "Preferences",
      temperature: "Temperature Preference",
      music: "Music Preference",
      scent: "Scent Preference",
      drivingHabits: "Driving Habits",
      familyInfo: "Family Information",
      editProfile: "Edit Profile",
      saveProfile: "Save Profile"
    },
    step3: {
      title: "Step 3: Image Analysis (Doubao Model)",
      description: "The system uses the Doubao large model to analyze the user's facial photo and external traffic photo, extracting important information and combining it with vehicle data for further analysis.",
      userImage: "User Facial Photo",
      trafficImage: "External Traffic Photo",
      analyzing: "Analyzing images...",
      analysisResult: "Analysis Results",
      userEmotion: "User Emotional State",
      trafficCondition: "Traffic Condition",
      potentialRisks: "Potential Risks",
      analyzeBtn: "Start Analysis"
    },
    step4: {
      title: "Step 4: Decision Analysis (DeepSeek-R1)",
      description: "The system uses the DeepSeek-R1 deep thinking model to integrate and analyze image analysis results, user profiles, and available tools, making reasonable judgments in combination with the knowledge base.",
      thinking: "Model thinking...",
      knowledgeBase: "Knowledge Base Reference",
      conclusion: "Analysis Conclusion",
      intervention: "Intervention Plan",
      tools: "Suggested Tools",
      analyzeBtn: "Start Analysis"
    },
    step5: {
      title: "Step 5: Execute Intervention",
      description: "Based on DeepSeek model's analysis, the system uses the Doubao model to generate cloned voice dialogue and calls the in-vehicle system to execute intervention measures.",
      generating: "Generating cloned voice...",
      voiceMessage: "Voice Message",
      actions: "Actions Executed",
      playVoice: "Play Voice",
      executeBtn: "Execute Intervention"
    },
    step6: {
      title: "Summary",
      description: "This is a simple demonstration showing how we complete the emotion detection and intervention judgment process. The actual system is implemented in Python, with more complex and rigorous logic and higher accuracy.",
      thankYou: "Thank you for your participation!",
      restart: "Restart Demo"
    }
  }
};

// 默认用户数据
const defaultUserProfile = {
  name: "张先生",
  age: 42,
  gender: "男",
  occupation: "IT企业高管",
  healthStatus: "轻度高血压，工作压力大",
  mentalStatus: "易怒，工作压力导致情绪波动",
  preferences: {
    temperature: "偏凉爽，22-24°C",
    music: "古典音乐，轻音乐",
    scent: "薰衣草，柑橘"
  },
  drivingHabits: "喜欢快速驾驶，有时急躁",
  familyInfo: "已婚，有一个12岁的女儿"
};

export default function ProcessDemoPage() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "zh";
  const t = translations[lang] || translations.zh;
  
  const [step, setStep] = useState(1);
  const [userImage, setUserImage] = useState(null);
  const [trafficImage, setTrafficImage] = useState("/traffic-jam.jpg"); // 预设的交通拥堵图片
  const [emotion, setEmotion] = useState(null);
  const [emotionScore, setEmotionScore] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [userProfile, setUserProfile] = useState(defaultUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [decisionResult, setDecisionResult] = useState(null);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // 切换语言
  const toggleLanguage = () => {
    const newLang = lang === "zh" ? "en" : "zh";
    window.location.href = `?lang=${newLang}`;
  };

  // 切换步骤
  const goToStep = (newStep) => {
    if (newStep >= 1 && newStep <= 6) {
      setStep(newStep);
    }
  };

  // 初始化摄像头
  useEffect(() => {
    if (step === 1) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
        }
      };
      
      startCamera();
      
      return () => {
        // 清理摄像头
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    }
  }, [step]);

  // 捕获图像并进行情绪分析
  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    
    // 设置画布大小与视频相同
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // 在画布上绘制视频帧
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // 将画布内容转换为图像数据URL
    const imageDataUrl = canvas.toDataURL("image/jpeg");
    setUserImage(imageDataUrl);
    
    try {
      // 调用情绪识别API
      const response = await fetch("/api/emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_data: imageDataUrl,
        }),
      });
      
      const data = await response.json();
      console.log("Emotion analysis result:", data);
      
      // 设置情绪分析结果
      setEmotion(data.emotion || "angry"); // 默认为愤怒，用于演示
      setEmotionScore(data.score || 0.85); // 默认为高分，用于演示
      
      setIsCapturing(false);
    } catch (error) {
      console.error("Error analyzing emotion:", error);
      // 模拟情绪分析结果（用于演示）
      setEmotion("angry");
      setEmotionScore(0.85);
      setIsCapturing(false);
    }
  };

  // 渲染步骤导航
  const renderStepNav = () => {
    return (
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleLanguage}
            className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            {lang === "zh" ? "English" : "中文"}
          </button>
          <Link 
            href="/tools" 
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            {t.backToTools}
          </Link>
        </div>
      </div>
    );
  };

  // 渲染步骤指示器
  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between">
          {t.steps.map((stepName, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center w-1/6 ${index + 1 === step ? 'text-blue-500' : 'text-gray-500'}`}
              onClick={() => goToStep(index + 1)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${index + 1 === step ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                {index + 1}
              </div>
              <span className="text-xs text-center">{stepName}</span>
            </div>
          ))}
        </div>
        <div className="relative h-1 bg-gray-800 mt-4">
          <div 
            className="absolute h-1 bg-blue-500 transition-all duration-300" 
            style={{ width: `${(step / 6) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // 渲染第一步
  const renderStep1 = () => {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">{t.step1.title}</h2>
        <p className="text-gray-400 mb-8">{t.step1.description}</p>
        <p className="text-yellow-500 mb-4">{t.step1.instruction}</p>
        <div className="flex justify-center mb-8">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-80 h-60 rounded-lg border border-gray-400"
          />
        </div>
        <canvas 
          ref={canvasRef} 
          className="hidden"
        />
        <button 
          onClick={captureImage} 
          disabled={isCapturing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-500"
        >
          {isCapturing ? "Processing..." : t.step1.captureBtn}
        </button>
        {emotion && (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg w-full max-w-md">
            <p className="text-gray-300 mb-2">{t.step1.emotionDetected} <span className="text-red-500 font-bold">{emotion}</span></p>
            <p className="text-gray-300 mb-2">{t.step1.emotionScore} <span className="text-yellow-500 font-bold">{emotionScore?.toFixed(2)}</span></p>
            {emotion === "angry" && (
              <div>
                <p className="text-red-500 mb-4 font-bold">{t.step1.emotionWarning}</p>
                <button 
                  onClick={() => goToStep(2)} 
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {t.next}
                </button>
              </div>
            )}
            {emotion !== "angry" && (
              <p className="text-yellow-500 mb-2">{t.step1.tryAgain}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  // 渲染第二步
  const renderStep2 = () => {
    const handleEditToggle = () => {
      setIsEditing(!isEditing);
    };

    const handleProfileChange = (field, value) => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        setUserProfile({
          ...userProfile,
          [parent]: {
            ...userProfile[parent],
            [child]: value
          }
        });
      } else {
        setUserProfile({
          ...userProfile,
          [field]: value
        });
      }
    };

    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">{t.step2.title}</h2>
        <p className="text-gray-400 mb-8">{t.step2.description}</p>
        
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">{t.step2.userProfile}</h3>
            <button 
              onClick={handleEditToggle}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              {isEditing ? t.step2.saveProfile : t.step2.editProfile}
            </button>
          </div>
          
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-300 mb-2">{t.step2.basicInfo}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">{t.step2.name}:</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={userProfile.name} 
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="bg-gray-700 text-white p-1 rounded w-full"
                  />
                ) : (
                  <p className="text-white">{userProfile.name}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400">{t.step2.age}:</p>
                {isEditing ? (
                  <input 
                    type="number" 
                    value={userProfile.age} 
                    onChange={(e) => handleProfileChange('age', parseInt(e.target.value))}
                    className="bg-gray-700 text-white p-1 rounded w-full"
                  />
                ) : (
                  <p className="text-white">{userProfile.age}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400">{t.step2.gender}:</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={userProfile.gender} 
                    onChange={(e) => handleProfileChange('gender', e.target.value)}
                    className="bg-gray-700 text-white p-1 rounded w-full"
                  />
                ) : (
                  <p className="text-white">{userProfile.gender}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400">{t.step2.occupation}:</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={userProfile.occupation} 
                    onChange={(e) => handleProfileChange('occupation', e.target.value)}
                    className="bg-gray-700 text-white p-1 rounded w-full"
                  />
                ) : (
                  <p className="text-white">{userProfile.occupation}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-300 mb-2">{t.step2.healthStatus}:</h4>
            {isEditing ? (
              <textarea 
                value={userProfile.healthStatus} 
                onChange={(e) => handleProfileChange('healthStatus', e.target.value)}
                className="bg-gray-700 text-white p-2 rounded w-full"
                rows="2"
              />
            ) : (
              <p className="text-white">{userProfile.healthStatus}</p>
            )}
          </div>
          
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-300 mb-2">{t.step2.mentalStatus}:</h4>
            {isEditing ? (
              <textarea 
                value={userProfile.mentalStatus} 
                onChange={(e) => handleProfileChange('mentalStatus', e.target.value)}
                className="bg-gray-700 text-white p-2 rounded w-full"
                rows="2"
              />
            ) : (
              <p className="text-white">{userProfile.mentalStatus}</p>
            )}
          </div>
          
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-300 mb-2">{t.step2.preferences}:</h4>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <p className="text-gray-400">{t.step2.temperature}:</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={userProfile.preferences.temperature} 
                    onChange={(e) => handleProfileChange('preferences.temperature', e.target.value)}
                    className="bg-gray-700 text-white p-1 rounded w-full"
                  />
                ) : (
                  <p className="text-white">{userProfile.preferences.temperature}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400">{t.step2.music}:</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={userProfile.preferences.music} 
                    onChange={(e) => handleProfileChange('preferences.music', e.target.value)}
                    className="bg-gray-700 text-white p-1 rounded w-full"
                  />
                ) : (
                  <p className="text-white">{userProfile.preferences.music}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400">{t.step2.scent}:</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={userProfile.preferences.scent} 
                    onChange={(e) => handleProfileChange('preferences.scent', e.target.value)}
                    className="bg-gray-700 text-white p-1 rounded w-full"
                  />
                ) : (
                  <p className="text-white">{userProfile.preferences.scent}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-300 mb-2">{t.step2.drivingHabits}:</h4>
            {isEditing ? (
              <textarea 
                value={userProfile.drivingHabits} 
                onChange={(e) => handleProfileChange('drivingHabits', e.target.value)}
                className="bg-gray-700 text-white p-2 rounded w-full"
                rows="2"
              />
            ) : (
              <p className="text-white">{userProfile.drivingHabits}</p>
            )}
          </div>
          
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-300 mb-2">{t.step2.familyInfo}:</h4>
            {isEditing ? (
              <textarea 
                value={userProfile.familyInfo} 
                onChange={(e) => handleProfileChange('familyInfo', e.target.value)}
                className="bg-gray-700 text-white p-2 rounded w-full"
                rows="2"
              />
            ) : (
              <p className="text-white">{userProfile.familyInfo}</p>
            )}
          </div>
        </div>
        
        <div className="mt-8 flex justify-between w-full max-w-2xl">
          <button 
            onClick={() => goToStep(1)} 
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            {t.prev}
          </button>
          <button 
            onClick={() => goToStep(3)} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t.next}
          </button>
        </div>
      </div>
    );
  };

  // 渲染第三步
  const renderStep3 = () => {
    const startImageAnalysis = async () => {
      if (!userImage) {
        alert("Please capture a user image in Step 1 first.");
        return;
      }
      
      setIsAnalyzing(true);
      
      // 模拟图像分析结果（用于演示）
      setTimeout(() => {
        setAnalysisResult({
          userEmotion: {
            primary: "anger",
            intensity: "high",
            description: lang === "zh" ? "用户处于愤怒状态，面部表情紧张，可能正在经历高压力或愤怒" : "User is in a state of intense anger, with tense facial expressions and direct gaze, possibly experiencing high stress or anger"
          },
          trafficCondition: {
            status: "congested",
            severity: "high",
            description: lang === "zh" ? "道路拥堵，车辆密集，可能导致延误" : "Road is severely congested with multiple vehicles closely packed in a small space, likely causing significant delays"
          },
          potentialRisks: [
            lang === "zh" ? "驾驶员可能做出糟糕的驾驶决定，导致事故" : "Driver may make poor driving decisions due to emotional agitation and traffic congestion",
            lang === "zh" ? "驾驶员可能与其他车辆竞速或突然变道" : "Risk of racing with other vehicles or making abrupt lane changes",
            lang === "zh" ? "驾驶员可能分心，导致事故" : "May lead to distracted attention, increasing risk of traffic accidents"
          ]
        });
        setIsAnalyzing(false);
      }, 3000);
    };

    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">{t.step3.title}</h2>
        <p className="text-gray-400 mb-8">{t.step3.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">{t.step3.userImage}</h3>
            {userImage ? (
              <img src={userImage} alt="User" className="w-full h-auto rounded-lg" />
            ) : (
              <div className="bg-gray-700 h-48 flex items-center justify-center rounded-lg">
                <p className="text-gray-400">{lang === "zh" ? "请先在步骤1中捕获用户图像" : "Please capture user image in Step 1 first"}</p>
              </div>
            )}
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">{t.step3.trafficImage}</h3>
            <img src={trafficImage} alt="Traffic" className="w-full h-auto rounded-lg" />
          </div>
        </div>
        
        {!isAnalyzing && !analysisResult && (
          <button 
            onClick={startImageAnalysis} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!userImage}
          >
            {t.step3.analyzeBtn}
          </button>
        )}
        
        {isAnalyzing && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-blue-500">{t.step3.analyzing}</p>
          </div>
        )}
        
        {analysisResult && (
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl mt-4">
            <h3 className="text-lg font-semibold text-white mb-4">{t.step3.analysisResult}</h3>
            
            <div className="mb-6">
              <h4 className="text-md font-semibold text-blue-400 mb-2">{t.step3.userEmotion}</h4>
              <p className="text-white mb-1">
                <span className="text-gray-400">{lang === "zh" ? "主要情绪：" : "Primary Emotion: "}</span>
                <span className="text-red-500 font-bold">{analysisResult.userEmotion.primary}</span>
              </p>
              <p className="text-white mb-1">
                <span className="text-gray-400">{lang === "zh" ? "情绪强度：" : "Intensity: "}</span>
                <span className="text-yellow-500">{analysisResult.userEmotion.intensity}</span>
              </p>
              <p className="text-white">{analysisResult.userEmotion.description}</p>
            </div>
            
            <div className="mb-6">
              <h4 className="text-md font-semibold text-blue-400 mb-2">{t.step3.trafficCondition}</h4>
              <p className="text-white mb-1">
                <span className="text-gray-400">{lang === "zh" ? "状态：" : "Status: "}</span>
                <span className="text-orange-500">{analysisResult.trafficCondition.status}</span>
              </p>
              <p className="text-white mb-1">
                <span className="text-gray-400">{lang === "zh" ? "严重程度：" : "Severity: "}</span>
                <span className="text-red-500">{analysisResult.trafficCondition.severity}</span>
              </p>
              <p className="text-white">{analysisResult.trafficCondition.description}</p>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-blue-400 mb-2">{t.step3.potentialRisks}</h4>
              <ul className="list-disc pl-5">
                {analysisResult.potentialRisks.map((risk, index) => (
                  <li key={index} className="text-white mb-1">{risk}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-between w-full max-w-4xl">
          <button 
            onClick={() => goToStep(2)} 
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            {t.prev}
          </button>
          <button 
            onClick={() => goToStep(4)} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!analysisResult}
          >
            {t.next}
          </button>
        </div>
      </div>
    );
  };

  // 渲染第四步
  const renderStep4 = () => {
    const startDecisionAnalysis = async () => {
      if (!analysisResult) {
        alert("Please complete the image analysis in Step 3 first.");
        return;
      }
      
      setIsThinking(true);
      
      // 模拟决策分析结果（用于演示）
      setTimeout(() => {
        setDecisionResult({
          knowledgeBase: [
            lang === "zh" ? "研究表明，愤怒情绪会导致驾驶员冒险行为增加70%" : "Research shows that anger increases risky driving behavior by 70%",
            lang === "zh" ? "交通拥堵是道路事故的主要诱因之一" : "Traffic congestion is one of the main triggers for road accidents",
            lang === "zh" ? "情绪调节技术可以有效降低驾驶风险" : "Emotion regulation techniques can effectively reduce driving risks"
          ],
          conclusion: lang === "zh" ? 
            "基于用户的情绪状态（愤怒）、交通状况（拥堵）和用户资料（易怒、工作压力大），系统判断当前存在较高的安全风险。用户可能会因情绪激动而做出危险驾驶行为，如急速变道、超速或跟车过近。" : 
            "Based on the user's emotional state (anger), traffic conditions (congestion), and user profile (prone to anger, high work pressure), the system determines that there is a high safety risk. The user may engage in dangerous driving behaviors due to emotional agitation, such as sudden lane changes, speeding, or following too closely.",
          intervention: lang === "zh" ? 
            "建议执行多模式干预：1) 语音安抚，使用平静语调提醒用户注意情绪控制；2) 调整车内环境，播放用户偏好的古典音乐，释放薰衣草香氛；3) 建议更换路线，避开拥堵区域；4) 如情绪持续恶化，建议暂时停车休息。" : 
            "Recommend multi-modal intervention: 1) Voice soothing, using a calm tone to remind the user to control emotions; 2) Adjust the in-car environment, play the user's preferred classical music, release lavender fragrance; 3) Suggest changing routes to avoid congested areas; 4) If emotions continue to deteriorate, suggest temporarily stopping for a rest.",
          tools: [
            lang === "zh" ? "情绪调节语音助手" : "Emotion Regulation Voice Assistant",
            lang === "zh" ? "环境控制系统（音乐、温度、香氛）" : "Environment Control System (music, temperature, scent)",
            lang === "zh" ? "智能导航系统" : "Smart Navigation System",
            lang === "zh" ? "紧急干预系统" : "Emergency Intervention System"
          ]
        });
        setIsThinking(false);
      }, 4000);
    };

    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">{t.step4.title}</h2>
        <p className="text-gray-400 mb-8">{t.step4.description}</p>
        
        {!isThinking && !decisionResult && (
          <button 
            onClick={startDecisionAnalysis} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!analysisResult}
          >
            {t.step4.analyzeBtn}
          </button>
        )}
        
        {isThinking && (
          <div className="text-center py-8 w-full max-w-4xl">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                <p className="text-blue-500 text-lg">{t.step4.thinking}</p>
              </div>
              <div className="h-40 bg-gray-900 rounded p-4 overflow-hidden relative">
                <div className="animate-pulse">
                  <div className="h-2 bg-gray-700 rounded mb-3"></div>
                  <div className="h-2 bg-gray-700 rounded mb-3 w-5/6"></div>
                  <div className="h-2 bg-gray-700 rounded mb-3 w-4/6"></div>
                  <div className="h-2 bg-gray-700 rounded mb-3 w-3/4"></div>
                  <div className="h-2 bg-gray-700 rounded mb-3 w-full"></div>
                  <div className="h-2 bg-gray-700 rounded mb-3 w-2/3"></div>
                  <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="absolute bottom-4 right-4 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-green-500 text-sm">DeepSeek-R1</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {decisionResult && (
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">{t.step4.knowledgeBase}</h3>
              <ul className="list-disc pl-5">
                {decisionResult.knowledgeBase.map((item, index) => (
                  <li key={index} className="text-white mb-2">{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">{t.step4.conclusion}</h3>
              <p className="text-white">{decisionResult.conclusion}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">{t.step4.intervention}</h3>
              <p className="text-white">{decisionResult.intervention}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-4">{t.step4.tools}</h3>
              <div className="grid grid-cols-2 gap-4">
                {decisionResult.tools.map((tool, index) => (
                  <div key={index} className="bg-gray-700 p-3 rounded-lg flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <span className="text-white">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-between w-full max-w-4xl">
          <button 
            onClick={() => goToStep(3)} 
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            {t.prev}
          </button>
          <button 
            onClick={() => goToStep(5)} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!decisionResult}
          >
            {t.next}
          </button>
        </div>
      </div>
    );
  };

  // 渲染第五步
  const renderStep5 = () => {
    const executeIntervention = async () => {
      if (!decisionResult) {
        alert("Please complete the decision analysis in Step 4 first.");
        return;
      }
      
      setIsGeneratingVoice(true);
      
      // 模拟克隆语音生成（用于演示）
      setTimeout(() => {
        setVoiceMessage(lang === "zh" ? 
          "张先生，我注意到您似乎有些生气。在这种拥堵的交通中，保持冷静很重要。我已经为您播放古典音乐，并调整了车内温度和香氛。我还找到了一条替代路线，可以避开前方的拥堵区域。请深呼吸，放松一下，我们会安全到达目的地。" : 
          "Mr. Zhang, I notice you seem a bit angry. In this congested traffic, staying calm is important. I've started playing classical music for you and adjusted the in-car temperature and fragrance. I've also found an alternative route that avoids the congestion ahead. Please take a deep breath, relax, and we'll get to our destination safely."
        );
        
        // 创建音频URL（实际应用中应该调用TTS API）
        // 这里仅作演示，使用预设的音频文件
        setAudioUrl("/calm-voice-message.mp3");
        
        setIsGeneratingVoice(false);
      }, 3000);
    };

    const playVoiceMessage = () => {
      // 在实际应用中，这里应该播放生成的音频
      alert(lang === "zh" ? "播放语音消息（演示）" : "Playing voice message (demo)");
    };

    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">{t.step5.title}</h2>
        <p className="text-gray-400 mb-8">{t.step5.description}</p>
        
        {!isGeneratingVoice && !voiceMessage && (
          <button 
            onClick={executeIntervention} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!decisionResult}
          >
            {t.step5.executeBtn}
          </button>
        )}
        
        {isGeneratingVoice && (
          <div className="text-center py-8 w-full max-w-4xl">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                <p className="text-blue-500 text-lg">{t.step5.generating}</p>
              </div>
              <div className="h-20 bg-gray-900 rounded p-4 flex items-center justify-center">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 h-5 bg-blue-500 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {voiceMessage && (
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">{t.step5.voiceMessage}</h3>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-white mb-4">{voiceMessage}</p>
                <button 
                  onClick={playVoiceMessage}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  {t.step5.playVoice}
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-4">{t.step5.actions}</h3>
              <div className="space-y-3">
                <div className="bg-gray-700 p-3 rounded-lg flex items-start">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white font-medium">{lang === "zh" ? "语音安抚" : "Voice Soothing"}</span>
                    <p className="text-gray-400 text-sm">{lang === "zh" ? "使用克隆语音提供情绪支持和建议" : "Using cloned voice to provide emotional support and advice"}</p>
                  </div>
                </div>
                
                <div className="bg-gray-700 p-3 rounded-lg flex items-start">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white font-medium">{lang === "zh" ? "环境调节" : "Environment Adjustment"}</span>
                    <p className="text-gray-400 text-sm">{lang === "zh" ? "播放古典音乐，调整温度至23°C，释放薰衣草香氛" : "Playing classical music, adjusting temperature to 23°C, releasing lavender fragrance"}</p>
                  </div>
                </div>
                
                <div className="bg-gray-700 p-3 rounded-lg flex items-start">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white font-medium">{lang === "zh" ? "路线优化" : "Route Optimization"}</span>
                    <p className="text-gray-400 text-sm">{lang === "zh" ? "计算替代路线，避开拥堵区域" : "Calculating alternative route to avoid congested areas"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-between w-full max-w-4xl">
          <button 
            onClick={() => goToStep(4)} 
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            {t.prev}
          </button>
          <button 
            onClick={() => goToStep(6)} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!voiceMessage}
          >
            {t.next}
          </button>
        </div>
      </div>
    );
  };

  // 渲染第六步（总结）
  const renderStep6 = () => {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">{t.step6.title}</h2>
        <p className="text-gray-400 mb-8">{t.step6.description}</p>
        
        <div className="bg-gray-800 rounded-lg p-8 w-full max-w-4xl text-center">
          <div className="mb-8">
            <svg className="w-20 h-20 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">{t.step6.thankYou}</h3>
          
          <p className="text-lg text-gray-300 mb-8">
            {lang === "zh" ? 
              "您已完成智能情绪检测车机系统的流程演示。这个系统通过多模态感知、大模型分析和个性化干预，帮助驾驶员保持良好的情绪状态，提高驾驶安全性。" : 
              "You have completed the workflow demonstration of the Intelligent Emotion Detection Vehicle System. This system helps drivers maintain a good emotional state and improve driving safety through multi-modal perception, large model analysis, and personalized intervention."}
          </p>
          
          <button 
            onClick={() => goToStep(1)} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg"
          >
            {t.step6.restart}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-8 bg-black text-white min-h-screen">
      {renderStepNav()}
      {renderStepIndicator()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
      {step === 6 && renderStep6()}
    </div>
  );
}
