"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProjectIntroPage() {
  const [lang, setLang] = useState("zh");
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 6;
  const slideRefs = useRef([]);
  const router = useRouter();

  // 初始化slideRefs
  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, totalSlides);
  }, []);

  const toggleLanguage = () => {
    setLang(lang === "zh" ? "en" : "zh");
  };

  const goToNextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // 翻译文本
  const translations = {
    zh: {
      title: "智能情绪检测车机系统",
      subtitle: "基于大模型的驾驶安全解决方案",
      languageBtn: "English",
      nextBtn: "下一页",
      prevBtn: "上一页",
      backToTools: "返回工具列表",
      
      // 幻灯片1 - 问题背景
      slide1: {
        title: "驾驶安全与情绪问题",
        subtitle: "情绪是安全驾驶不可回避的关键要素",
        stats1: "2015年全国由愤怒情绪驾驶引发的违法行为达1733万起",
        stats2: "2023年调研显示约35%的司机存在\"路怒\"倾向",
        maleDrivers: "男性司机在愤怒情绪下驾驶行为受影响程度更为显著",
        emotionTable: "情绪类型与驾驶行为的关系",
        emotionTypes: ["消极", "积极", "中性"],
        drivingEffects: ["注意力涣散、车速较高、超车/变道行为增加", "注意力拓展", "介于两者之间"],
        accidentRisk: ["易发生交通事故", "不易发生交通事故", "-"],
      },
      
      // 幻灯片2 - 情绪影响
      slide2: {
        title: "情绪对驾驶行为的影响",
        subtitle: "不同情绪状态下的驾驶行为变化",
        emotionStates: ["愤怒", "恐惧", "悲伤", "快乐", "厌恶", "惊讶"],
        dataSource: ["实车和驾驶模拟器", "实车", "实车和驾驶模拟器", "驾驶模拟器", "问卷调查", "问卷调查"],
        dataType: ["自我评价和生理数据", "生理数据", "生理数据", "生理数据", "自我测评", "自我测评"],
        drivingImpact: [
          "超速行为增加，减速行为减少，降低对他人的容忍度",
          "与攻击性驾驶行为存在正相关关系",
          "降低注意力，增加反应时间",
          "转向误差增大，观察后视镜次数减少，忽视交通标志次数增加",
          "注意力难以集中，出现判断失误",
          "增加不稳定性和不可预测性"
        ],
        complexFactors: "影响驾驶员情绪变化的因素非常复杂",
        personalFactors: "个人因素：性别、年龄、职业、健康状况等",
        externalFactors: "外部因素：交通状况、车辆运行状态、环境感知、道路条件、天气因素等",
      },
      
      // 幻灯片3 - 解决方案
      slide3: {
        title: "我们的解决方案",
        subtitle: "大语言模型 + 情绪检测 = 智能驾驶助手",
        llmAdvantage: "大语言模型优势",
        llmPoint1: "处理复杂情境的能力",
        llmPoint2: "结合个人特征提供个性化解决方案",
        llmPoint3: "拥有庞大的知识库支持",
        deepseekInfo: "Deepseek-R1 COT模型在基准测试中表现优于相关领域专业人士",
        expertAnalogy: "相当于一个\\\"心理专家\\\"在驾驶过程中陪伴在旁",
        designChallenges: "系统设计挑战",
        challengePoint1: "如何平衡性能与成本",
        challengePoint2: "如何实现实时监测与精确分析",
        challengePoint3: "如何提供个性化且有效的干预措施",
      },
      
      // 幻灯片4 - 系统架构
      slide4: {
        title: "大小脑架构设计",
        subtitle: "高效且智能的系统架构",
        smallBrain: "小脑 (边缘计算)",
        smallBrainDesc: "在树莓派本地运行的轻量级模型",
        smallBrainPoint1: "面部情绪检测模型",
        smallBrainPoint2: "声音情绪检测模型",
        smallBrainPoint3: "实时监测驾驶员状态",
        smallBrainPoint4: "低延迟、高频率运行",
        bigBrain: "大脑 (云端大模型)",
        bigBrainDesc: "由多个大语言模型组成的决策系统",
        bigBrainPoint1: "豆包大模型 Vision - 图像分析",
        bigBrainPoint2: "DeepSeek-R1 - 深度思考与决策",
        bigBrainPoint3: "专业知识库支持",
        bigBrainPoint4: "高精度、复杂推理能力",
        workflow: "工作流程",
        workflowStep1: "小脑实时监测 → 发现潜在问题",
        workflowStep2: "唤醒大脑 → 收集环境数据和用户信息",
        workflowStep3: "多模态分析 → 深度思考与决策",
        workflowStep4: "执行干预措施 → 改善驾驶状态",
      },
      
      // 幻灯片5 - 创新特点
      slide5: {
        title: "系统创新特点",
        subtitle: "打造个性化的智能驾驶体验",
        userProfile: "用户画像系统",
        userProfileDesc: "记录用户特征和喜好的个性化数据库",
        userProfilePoint1: "用户可自行编辑个人信息",
        userProfilePoint2: "系统自动学习和更新用户偏好",
        userProfilePoint3: "为干预措施提供个性化基础",
        voiceClone: "声音克隆技术",
        voiceCloneDesc: "使用熟悉的声音提供语音服务",
        voiceClonePoint1: "亲人声音有助于缓解驾驶员情绪",
        voiceClonePoint2: "增强系统与用户的情感连接",
        voiceClonePoint3: "提高干预措施的接受度",
        carSystem: "车机系统集成",
        carSystemDesc: "大模型与车载系统的智能交互",
        carSystemPoint1: "格式化指令控制车机功能",
        carSystemPoint2: "环境调节（温度、音乐、香氛等）",
        carSystemPoint3: "导航系统与驾驶辅助功能协同",
      },
      
      // 幻灯片6 - 未来展望
      slide6: {
        title: "未来展望",
        subtitle: "持续创新，提升驾驶安全",
        futureGoals: "发展目标",
        goal1: "扩展支持的情绪类型和复杂场景",
        goal2: "增强离线处理能力，减少网络依赖",
        goal3: "与车载ADAS系统深度集成",
        goal4: "建立更全面的驾驶行为数据库",
        impact: "预期影响",
        impactPoint1: "显著降低情绪相关交通事故",
        impactPoint2: "提高驾驶舒适度和用户满意度",
        impactPoint3: "为智能驾驶领域提供新思路",
        callToAction: "体验我们的流程演示",
        demoButton: "查看流程演示",
        conclusion: "智能情绪检测车机系统 - 让驾驶更安全，更舒适",
      }
    },
    
    en: {
      title: "Intelligent Emotion Detection Vehicle System",
      subtitle: "A Large Model-Based Driving Safety Solution",
      languageBtn: "中文",
      nextBtn: "Next",
      prevBtn: "Previous",
      backToTools: "Back to Tools",
      
      // Slide 1 - Problem Background
      slide1: {
        title: "Driving Safety and Emotional Issues",
        subtitle: "Emotion is a key factor in safe driving that cannot be avoided",
        stats1: "In 2015, 17.33 million traffic violations were caused by angry driving nationwide",
        stats2: "A 2023 survey showed about 35% of drivers have 'road rage' tendencies",
        maleDrivers: "Male drivers show more significant driving behavior changes when angry",
        emotionTable: "Relationship between emotion types and driving behavior",
        emotionTypes: ["Negative", "Positive", "Neutral"],
        drivingEffects: ["Distracted attention, higher speed, increased lane changing", "Expanded attention", "In between"],
        accidentRisk: ["Higher accident risk", "Lower accident risk", "-"],
      },
      
      // Slide 2 - Emotion Effects
      slide2: {
        title: "Impact of Emotions on Driving Behavior",
        subtitle: "Driving behavior changes under different emotional states",
        emotionStates: ["Anger", "Fear", "Sadness", "Happiness", "Disgust", "Surprise"],
        dataSource: ["Real car and simulator", "Real car", "Real car and simulator", "Driving simulator", "Questionnaire", "Questionnaire"],
        dataType: ["Self-evaluation and physiological data", "Physiological data", "Physiological data", "Physiological data", "Self-assessment", "Self-assessment"],
        drivingImpact: [
          "Increased speeding, reduced deceleration, lower tolerance for others",
          "Positive correlation with aggressive driving behavior",
          "Reduced attention, increased reaction time",
          "Increased steering errors, reduced mirror checks, ignored traffic signs",
          "Difficulty concentrating, judgment errors",
          "Increased instability and unpredictability"
        ],
        complexFactors: "Factors affecting driver emotions are very complex",
        personalFactors: "Personal factors: gender, age, occupation, health status, etc.",
        externalFactors: "External factors: traffic conditions, vehicle status, environmental perception, road conditions, weather factors, etc.",
      },
      
      // Slide 3 - Solution
      slide3: {
        title: "Our Solution",
        subtitle: "Large Language Models + Emotion Detection = Intelligent Driving Assistant",
        llmAdvantage: "Advantages of Large Language Models",
        llmPoint1: "Ability to handle complex situations",
        llmPoint2: "Provide personalized solutions based on individual characteristics",
        llmPoint3: "Supported by a vast knowledge base",
        deepseekInfo: "Deepseek-R1 COT model outperforms domain professionals in benchmark tests",
        expertAnalogy: "Like having a 'psychology expert' accompanying you while driving",
        designChallenges: "System Design Challenges",
        challengePoint1: "Balancing performance and cost",
        challengePoint2: "Achieving real-time monitoring with precise analysis",
        challengePoint3: "Providing personalized and effective intervention measures",
      },
      
      // Slide 4 - System Architecture
      slide4: {
        title: "Big Brain/Small Brain Architecture",
        subtitle: "Efficient and Intelligent System Architecture",
        smallBrain: "Small Brain (Edge Computing)",
        smallBrainDesc: "Lightweight models running locally on Raspberry Pi",
        smallBrainPoint1: "Facial emotion detection model",
        smallBrainPoint2: "Voice emotion detection model",
        smallBrainPoint3: "Real-time driver state monitoring",
        smallBrainPoint4: "Low latency, high frequency operation",
        bigBrain: "Big Brain (Cloud-based Large Models)",
        bigBrainDesc: "Decision system composed of multiple large language models",
        bigBrainPoint1: "Doubao Model Vision - Image analysis",
        bigBrainPoint2: "DeepSeek-R1 - Deep thinking and decision making",
        bigBrainPoint3: "Professional knowledge base support",
        bigBrainPoint4: "High precision, complex reasoning capabilities",
        workflow: "Workflow",
        workflowStep1: "Small brain real-time monitoring → Potential problem detection",
        workflowStep2: "Wake up big brain → Collect environmental data and user information",
        workflowStep3: "Multimodal analysis → Deep thinking and decision making",
        workflowStep4: "Execute intervention measures → Improve driving state",
      },
      
      // Slide 5 - Innovative Features
      slide5: {
        title: "System Innovative Features",
        subtitle: "Creating Personalized Intelligent Driving Experience",
        userProfile: "User Profile System",
        userProfileDesc: "Personalized database recording user characteristics and preferences",
        userProfilePoint1: "Users can edit personal information",
        userProfilePoint2: "System automatically learns and updates user preferences",
        userProfilePoint3: "Provides personalization foundation for intervention measures",
        voiceClone: "Voice Cloning Technology",
        voiceCloneDesc: "Providing voice services using familiar voices",
        voiceClonePoint1: "Family members' voices help alleviate driver emotions",
        voiceClonePoint2: "Enhances emotional connection between system and user",
        voiceClonePoint3: "Improves acceptance of intervention measures",
        carSystem: "Vehicle System Integration",
        carSystemDesc: "Intelligent interaction between large models and vehicle systems",
        carSystemPoint1: "Formatted instructions control vehicle functions",
        carSystemPoint2: "Environmental adjustment (temperature, music, fragrance, etc.)",
        carSystemPoint3: "Navigation system and driving assistance functions coordination",
      },
      
      // Slide 6 - Future Outlook
      slide6: {
        title: "Future Outlook",
        subtitle: "Continuous Innovation, Enhancing Driving Safety",
        futureGoals: "Development Goals",
        goal1: "Expand support for emotion types and complex scenarios",
        goal2: "Enhance offline processing capabilities, reduce network dependency",
        goal3: "Deep integration with vehicle ADAS systems",
        goal4: "Establish a more comprehensive driving behavior database",
        impact: "Expected Impact",
        impactPoint1: "Significantly reduce emotion-related traffic accidents",
        impactPoint2: "Improve driving comfort and user satisfaction",
        impactPoint3: "Provide new ideas for the intelligent driving field",
        callToAction: "Experience our process demonstration",
        demoButton: "View Process Demo",
        conclusion: "Intelligent Emotion Detection Vehicle System - Making driving safer and more comfortable",
      }
    }
  };

  const t = translations[lang];

  // 渲染幻灯片导航点
  const renderDots = () => {
    return (
      <div className="flex justify-center mt-8">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 mx-2 rounded-full ${
              currentSlide === index ? "bg-blue-500" : "bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    );
  };

  // 幻灯片1 - 问题背景
  const renderSlide1 = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-500">{t.slide1.title}</h2>
        <p className="text-gray-400 mb-8 text-center">{t.slide1.subtitle}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">统计数据</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>{t.slide1.stats1}</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>{t.slide1.stats2}</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>{t.slide1.maleDrivers}</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">{t.slide1.emotionTable}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b border-gray-700 text-left">情绪类型</th>
                    <th className="px-4 py-2 border-b border-gray-700 text-left">驾驶行为影响</th>
                    <th className="px-4 py-2 border-b border-gray-700 text-left">事故风险</th>
                  </tr>
                </thead>
                <tbody>
                  {t.slide1.emotionTypes.map((type, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border-b border-gray-700">{type}</td>
                      <td className="px-4 py-2 border-b border-gray-700">{t.slide1.drivingEffects[index]}</td>
                      <td className="px-4 py-2 border-b border-gray-700">{t.slide1.accidentRisk[index]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-gradient-to-r from-red-900/30 to-red-600/30 p-4 rounded-lg border border-red-500/50 w-full max-w-4xl"
        >
          <p className="text-center text-red-300">
            {lang === "zh" 
              ? "研究表明，情绪可通过直接改变行为(如促进攻击性驾驶)或间接改变注意力效应对驾驶行为产生影响。在愤怒情绪下，驾驶人超速行为增多，减速让行减少，激进驾驶的可能性大幅提高，增加交通安全隐患。"
              : "Research shows that emotions can affect driving behavior by directly changing behavior (such as promoting aggressive driving) or indirectly changing attention effects. When angry, drivers speed more, reduce deceleration and yielding, and significantly increase the possibility of aggressive driving, increasing traffic safety risks."}
          </p>
        </motion.div>
      </motion.div>
    );
  };

  // 幻灯片2 - 情绪影响
  const renderSlide2 = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-500">{t.slide2.title}</h2>
        <p className="text-gray-400 mb-8 text-center">{t.slide2.subtitle}</p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl mb-8"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b border-gray-700 text-left">情绪状态</th>
                  <th className="px-4 py-2 border-b border-gray-700 text-left">数据来源</th>
                  <th className="px-4 py-2 border-b border-gray-700 text-left">数据类别</th>
                  <th className="px-4 py-2 border-b border-gray-700 text-left">对驾驶行为的影响</th>
                </tr>
              </thead>
              <tbody>
                {t.slide2.emotionStates.map((state, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border-b border-gray-700">{state}</td>
                    <td className="px-4 py-2 border-b border-gray-700">{t.slide2.dataSource[index]}</td>
                    <td className="px-4 py-2 border-b border-gray-700">{t.slide2.dataType[index]}</td>
                    <td className="px-4 py-2 border-b border-gray-700">{t.slide2.drivingImpact[index]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">{t.slide2.complexFactors}</h3>
            <p className="mb-4">{t.slide2.personalFactors}</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>{lang === "zh" ? "老年驾驶人更易受愉悦情绪影响" : "Elderly drivers are more affected by pleasant emotions"}</li>
              <li>{lang === "zh" ? "年轻男性更易受烦躁和焦虑影响" : "Young males are more susceptible to irritability and anxiety"}</li>
              <li>{lang === "zh" ? "出租车司机表现出更高的愤怒程度" : "Taxi drivers show higher levels of anger"}</li>
              <li>{lang === "zh" ? "健康状况（如青光眼）影响情绪稳定性" : "Health conditions (e.g., glaucoma) affect emotional stability"}</li>
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">{t.slide2.externalFactors}</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>{lang === "zh" ? "交通拥堵状况" : "Traffic congestion"}</li>
              <li>{lang === "zh" ? "车辆运行状态（如故障）" : "Vehicle operational status (e.g., malfunctions)"}</li>
              <li>{lang === "zh" ? "环境因素（温度、噪音）" : "Environmental factors (temperature, noise)"}</li>
              <li>{lang === "zh" ? "道路条件（复杂路况、施工）" : "Road conditions (complex situations, construction)"}</li>
              <li>{lang === "zh" ? "天气因素（雨雪、能见度）" : "Weather factors (rain, snow, visibility)"}</li>
              <li>{lang === "zh" ? "其他道路用户的行为" : "Behavior of other road users"}</li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // 幻灯片3 - 解决方案
  const renderSlide3 = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-500">{t.slide3.title}</h2>
        <p className="text-gray-400 mb-8 text-center">{t.slide3.subtitle}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">{t.slide3.llmAdvantage}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{t.slide3.llmPoint1}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{t.slide3.llmPoint2}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{t.slide3.llmPoint3}</span>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-500/50">
              <p>{t.slide3.deepseekInfo}</p>
              <p className="mt-2 font-semibold text-blue-300">{t.slide3.expertAnalogy}</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col"
          >
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">{t.slide3.designChallenges}</h3>
            
            <div className="flex-1 flex flex-col justify-between">
              <ul className="space-y-4 mb-6">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">⚠</span>
                  <span>{t.slide3.challengePoint2}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">⚠</span>
                  <span>{t.slide3.challengePoint3}</span>
                </li>
              </ul>
              
              <div className="mt-auto">
                <div className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/50">
                  <p className="text-center italic">
                    {lang === "zh" 
                      ? "我们的目标：让每位驾驶员都能拥有一位随时在线的情绪顾问，提供专业、及时、个性化的支持。"
                      : "Our goal: To provide every driver with an always-online emotional advisor offering professional, timely, and personalized support."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <div className="relative h-64 w-full overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 flex items-center justify-center">
              <p className="text-2xl font-bold text-center text-white px-4">
                {lang === "zh" 
                  ? "大语言模型 + 情绪检测 + 个性化干预 = 更安全的驾驶体验"
                  : "Large Language Models + Emotion Detection + Personalized Intervention = Safer Driving Experience"}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // 幻灯片4 - 系统架构
  const renderSlide4 = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-500">{t.slide4.title}</h2>
        <p className="text-gray-400 mb-8 text-center">{t.slide4.subtitle}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-400">{t.slide4.smallBrain}</h3>
            </div>
            <p className="text-gray-300 mb-4">{t.slide4.smallBrainDesc}</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>{t.slide4.smallBrainPoint1}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>{t.slide4.smallBrainPoint2}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>{t.slide4.smallBrainPoint3}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>{t.slide4.smallBrainPoint4}</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-400">{t.slide4.bigBrain}</h3>
            </div>
            <p className="text-gray-300 mb-4">{t.slide4.bigBrainDesc}</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{t.slide4.bigBrainPoint1}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{t.slide4.bigBrainPoint2}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{t.slide4.bigBrainPoint3}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{t.slide4.bigBrainPoint4}</span>
              </li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl"
        >
          <h3 className="text-xl font-semibold mb-4 text-purple-400">{t.slide4.workflow}</h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-500/50"></div>
            <div className="space-y-8 relative">
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center z-10 mr-4">1</div>
                <div className="pt-1">{t.slide4.workflowStep1}</div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center z-10 mr-4">2</div>
                <div className="pt-1">{t.slide4.workflowStep2}</div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center z-10 mr-4">3</div>
                <div className="pt-1">{t.slide4.workflowStep3}</div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center z-10 mr-4">4</div>
                <div className="pt-1">{t.slide4.workflowStep4}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // 幻灯片5 - 创新特点
  const renderSlide5 = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-500">{t.slide5.title}</h2>
        <p className="text-gray-400 mb-8 text-center">{t.slide5.subtitle}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-yellow-400">{t.slide5.userProfile}</h3>
            </div>
            <p className="text-gray-300 mb-4 text-sm">{t.slide5.userProfileDesc}</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span>{t.slide5.userProfilePoint1}</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span>{t.slide5.userProfilePoint2}</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span>{t.slide5.userProfilePoint3}</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-pink-400">{t.slide5.voiceClone}</h3>
            </div>
            <p className="text-gray-300 mb-4 text-sm">{t.slide5.voiceCloneDesc}</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="text-pink-500 mr-2">•</span>
                <span>{t.slide5.voiceClonePoint1}</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-500 mr-2">•</span>
                <span>{t.slide5.voiceClonePoint2}</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-500 mr-2">•</span>
                <span>{t.slide5.voiceClonePoint3}</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-cyan-400">{t.slide5.carSystem}</h3>
            </div>
            <p className="text-gray-300 mb-4 text-sm">{t.slide5.carSystemDesc}</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span>{t.slide5.carSystemPoint1}</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span>{t.slide5.carSystemPoint2}</span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-500 mr-2">•</span>
                <span>{t.slide5.carSystemPoint3}</span>
              </li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-6 rounded-lg border border-indigo-500/50 w-full max-w-4xl"
        >
          <p className="text-center text-lg font-semibold text-indigo-300 mb-4">
            {lang === "zh" ? "创新亮点" : "Innovative Highlights"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-white mb-2">
                {lang === "zh" ? "大小脑架构" : "Big/Small Brain Architecture"}
              </div>
              <p className="text-sm text-gray-300">
                {lang === "zh" ? "平衡性能与成本" : "Balancing performance and cost"}
              </p>
            </div>
            <div>
              <div className="text-xl font-bold text-white mb-2">
                {lang === "zh" ? "个性化用户画像" : "Personalized User Profiles"}
              </div>
              <p className="text-sm text-gray-300">
                {lang === "zh" ? "提供定制化体验" : "Providing customized experiences"}
              </p>
            </div>
            <div>
              <div className="text-xl font-bold text-white mb-2">
                {lang === "zh" ? "多模态干预" : "Multimodal Intervention"}
              </div>
              <p className="text-sm text-gray-300">
                {lang === "zh" ? "全方位情绪调节" : "Comprehensive emotional regulation"}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // 幻灯片6 - 未来展望
  const renderSlide6 = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-500">{t.slide6.title}</h2>
        <p className="text-gray-400 mb-8 text-center">{t.slide6.subtitle}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-green-400">{t.slide6.futureGoals}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3 mt-0.5">1</div>
                <span>{t.slide6.goal1}</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3 mt-0.5">2</div>
                <span>{t.slide6.goal2}</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3 mt-0.5">3</div>
                <span>{t.slide6.goal3}</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3 mt-0.5">4</div>
                <span>{t.slide6.goal4}</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-400">{t.slide6.impact}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>{t.slide6.impactPoint1}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>{t.slide6.impactPoint2}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>{t.slide6.impactPoint3}</span>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-500/50">
              <p className="text-center mb-3">{t.slide6.callToAction}</p>
              <div className="flex justify-center">
                <button 
                  onClick={() => router.push('/tools/process-demo')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {t.slide6.demoButton}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <div className="relative h-40 w-full overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 flex items-center justify-center">
              <p className="text-2xl font-bold text-center text-white px-4">
                {t.slide6.conclusion}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // 根据当前幻灯片渲染内容
  const renderCurrentSlide = () => {
    switch (currentSlide) {
      case 0:
        return renderSlide1();
      case 1:
        return renderSlide2();
      case 2:
        return renderSlide3();
      case 3:
        return renderSlide4();
      case 4:
        return renderSlide5();
      case 5:
        return renderSlide6();
      default:
        return renderSlide1();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-500">{t.title}</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              {t.languageBtn}
            </button>
            <button
              onClick={() => router.push('/tools')}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              {t.backToTools}
            </button>
          </div>
        </div>
        
        <p className="text-xl text-gray-400 mb-10 text-center">{t.subtitle}</p>
        
        <div className="bg-gray-800 rounded-lg p-8 mb-8 min-h-[60vh]">
          <AnimatePresence mode="wait">
            {renderCurrentSlide()}
          </AnimatePresence>
        </div>
        
        {renderDots()}
        
        <div className="flex justify-between mt-8">
          <button
            onClick={goToPrevSlide}
            disabled={currentSlide === 0}
            className={`px-6 py-3 rounded-lg ${
              currentSlide === 0
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition-colors`}
          >
            {t.prevBtn}
          </button>
          
          <button
            onClick={goToNextSlide}
            disabled={currentSlide === totalSlides - 1}
            className={`px-6 py-3 rounded-lg ${
              currentSlide === totalSlides - 1
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition-colors`}
          >
            {t.nextBtn}
          </button>
        </div>
      </div>
    </div>
  );
}