"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// 语言翻译
const translations = {
  zh: {
    title: "智能情绪检测车机系统 - 用户画像功能演示",
    subtitle: "展示我们系统如何构建和更新个性化用户画像",
    backToTools: "返回工具集",
    next: "下一步",
    prev: "上一步",
    steps: [
      "用户基础信息",
      "事件触发",
      "事件回顾分析",
      "用户画像更新",
      "大模型决策",
      "个性化干预"
    ],
    step1: {
      title: "第一步：用户基础信息",
      description: "系统初始化时会收集用户的基本信息，这些信息部分由用户主动填写，部分由系统采集。这些信息构成了用户画像的基础框架。",
      extendedDescription: "用户画像是我们系统个性化服务的核心。通过收集和分析用户数据，系统能够更好地理解用户需求并提供定制化体验。初始信息收集阶段非常重要，它为系统提供了理解用户的基础框架。我们注重隐私保护，所有数据都经过加密处理，且用户可以随时查看和修改自己的信息。",
      profileTitle: "用户基础画像",
      basicInfo: "基本信息",
      name: "姓名",
      age: "年龄",
      gender: "性别",
      drivingYears: "驾龄",
      healthStatus: "健康状况",
      preferenceTitle: "个人偏好",
      musicPreference: "音乐偏好",
      temperaturePreference: "温度偏好",
      fragrancePreference: "香氛偏好",
      emotionalTitle: "情绪特征",
      usualMood: "常态情绪",
      stressResponse: "压力反应",
      angerTriggers: "易怒触发点",
      calmingMethods: "有效舒缓方式",
      editProfile: "编辑信息",
      saveProfile: "保存信息",
      profileUpdated: "信息已更新",
      techDetails: "技术细节：用户画像数据以JSON格式存储，包含30+关键特征，支持动态扩展。所有敏感信息使用AES-256加密，且仅在本地设备和用户授权的云端备份中保存。"
    },
    step2: {
      title: "第二步：事件触发",
      description: "系统会持续监测用户状态，当检测到情绪变化或用户主动发起对话时，会触发一个事件。以下是一个情绪变化事件的示例。",
      extendedDescription: "事件是系统学习和更新用户画像的关键时刻。我们的系统能够识别两类主要事件：情绪触发事件和对话事件。情绪触发事件发生在系统检测到用户情绪显著变化时，例如突然的愤怒或沮丧；对话事件则是用户主动与系统交流时产生的。每个事件都会被记录并分析，为用户画像提供新的洞察。",
      eventTitle: "情绪事件记录",
      eventTime: "事件时间",
      eventType: "事件类型",
      emotionBefore: "事件前情绪",
      emotionAfter: "事件后情绪",
      eventContext: "事件环境",
      userResponse: "用户反应",
      systemAction: "系统行动",
      eventOutcome: "事件结果",
      emotionChange: "情绪变化",
      trafficCondition: "交通状况",
      weatherCondition: "天气状况",
      vehicleSpeed: "车速",
      drivingBehavior: "驾驶行为",
      triggerEvent: "模拟事件触发",
      eventTriggered: "事件已触发",
      processingEvent: "正在处理事件..."
    },
    step3: {
      title: "第三步：事件回顾分析",
      description: "事件结束后，豆包大模型会对整个事件进行回顾分析，提取关键信息并生成分析报告。",
      extendedDescription: "事件回顾分析是系统学习的关键环节。豆包大模型会分析事件的全过程，包括触发原因、情绪变化、用户反应和系统干预效果等。通过自然语言理解和多模态分析技术，模型能够从复杂的情境中提取有价值的信息，并将其转化为结构化的知识。这种分析不仅关注表面现象，还会探索深层原因，例如特定交通状况与用户情绪之间的关联，或者某种音乐对缓解用户焦虑的效果。",
      analysisTitle: "豆包模型事件分析",
      analyzing: "正在分析事件数据...",
      analysisComplete: "分析完成",
      eventSummary: "事件概述",
      keyCauses: "关键原因",
      emotionalResponse: "情绪反应",
      behavioralPatterns: "行为模式",
      interventionEffectiveness: "干预效果",
      insightsGained: "获得的洞察",
      userProfileImplications: "用户画像启示",
      confidenceScore: "分析置信度",
      viewFullAnalysis: "查看完整分析",
      hideFullAnalysis: "隐藏完整分析"
    },
    step4: {
      title: "第四步：用户画像更新",
      description: "基于事件分析，系统会生成用户画像更新建议，并将这些建议与当前画像一起提交给Deepseek-R1模型进行最终决策。",
      extendedDescription: "用户画像更新是系统'学习'的具体体现。豆包模型会根据事件分析结果，识别出可能需要更新的用户画像元素，例如新发现的触发情绪的因素、有效的干预方法或用户偏好的变化。这些更新建议会被结构化地组织起来，并与当前的用户画像一起提交给具有更强推理能力的Deepseek-R1模型，由它来做出最终的更新决策。这种双模型协作的方式结合了豆包模型的多模态理解能力和Deepseek-R1模型的深度推理能力，确保画像更新的准确性和合理性。",
      updateTitle: "用户画像更新建议",
      currentProfile: "当前用户画像",
      suggestedUpdates: "建议更新项",
      updateReasoning: "更新理由",
      confidenceLevel: "建议置信度",
      potentialImpact: "潜在影响",
      generatingUpdates: "正在生成更新建议...",
      updatesGenerated: "更新建议已生成",
      sendToDeepseek: "发送至Deepseek-R1进行决策",
      processing: "处理中..."
    },
    step5: {
      title: "第五步：大模型决策",
      description: "Deepseek-R1模型接收更新建议，通过链式思考(CoT)进行分析，决定是否接受这些更新以及如何调整。",
      extendedDescription: "Deepseek-R1模型是系统的'决策大脑'，负责对用户画像更新进行最终判断。它采用链式思考(Chain of Thought, CoT)推理方法，这种方法模拟人类的思考过程，通过多步骤推理得出结论。模型会考虑多种因素，包括新信息的可靠性、与现有画像的一致性、更新的必要性和潜在影响等。这种深度推理能力使Deepseek-R1能够做出更加谨慎和合理的决策，避免因单一事件而过度调整用户画像，同时也能及时捕捉用户特征的真正变化。",
      decisionTitle: "Deepseek-R1决策过程",
      thinking: "思考中...",
      reasoningSteps: "推理步骤",
      step1Label: "步骤1: 评估更新建议的可靠性",
      step2Label: "步骤2: 分析与现有画像的一致性",
      step3Label: "步骤3: 考虑更新的必要性",
      step4Label: "步骤4: 评估潜在影响",
      step5Label: "步骤5: 形成最终决策",
      finalDecision: "最终决策",
      acceptedUpdates: "接受的更新",
      modifiedUpdates: "经修改的更新",
      rejectedUpdates: "拒绝的更新",
      decisionRationale: "决策理由",
      decisionComplete: "决策完成",
      applyUpdates: "应用更新到用户画像",
      updatingProfile: "正在更新用户画像..."
    },
    step6: {
      title: "第六步：个性化干预",
      description: "基于更新后的用户画像，系统能够提供更加个性化的情绪干预，真正做到\"懂你\"。",
      extendedDescription: "个性化干预是用户画像系统的最终目标。通过不断学习和更新的用户画像，系统能够提供高度个性化的情绪干预方案。例如，系统可能了解到特定用户在压力大时喜欢听轻音乐，或者在焦虑时降低车内温度有助于缓解情绪。这些个性化的干预策略大大提高了系统的有效性，使其能够在关键时刻提供最适合用户的支持。随着时间推移和更多事件的积累，系统对用户的理解会越来越深入，干预也会越来越精准，最终实现真正\"懂你\"的智能伴侣。",
      interventionTitle: "个性化干预示例",
      userSituation: "用户情境",
      emotionalState: "情绪状态",
      contextFactors: "环境因素",
      personalizedApproach: "个性化方案",
      standardApproach: "标准方案",
      effectivenessComparison: "效果对比",
      interventionComponents: "干预组成部分",
      voiceComponent: "语音组件",
      environmentComponent: "环境组件",
      musicComponent: "音乐组件",
      navigationComponent: "导航组件",
      demonstrateIntervention: "演示个性化干预",
      generatingIntervention: "正在生成个性化干预方案...",
      interventionReady: "干预方案已就绪",
      conclusion: "结论：用户画像系统通过持续学习和更新，使我们的情绪干预更加个性化和有效，真正做到了解每位用户的独特需求和偏好。",
      thankYou: "感谢您的参与！",
      backToStart: "返回开始"
    }
  },
  en: {
    title: "Intelligent Emotion Detection Vehicle System - User Profile Demo",
    subtitle: "Demonstrating how our system builds and updates personalized user profiles",
    backToTools: "Back to Tools",
    next: "Next",
    prev: "Previous",
    steps: [
      "Basic User Information",
      "Event Trigger",
      "Event Review Analysis",
      "User Profile Update",
      "Large Model Decision",
      "Personalized Intervention"
    ],
    step1: {
      title: "Step 1: Basic User Information",
      description: "During system initialization, we collect basic user information, partly provided by the user and partly collected by the system. This information forms the foundation of the user profile.",
      extendedDescription: "User profiles are the core of our system's personalization capabilities. By collecting and analyzing user data, the system can better understand user needs and provide customized experiences. The initial information collection phase is crucial as it provides the system with a basic framework for understanding the user. We prioritize privacy protection - all data is encrypted, and users can view and modify their information at any time.",
      profileTitle: "Basic User Profile",
      basicInfo: "Basic Information",
      name: "Name",
      age: "Age",
      gender: "Gender",
      drivingYears: "Driving Experience",
      healthStatus: "Health Status",
      preferenceTitle: "Personal Preferences",
      musicPreference: "Music Preference",
      temperaturePreference: "Temperature Preference",
      fragrancePreference: "Fragrance Preference",
      emotionalTitle: "Emotional Characteristics",
      usualMood: "Usual Mood",
      stressResponse: "Stress Response",
      angerTriggers: "Anger Triggers",
      calmingMethods: "Effective Calming Methods",
      editProfile: "Edit Information",
      saveProfile: "Save Information",
      profileUpdated: "Profile Updated",
      techDetails: "Technical Details: User profile data is stored in JSON format, containing 30+ key attributes and supporting dynamic expansion. All sensitive information is encrypted using AES-256 and is only stored on the local device and in user-authorized cloud backups."
    },
    step2: {
      title: "Step 2: Event Trigger",
      description: "The system continuously monitors the user's state. When it detects emotional changes or when the user initiates a conversation, an event is triggered. Below is an example of an emotional change event.",
      extendedDescription: "Events are key moments for the system to learn and update user profiles. Our system can identify two main types of events: emotion-triggered events and conversation events. Emotion-triggered events occur when the system detects significant changes in the user's emotions, such as sudden anger or depression; conversation events are generated when the user actively communicates with the system. Each event is recorded and analyzed, providing new insights for the user profile.",
      eventTitle: "Emotional Event Record",
      eventTime: "Event Time",
      eventType: "Event Type",
      emotionBefore: "Emotion Before Event",
      emotionAfter: "Emotion After Event",
      eventContext: "Event Context",
      userResponse: "User Response",
      systemAction: "System Action",
      eventOutcome: "Event Outcome",
      emotionChange: "Emotional Change",
      trafficCondition: "Traffic Condition",
      weatherCondition: "Weather Condition",
      vehicleSpeed: "Vehicle Speed",
      drivingBehavior: "Driving Behavior",
      triggerEvent: "Simulate Event Trigger",
      eventTriggered: "Event Triggered",
      processingEvent: "Processing Event..."
    },
    step3: {
      title: "Step 3: Event Review Analysis",
      description: "After an event concludes, the Doubao large model reviews the entire event, extracts key information, and generates an analysis report.",
      extendedDescription: "Event review analysis is a key component of the system's learning process. The Doubao model analyzes the entire event, including trigger causes, emotional changes, user responses, and the effectiveness of system interventions. Through natural language understanding and multimodal analysis techniques, the model can extract valuable information from complex situations and transform it into structured knowledge. This analysis not only focuses on surface phenomena but also explores deeper causes, such as the connection between specific traffic conditions and user emotions, or the effect of certain music in alleviating user anxiety.",
      analysisTitle: "Doubao Model Event Analysis",
      analyzing: "Analyzing event data...",
      analysisComplete: "Analysis Complete",
      eventSummary: "Event Summary",
      keyCauses: "Key Causes",
      emotionalResponse: "Emotional Response",
      behavioralPatterns: "Behavioral Patterns",
      interventionEffectiveness: "Intervention Effectiveness",
      insightsGained: "Insights Gained",
      userProfileImplications: "User Profile Implications",
      confidenceScore: "Analysis Confidence",
      viewFullAnalysis: "View Full Analysis",
      hideFullAnalysis: "Hide Full Analysis"
    },
    step4: {
      title: "Step 4: User Profile Update",
      description: "Based on the event analysis, the system generates user profile update suggestions and submits these suggestions along with the current profile to the Deepseek-R1 model for final decision-making.",
      extendedDescription: "User profile updates are the concrete manifestation of the system's 'learning'. The Doubao model identifies elements of the user profile that may need updating based on event analysis results, such as newly discovered emotional triggers, effective intervention methods, or changes in user preferences. These update suggestions are structured and submitted along with the current user profile to the Deepseek-R1 model, which has stronger reasoning capabilities, for final update decisions. This dual-model collaboration combines the multimodal understanding capabilities of the Doubao model with the deep reasoning capabilities of the Deepseek-R1 model, ensuring the accuracy and reasonableness of profile updates.",
      updateTitle: "User Profile Update Suggestions",
      currentProfile: "Current User Profile",
      suggestedUpdates: "Suggested Updates",
      updateReasoning: "Update Reasoning",
      confidenceLevel: "Suggestion Confidence",
      potentialImpact: "Potential Impact",
      generatingUpdates: "Generating update suggestions...",
      updatesGenerated: "Update suggestions generated",
      sendToDeepseek: "Send to Deepseek-R1 for decision",
      processing: "Processing..."
    },
    step5: {
      title: "Step 5: Large Model Decision",
      description: "The Deepseek-R1 model receives update suggestions, analyzes them through Chain of Thought (CoT) reasoning, and decides whether to accept these updates and how to adjust them.",
      extendedDescription: "The Deepseek-R1 model serves as the system's 'decision brain', responsible for making final judgments on user profile updates. It employs Chain of Thought (CoT) reasoning, a method that simulates human thinking processes by reaching conclusions through multi-step reasoning. The model considers multiple factors, including the reliability of new information, consistency with the existing profile, necessity of updates, and potential impacts. This deep reasoning capability allows Deepseek-R1 to make more cautious and reasonable decisions, avoiding excessive adjustments to the user profile due to a single event while also capturing true changes in user characteristics in a timely manner.",
      decisionTitle: "Deepseek-R1 Decision Process",
      thinking: "Thinking...",
      reasoningSteps: "Reasoning Steps",
      step1Label: "Step 1: Evaluate reliability of update suggestions",
      step2Label: "Step 2: Analyze consistency with existing profile",
      step3Label: "Step 3: Consider necessity of updates",
      step4Label: "Step 4: Assess potential impacts",
      step5Label: "Step 5: Form final decision",
      finalDecision: "Final Decision",
      acceptedUpdates: "Accepted Updates",
      modifiedUpdates: "Modified Updates",
      rejectedUpdates: "Rejected Updates",
      decisionRationale: "Decision Rationale",
      decisionComplete: "Decision Complete",
      applyUpdates: "Apply Updates to User Profile",
      updatingProfile: "Updating user profile..."
    },
    step6: {
      title: "Step 6: Personalized Intervention",
      description: "Based on the updated user profile, the system can provide more personalized emotional interventions, truly achieving an understanding of the user.",
      extendedDescription: "Personalized intervention is the ultimate goal of the user profile system. Through continuously learning and updating user profiles, the system can provide highly personalized emotional intervention solutions. For example, the system might learn that a specific user prefers listening to light music when under stress, or that lowering the in-car temperature helps alleviate anxiety. These personalized intervention strategies greatly improve the system's effectiveness, enabling it to provide the most suitable support for users at critical moments. As time passes and more events accumulate, the system's understanding of the user deepens, and interventions become more precise, ultimately achieving a truly intelligent companion that 'understands you'.",
      interventionTitle: "Personalized Intervention Example",
      userSituation: "User Situation",
      emotionalState: "Emotional State",
      contextFactors: "Contextual Factors",
      personalizedApproach: "Personalized Approach",
      standardApproach: "Standard Approach",
      effectivenessComparison: "Effectiveness Comparison",
      interventionComponents: "Intervention Components",
      voiceComponent: "Voice Component",
      environmentComponent: "Environment Component",
      musicComponent: "Music Component",
      navigationComponent: "Navigation Component",
      demonstrateIntervention: "Demonstrate Personalized Intervention",
      generatingIntervention: "Generating personalized intervention plan...",
      interventionReady: "Intervention plan ready",
      conclusion: "Conclusion: The user profile system, through continuous learning and updating, makes our emotional interventions more personalized and effective, truly understanding each user's unique needs and preferences.",
      thankYou: "Thank you for your participation!",
      backToStart: "Back to Start"
    }
  }
};

// 默认用户数据
const defaultUserProfile = {
  name: "张先生",
  age: 35,
  gender: "男",
  drivingYears: 10,
  healthStatus: "良好，轻度高血压",
  musicPreference: "古典音乐，轻音乐",
  temperaturePreference: "偏凉爽，22-24°C",
  fragrancePreference: "淡雅花香，柑橘类",
  usualMood: "平静，专注",
  stressResponse: "沉默，语速加快",
  angerTriggers: "交通拥堵，被加塞",
  calmingMethods: "深呼吸，古典音乐"
};

// 模拟事件数据
const simulatedEvent = {
  time: "2025-03-19 14:32:45",
  type: "情绪触发事件",
  emotionBefore: "平静",
  emotionAfter: "愤怒",
  context: "高速公路，交通拥堵",
  userResponse: "语速加快，握紧方向盘，多次按喇叭",
  systemAction: "播放舒缓音乐，降低车内温度",
  outcome: "情绪部分缓解，但仍有明显不满",
  trafficCondition: "严重拥堵，前方发生交通事故",
  weatherCondition: "晴朗",
  vehicleSpeed: "5-10 km/h",
  drivingBehavior: "频繁变道，急刹车"
};

// 模拟分析结果
const simulatedAnalysis = {
  summary: "用户在交通拥堵情况下表现出明显的愤怒情绪，系统干预效果有限。",
  keyCauses: "交通拥堵是主要触发因素；用户对被限制行动自由特别敏感；当天工作压力可能是加剧因素。",
  emotionalResponse: "愤怒情绪表现为语速加快，肢体紧绷，驾驶行为更激进。",
  behavioralPatterns: "用户在拥堵环境下倾向于通过频繁变道寻找更快路线，这种行为可能加剧焦虑。",
  interventionEffectiveness: "音乐干预效果一般；温度调节有一定效果，用户对凉爽环境反应积极。",
  insightsGained: "用户在拥堵环境下需要更强力的干预组合；提前预警可能更有效。",
  userProfileImplications: "需更新用户对交通拥堵的敏感度评级；添加新的有效干预方法；记录对温度调节的积极反应。",
  confidenceScore: 85
};

// 模拟更新建议
const simulatedUpdateSuggestions = [
  {
    field: "angerTriggers",
    currentValue: "交通拥堵，被加塞",
    suggestedValue: "交通拥堵（高敏感度），被加塞，行动受限",
    reasoning: "多次事件观察表明用户对交通拥堵的情绪反应强度高于平均水平，应标记为高敏感度触发因素。",
    confidence: 92,
    impact: "高 - 将影响未来干预策略的优先级和强度"
  },
  {
    field: "calmingMethods",
    currentValue: "深呼吸，古典音乐",
    suggestedValue: "深呼吸，古典音乐，降低环境温度，提供路况信息",
    reasoning: "观察到降低车内温度对缓解用户愤怒情绪有明显效果；提供前方路况信息可减轻不确定性带来的焦虑。",
    confidence: 78,
    impact: "中 - 扩展可用的干预方法池"
  },
  {
    field: "新字段：preferredVoiceTone",
    currentValue: "无",
    suggestedValue: "平静，低沉，语速适中",
    reasoning: "分析用户与系统交互模式发现，用户对平静、低沉的语音提示反应更积极，特别是在压力情境下。",
    confidence: 65,
    impact: "中 - 优化语音交互体验"
  }
];

// 模拟决策过程
const simulatedDecisionSteps = [
  "评估更新建议的可靠性：第一项关于愤怒触发因素的更新建议基于多次观察，可靠性高；第二项关于舒缓方法的更新有直接观察支持，可靠性中高；第三项是新增字段，数据点较少，可靠性中等。",
  "分析与现有画像的一致性：所有建议都与现有用户画像保持一致，是对现有信息的扩展和细化，而非矛盾或替换。",
  "考虑更新的必要性：第一项和第二项更新对提升干预效果有直接帮助，必要性高；第三项可以改善交互体验，但非紧急需求。",
  "评估潜在影响：这些更新将使系统在交通拥堵情况下提供更有针对性的干预，可能显著提升用户体验；无负面影响风险。",
  "形成最终决策：接受第一项和第二项更新；第三项由于数据点较少，建议收集更多证据后再更新，但可以在内部测试中使用该参数。"
];

// 模拟决策结果
const simulatedDecision = {
  acceptedUpdates: [
    {
      field: "angerTriggers",
      newValue: "交通拥堵（高敏感度），被加塞，行动受限"
    },
    {
      field: "calmingMethods",
      newValue: "深呼吸，古典音乐，降低环境温度，提供路况信息"
    }
  ],
  modifiedUpdates: [],
  rejectedUpdates: [
    {
      field: "preferredVoiceTone",
      reason: "数据点不足，需要更多观察证据支持"
    }
  ],
  rationale: "接受了有充分证据支持且对干预效果有直接提升的更新；暂缓了数据支持不足的新字段添加，避免过早定型可能不准确的用户特征。"
};

// 模拟个性化干预
const simulatedIntervention = {
  situation: "用户正在高速公路上遇到严重交通拥堵",
  emotionalState: "初期烦躁，有发展为愤怒的趋势",
  contextFactors: "工作日下午，用户可能赶时间；天气炎热；已堵车15分钟",
  standardApproach: "播放舒缓音乐，提供一般性安抚",
  personalizedApproach: "降低车内温度至23°C；播放用户偏好的巴赫音乐；提供实时路况信息和预计恢复时间；使用平静语调建议可行的替代路线",
  effectivenessComparison: "标准方案在类似情境下平均有效率约45%；个性化方案预计有效率可提升至75%以上",
  components: {
    voice: "使用平静、低沉语调：'张先生，前方拥堵预计还需20分钟，我已找到一条替代路线，可以节省15分钟。'",
    environment: "已将温度调至您偏好的23°C，清新模式已开启",
    music: "正在播放您喜爱的巴赫《G弦上的咏叹调》",
    navigation: "导航已重新规划，新路线将避开主要拥堵区域"
  }
};

export default function UserProfileDemoPage() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "zh";
  const t = translations[lang] || translations.zh;
  
  const [step, setStep] = useState(1);
  const [userProfile, setUserProfile] = useState(defaultUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isEventTriggered, setIsEventTriggered] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [isGeneratingUpdates, setIsGeneratingUpdates] = useState(false);
  const [isUpdatesGenerated, setIsUpdatesGenerated] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isDecisionComplete, setIsDecisionComplete] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const [isGeneratingIntervention, setIsGeneratingIntervention] = useState(false);
  const [isInterventionReady, setIsInterventionReady] = useState(false);
  
  // 切换语言
  const toggleLanguage = () => {
    const newLang = lang === "zh" ? "en" : "zh";
    window.location.href = `?lang=${newLang}`;
  };

  // 切换步骤
  const goToStep = (newStep) => {
    if (newStep >= 1 && newStep <= 6) {
      setStep(newStep);
      resetStepStates(newStep);
    }
  };
  
  // 重置步骤状态
  const resetStepStates = (newStep) => {
    if (newStep <= 1) {
      setIsEditing(false);
      setIsProfileUpdated(false);
    }
    if (newStep <= 2) {
      setIsEventTriggered(false);
    }
    if (newStep <= 3) {
      setIsAnalyzing(false);
      setIsAnalysisComplete(false);
      setShowFullAnalysis(false);
    }
    if (newStep <= 4) {
      setIsGeneratingUpdates(false);
      setIsUpdatesGenerated(false);
    }
    if (newStep <= 5) {
      setIsThinking(false);
      setIsDecisionComplete(false);
      setIsUpdatingProfile(false);
    }
    if (newStep <= 6) {
      setIsGeneratingIntervention(false);
      setIsInterventionReady(false);
    }
  };

  // 编辑用户信息
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };
  
  // 保存用户信息
  const saveProfile = () => {
    setIsEditing(false);
    setIsProfileUpdated(true);
    
    setTimeout(() => {
      setIsProfileUpdated(false);
    }, 3000);
  };
  
  // 触发事件
  const triggerEvent = () => {
    setIsEventTriggered(true);
  };
  
  // 开始分析
  const startAnalysis = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalysisComplete(true);
    }, 3000);
  };
  
  // 切换显示完整分析
  const toggleFullAnalysis = () => {
    setShowFullAnalysis(!showFullAnalysis);
  };
  
  // 生成更新建议
  const generateUpdates = () => {
    setIsGeneratingUpdates(true);
    
    setTimeout(() => {
      setIsGeneratingUpdates(false);
      setIsUpdatesGenerated(true);
    }, 3000);
  };
  
  // 发送至Deepseek-R1进行决策
  const sendToDeepseek = () => {
    setIsThinking(true);
    
    setTimeout(() => {
      setIsThinking(false);
      setIsDecisionComplete(true);
    }, 4000);
  };
  
  // 应用更新
  const applyUpdates = () => {
    setIsUpdatingProfile(true);
    
    setTimeout(() => {
      setIsUpdatingProfile(false);
      goToStep(6);
    }, 2000);
  };
  
  // 生成个性化干预
  const generateIntervention = () => {
    setIsGeneratingIntervention(true);
    
    setTimeout(() => {
      setIsGeneratingIntervention(false);
      setIsInterventionReady(true);
    }, 3000);
  };
  
  // 渲染导航点
  const renderDots = () => {
    return (
      <div className="flex justify-center mt-8">
        <div className="flex space-x-2">
          {Array.from({ length: 6 }, (_, i) => (
            <button
              key={i}
              onClick={() => goToStep(i + 1)}
              className={`w-3 h-3 rounded-full ${
                step === i + 1 ? "bg-blue-500" : "bg-gray-400"
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
      </div>
    );
  };

  // 渲染步骤指示器
  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {t.steps.map((stepName, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index < t.steps.length - 1 ? "w-1/6" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step > index + 1
                    ? "bg-green-500"
                    : step === index + 1
                    ? "bg-blue-500"
                    : "bg-gray-700"
                } mb-2`}
              >
                {step > index + 1 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-white">{index + 1}</span>
                )}
              </div>
              <span
                className={`text-xs text-center ${
                  step === index + 1 ? "text-blue-400" : "text-gray-400"
                }`}
              >
                {stepName}
              </span>
              {index < t.steps.length - 1 && (
                <div
                  className={`h-0.5 w-full mt-5 ${
                    step > index + 1 ? "bg-green-500" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 渲染第一步 - 用户基础信息
  const renderStep1 = () => {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2 text-blue-400">{t.step1.title}</h2>
        <p className="text-gray-300 mb-6">{t.step1.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-300">{t.step1.profileTitle}</h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-1">{t.step1.name}</label>
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">{t.step1.age}</label>
                  <input
                    type="number"
                    value={userProfile.age}
                    onChange={(e) => setUserProfile({...userProfile, age: e.target.value})}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">{t.step1.gender}</label>
                  <select
                    value={userProfile.gender}
                    onChange={(e) => setUserProfile({...userProfile, gender: e.target.value})}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded"
                  >
                    <option value="男">男</option>
                    <option value="女">女</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">{t.step1.musicPreference}</label>
                  <input
                    type="text"
                    value={userProfile.musicPreference}
                    onChange={(e) => setUserProfile({...userProfile, musicPreference: e.target.value})}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">{t.step1.angerTriggers}</label>
                  <input
                    type="text"
                    value={userProfile.angerTriggers}
                    onChange={(e) => setUserProfile({...userProfile, angerTriggers: e.target.value})}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={saveProfile}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    {t.step1.saveProfile}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3 text-yellow-300">{t.step1.basicInfo}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-400">{t.step1.name}</p>
                      <p className="text-white">{userProfile.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">{t.step1.age}</p>
                      <p className="text-white">{userProfile.age}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">{t.step1.gender}</p>
                      <p className="text-white">{userProfile.gender}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">{t.step1.drivingYears}</p>
                      <p className="text-white">{userProfile.drivingYears}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-400">{t.step1.healthStatus}</p>
                      <p className="text-white">{userProfile.healthStatus}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3 text-green-300">{t.step1.preferenceTitle}</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="text-gray-400">{t.step1.musicPreference}</p>
                      <p className="text-white">{userProfile.musicPreference}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">{t.step1.temperaturePreference}</p>
                      <p className="text-white">{userProfile.temperaturePreference}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">{t.step1.fragrancePreference}</p>
                      <p className="text-white">{userProfile.fragrancePreference}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3 text-pink-300">{t.step1.emotionalTitle}</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="text-gray-400">{t.step1.usualMood}</p>
                      <p className="text-white">{userProfile.usualMood}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">{t.step1.stressResponse}</p>
                      <p className="text-white">{userProfile.stressResponse}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">{t.step1.angerTriggers}</p>
                      <p className="text-white">{userProfile.angerTriggers}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">{t.step1.calmingMethods}</p>
                      <p className="text-white">{userProfile.calmingMethods}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={toggleEditing}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                  >
                    {t.step1.editProfile}
                  </button>
                </div>
                
                {isProfileUpdated && (
                  <div className="mt-4 p-3 bg-green-900/50 text-green-300 rounded">
                    {t.step1.profileUpdated}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-300">{t.step1.extendedDescription}</h3>
            
            <div className="mt-6 p-4 bg-gray-800 rounded border border-gray-600">
              <p className="text-sm text-gray-300 italic">{t.step1.techDetails}</p>
            </div>
            <div className="mt-6">
              <div className="relative h-48 overflow-hidden rounded-lg bg-gradient-to-r from-blue-900/30 to-purple-900/30 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-500 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="relative z-10 text-center p-4">
                  <h4 className="text-lg font-medium text-blue-300 mb-2">
                    {lang === "zh" ? "用户画像是系统的核心" : "User Profile is the Core of the System"}
                  </h4>
                  <p className="text-sm text-gray-300">
                    {lang === "zh" 
                      ? "它使系统能够提供真正个性化的体验，并随着时间的推移不断学习和适应" 
                      : "It enables the system to provide truly personalized experiences and continuously learn and adapt over time"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染第二步 - 事件触发
  const renderStep2 = () => {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2 text-blue-400">{t.step2.title}</h2>
        <p className="text-gray-300 mb-6">{t.step2.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-orange-300">{t.step2.eventTitle}</h3>
            
            {!isEventTriggered ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-300 mb-4">
                  {lang === "zh" 
                    ? "点击下方按钮模拟一个情绪变化事件" 
                    : "Click the button below to simulate an emotional change event"}
                </p>
                <button
                  onClick={triggerEvent}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  {t.step2.triggerEvent}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-400">{t.step2.eventTime}</p>
                    <p className="text-white">{simulatedEvent.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">{t.step2.eventType}</p>
                    <p className="text-white">{simulatedEvent.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">{t.step2.emotionBefore}</p>
                    <p className="text-white">{simulatedEvent.emotionBefore}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">{t.step2.emotionAfter}</p>
                    <p className="text-white font-medium text-red-400">{simulatedEvent.emotionAfter}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-400 mb-1">{t.step2.eventContext}</p>
                  <p className="text-white">{simulatedEvent.context}</p>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-400 mb-1">{t.step2.userResponse}</p>
                  <p className="text-white">{simulatedEvent.userResponse}</p>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-400 mb-1">{t.step2.systemAction}</p>
                  <p className="text-white">{simulatedEvent.systemAction}</p>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-400 mb-1">{t.step2.eventOutcome}</p>
                  <p className="text-white">{simulatedEvent.outcome}</p>
                </div>
                
                <div className="p-3 bg-green-900/50 text-green-300 rounded">
                  {t.step2.eventTriggered}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-300">{t.step2.extendedDescription}</h3>
            
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-lg font-medium text-yellow-300 mb-2">
                  {lang === "zh" ? "事件环境数据" : "Event Environmental Data"}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-400">{t.step2.trafficCondition}</p>
                    <p className="text-white">{simulatedEvent.trafficCondition}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">{t.step2.weatherCondition}</p>
                    <p className="text-white">{simulatedEvent.weatherCondition}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">{t.step2.vehicleSpeed}</p>
                    <p className="text-white">{simulatedEvent.vehicleSpeed}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">{t.step2.drivingBehavior}</p>
                    <p className="text-white">{simulatedEvent.drivingBehavior}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="relative h-48 overflow-hidden rounded-lg bg-gradient-to-r from-orange-900/30 to-red-900/30 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-orange-500 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="relative z-10 text-center p-4">
                    <h4 className="text-lg font-medium text-orange-300 mb-2">
                      {lang === "zh" ? "事件是学习的关键时刻" : "Events are Key Learning Moments"}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {lang === "zh" 
                        ? "每个事件都为系统提供了理解用户的宝贵机会" 
                        : "Each event provides the system with a valuable opportunity to understand the user"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染第三步 - 事件回顾分析
  const renderStep3 = () => {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2 text-blue-400">{t.step3.title}</h2>
        <p className="text-gray-300 mb-6">{t.step3.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">{t.step3.analysisTitle}</h3>
            
            {!isAnalyzing && !isAnalysisComplete ? (
              <div className="flex flex-col items-center justify-center h-64">
                <button
                  onClick={startAnalysis}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {lang === "zh" ? "开始分析事件" : "Start Event Analysis"}
                </button>
              </div>
            ) : isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-purple-300">{t.step3.analyzing}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-green-900/50 text-green-300 rounded mb-4">
                  {t.step3.analysisComplete}
                </div>
                
                <div>
                  <p className="text-gray-400 mb-1">{t.step3.eventSummary}</p>
                  <p className="text-white">{simulatedAnalysis.summary}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 mb-1">{t.step3.keyCauses}</p>
                  <p className="text-white">{simulatedAnalysis.keyCauses}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 mb-1">{t.step3.emotionalResponse}</p>
                  <p className="text-white">{simulatedAnalysis.emotionalResponse}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 mb-1">{t.step3.userProfileImplications}</p>
                  <p className="text-white">{simulatedAnalysis.userProfileImplications}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 mb-1">{t.step3.confidenceScore}</p>
                    <p className="text-white">{simulatedAnalysis.confidenceScore}%</p>
                  </div>
                  <button
                    onClick={toggleFullAnalysis}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                  >
                    {showFullAnalysis ? t.step3.hideFullAnalysis : t.step3.viewFullAnalysis}
                  </button>
                </div>
                
                {showFullAnalysis && (
                  <div className="mt-4 p-4 bg-gray-800 rounded border border-gray-600">
                    <h4 className="text-lg font-medium text-purple-300 mb-3">
                      {lang === "zh" ? "完整分析报告" : "Full Analysis Report"}
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 mb-1">{t.step3.behavioralPatterns}</p>
                        <p className="text-white">{simulatedAnalysis.behavioralPatterns}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">{t.step3.interventionEffectiveness}</p>
                        <p className="text-white">{simulatedAnalysis.interventionEffectiveness}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">{t.step3.insightsGained}</p>
                        <p className="text-white">{simulatedAnalysis.insightsGained}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-300">{t.step3.extendedDescription}</h3>
            
            <div className="mt-6">
              <div className="relative h-48 overflow-hidden rounded-lg bg-gradient-to-r from-purple-900/30 to-blue-900/30 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-purple-500 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="relative z-10 text-center p-4">
                  <h4 className="text-lg font-medium text-purple-300 mb-2">
                    {lang === "zh" ? "豆包模型的多模态分析能力" : "Doubao Model's Multimodal Analysis Capability"}
                  </h4>
                  <p className="text-sm text-gray-300">
                    {lang === "zh" 
                      ? "结合视觉、语音和环境数据进行深度分析" 
                      : "Combines visual, audio, and environmental data for deep analysis"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-800 rounded border border-gray-600">
              <p className="text-sm text-gray-300">
                {lang === "zh"
                  ? "豆包模型使用多层注意力机制，能够同时处理图像、音频和结构化数据，从而全面理解事件上下文。分析结果的置信度基于证据强度和数据质量动态评估。"
                  : "The Doubao model uses multi-layer attention mechanisms to simultaneously process images, audio, and structured data for comprehensive event context understanding. Analysis confidence is dynamically evaluated based on evidence strength and data quality."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染第四步 - 用户画像更新
  const renderStep4 = () => {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2 text-blue-400">{t.step4.title}</h2>
        <p className="text-gray-300 mb-6">{t.step4.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-300">{t.step4.updateTitle}</h3>
            
            {!isGeneratingUpdates && !isUpdatesGenerated ? (
              <div className="flex flex-col items-center justify-center h-64">
                <button
                  onClick={generateUpdates}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {lang === "zh" ? "生成更新建议" : "Generate Update Suggestions"}
                </button>
              </div>
            ) : isGeneratingUpdates ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-green-300">{t.step4.generatingUpdates}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-green-900/50 text-green-300 rounded mb-4">
                  {t.step4.updatesGenerated}
                </div>
                
                <div className="space-y-6">
                  {simulatedUpdateSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 bg-gray-800 rounded border border-gray-600">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-medium text-yellow-300">{suggestion.field}</h4>
                        <span className="text-sm px-2 py-1 rounded bg-blue-900/50 text-blue-300">
                          {suggestion.confidence}% {t.step4.confidenceLevel}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">{t.step4.currentProfile}</p>
                          <p className="text-white">{suggestion.currentValue}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm mb-1">{t.step4.suggestedUpdates}</p>
                          <p className="text-green-300 font-medium">{suggestion.suggestedValue}</p>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <p className="text-gray-400 text-sm mb-1">{t.step4.updateReasoning}</p>
                        <p className="text-white">{suggestion.reasoning}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-400 text-sm mb-1">{t.step4.potentialImpact}</p>
                        <p className="text-white">{suggestion.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <button
                    onClick={sendToDeepseek}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t.step4.sendToDeepseek}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-300">{t.step4.extendedDescription}</h3>
            
            <div className="mt-6">
              <div className="relative h-48 overflow-hidden rounded-lg bg-gradient-to-r from-green-900/30 to-teal-900/30 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="relative z-10 text-center p-4">
                  <h4 className="text-lg font-medium text-green-300 mb-2">
                    {lang === "zh" ? "持续学习与更新" : "Continuous Learning and Updating"}
                  </h4>
                  <p className="text-sm text-gray-300">
                    {lang === "zh" 
                      ? "系统通过每次交互不断完善用户画像" 
                      : "The system continuously refines the user profile through each interaction"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-800 rounded border border-gray-600">
              <h4 className="text-lg font-medium text-green-300 mb-3">
                {lang === "zh" ? "双模型协作流程" : "Dual-Model Collaboration Process"}
              </h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-purple-300">1</span>
                  </div>
                  <p className="text-gray-300">
                    {lang === "zh"
                      ? "豆包模型分析事件并提取关键信息"
                      : "Doubao model analyzes events and extracts key information"}
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-green-300">2</span>
                  </div>
                  <p className="text-gray-300">
                    {lang === "zh"
                      ? "生成结构化的用户画像更新建议"
                      : "Generates structured user profile update suggestions"}
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-blue-300">3</span>
                  </div>
                  <p className="text-gray-300">
                    {lang === "zh"
                      ? "Deepseek-R1模型评估建议并做出最终决策"
                      : "Deepseek-R1 model evaluates suggestions and makes final decisions"}
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-yellow-900/50 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-yellow-300">4</span>
                  </div>
                  <p className="text-gray-300">
                    {lang === "zh"
                      ? "更新后的画像用于优化未来干预策略"
                      : "Updated profile is used to optimize future intervention strategies"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染第五步 - 大模型决策
  const renderStep5 = () => {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2 text-blue-400">{t.step5.title}</h2>
        <p className="text-gray-300 mb-6">{t.step5.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-300">{t.step5.decisionTitle}</h3>
            
            {isThinking ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-blue-300">{t.step5.thinking}</p>
              </div>
            ) : !isDecisionComplete ? (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-yellow-300 mb-3">{t.step5.reasoningSteps}</h4>
                
                <div className="space-y-4">
                  {simulatedDecisionSteps.map((step, index) => (
                    <div key={index} className="p-3 bg-gray-800 rounded border border-gray-600">
                      <p className="text-white">{step}</p>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 bg-blue-900/50 text-blue-300 rounded mt-6">
                  {t.step5.decisionComplete}
                </div>
                
                <div className="space-y-4 mt-4">
                  <div>
                    <h4 className="text-lg font-medium text-green-300 mb-2">{t.step5.acceptedUpdates}</h4>
                    {simulatedDecision.acceptedUpdates.map((update, index) => (
                      <div key={index} className="p-3 bg-green-900/20 rounded border border-green-800 mb-2">
                        <p className="text-gray-300 mb-1">{update.field}</p>
                        <p className="text-green-300">{update.newValue}</p>
                      </div>
                    ))}
                  </div>
                  
                  {simulatedDecision.modifiedUpdates.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-yellow-300 mb-2">{t.step5.modifiedUpdates}</h4>
                      {simulatedDecision.modifiedUpdates.map((update, index) => (
                        <div key={index} className="p-3 bg-yellow-900/20 rounded border border-yellow-800 mb-2">
                          <p className="text-gray-300 mb-1">{update.field}</p>
                          <p className="text-yellow-300">{update.newValue}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-lg font-medium text-red-300 mb-2">{t.step5.rejectedUpdates}</h4>
                    {simulatedDecision.rejectedUpdates.map((update, index) => (
                      <div key={index} className="p-3 bg-red-900/20 rounded border border-red-800 mb-2">
                        <p className="text-gray-300 mb-1">{update.field}</p>
                        <p className="text-red-300">{update.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-400 mb-1">{t.step5.decisionRationale}</p>
                  <p className="text-white">{simulatedDecision.rationale}</p>
                </div>
                
                <div className="flex justify-center mt-6">
                  <button
                    onClick={applyUpdates}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t.step5.applyUpdates}
                  </button>
                </div>
              </div>
            ) : isUpdatingProfile ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-green-300">{t.step5.updatingProfile}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-300 text-lg">
                  {lang === "zh" ? "用户画像已成功更新！" : "User profile successfully updated!"}
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-300">{t.step5.extendedDescription}</h3>
            
            <div className="mt-6">
              <div className="relative h-48 overflow-hidden rounded-lg bg-gradient-to-r from-blue-900/30 to-indigo-900/30 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-500 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="relative z-10 text-center p-4">
                  <h4 className="text-lg font-medium text-blue-300 mb-2">
                    {lang === "zh" ? "链式思考决策过程" : "Chain of Thought Decision Process"}
                  </h4>
                  <p className="text-sm text-gray-300">
                    {lang === "zh" 
                      ? "模拟人类的多步骤推理过程，确保决策的合理性" 
                      : "Simulates human multi-step reasoning process to ensure decision rationality"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-800 rounded border border-gray-600">
              <h4 className="text-lg font-medium text-blue-300 mb-3">
                {lang === "zh" ? "Deepseek-R1决策特点" : "Deepseek-R1 Decision Features"}
              </h4>
              <ul className="space-y-2 list-disc pl-5 text-gray-300">
                <li>
                  {lang === "zh"
                    ? "多因素综合评估，避免单一事件过度影响"
                    : "Multi-factor comprehensive assessment, avoiding excessive influence from a single event"}
                </li>
                <li>
                  {lang === "zh"
                    ? "考虑长期趋势与短期波动，识别真正的用户特征变化"
                    : "Considers long-term trends and short-term fluctuations, identifying true changes in user characteristics"}
                </li>
                <li>
                  {lang === "zh"
                    ? "基于证据强度动态调整更新权重"
                    : "Dynamically adjusts update weights based on evidence strength"}
                </li>
                <li>
                  {lang === "zh"
                    ? "保持用户画像的一致性和连贯性"
                    : "Maintains consistency and coherence of the user profile"}
                </li>
                <li>
                {lang === "zh"
                    ? "透明的决策理由，支持可解释性"
                    : "Transparent decision rationale, supporting explainability"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染第六步 - 个性化干预
  const renderStep6 = () => {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2 text-blue-400">{t.step6.title}</h2>
        <p className="text-gray-300 mb-6">{t.step6.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-pink-300">{t.step6.interventionTitle}</h3>
            
            {!isGeneratingIntervention && !isInterventionReady ? (
              <div className="flex flex-col items-center justify-center h-64">
                <button
                  onClick={generateIntervention}
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  {t.step6.demonstrateIntervention}
                </button>
              </div>
            ) : isGeneratingIntervention ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-pink-300">{t.step6.generatingIntervention}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-green-900/50 text-green-300 rounded mb-4">
                  {t.step6.interventionReady}
                </div>
                
                <div>
                  <p className="text-gray-400 mb-1">{t.step6.userSituation}</p>
                  <p className="text-white">{simulatedIntervention.situation}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 mb-1">{t.step6.emotionalState}</p>
                  <p className="text-white">{simulatedIntervention.emotionalState}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 mb-1">{t.step6.contextFactors}</p>
                  <p className="text-white">{simulatedIntervention.contextFactors}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-3 bg-gray-800 rounded border border-gray-600">
                    <h4 className="text-lg font-medium text-gray-300 mb-2">{t.step6.standardApproach}</h4>
                    <p className="text-white">{simulatedIntervention.standardApproach}</p>
                  </div>
                  
                  <div className="p-3 bg-blue-900/20 rounded border border-blue-800">
                    <h4 className="text-lg font-medium text-blue-300 mb-2">{t.step6.personalizedApproach}</h4>
                    <p className="text-white">{simulatedIntervention.personalizedApproach}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-400 mb-1">{t.step6.effectivenessComparison}</p>
                  <p className="text-white">{simulatedIntervention.effectivenessComparison}</p>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-pink-300 mb-3">{t.step6.interventionComponents}</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-gray-800 rounded">
                      <p className="text-gray-400 mb-1">{t.step6.voiceComponent}</p>
                      <p className="text-white">{simulatedIntervention.components.voice}</p>
                    </div>
                    <div className="p-3 bg-gray-800 rounded">
                      <p className="text-gray-400 mb-1">{t.step6.environmentComponent}</p>
                      <p className="text-white">{simulatedIntervention.components.environment}</p>
                    </div>
                    <div className="p-3 bg-gray-800 rounded">
                      <p className="text-gray-400 mb-1">{t.step6.musicComponent}</p>
                      <p className="text-white">{simulatedIntervention.components.music}</p>
                    </div>
                    <div className="p-3 bg-gray-800 rounded">
                      <p className="text-gray-400 mb-1">{t.step6.navigationComponent}</p>
                      <p className="text-white">{simulatedIntervention.components.navigation}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-900/20 rounded border border-blue-800 mt-6">
                  <p className="text-white">{t.step6.conclusion}</p>
                </div>
                
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => goToStep(1)}
                    className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    {t.step6.backToStart}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-300">{t.step6.extendedDescription}</h3>
            
            <div className="mt-6">
              <div className="relative h-48 overflow-hidden rounded-lg bg-gradient-to-r from-pink-900/30 to-purple-900/30 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-pink-500 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="relative z-10 text-center p-4">
                  <h4 className="text-lg font-medium text-pink-300 mb-2">
                    {lang === "zh" ? "真正懂你的智能伴侣" : "An Intelligent Companion That Truly 'Understands You'"}
                  </h4>
                  <p className="text-sm text-gray-300">
                    {lang === "zh" 
                      ? "通过持续学习，系统能够提供越来越精准的个性化支持" 
                      : "Through continuous learning, the system can provide increasingly precise personalized support"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-800 rounded border border-gray-600">
              <h4 className="text-lg font-medium text-pink-300 mb-3">
                {lang === "zh" ? "个性化干预的关键优势" : "Key Advantages of Personalized Intervention"}
              </h4>
              <ul className="space-y-2 list-disc pl-5 text-gray-300">
                <li>
                  {lang === "zh"
                    ? "更高的干预成功率，减少情绪失控风险" 
                    : "Higher intervention success rate, reducing the risk of emotional loss of control"}
                </li>
                <li>
                  {lang === "zh"
                    ? "用户感受到被理解和重视，增强信任感" 
                    : "Users feel understood and valued, enhancing trust"}
                </li>
                <li>
                  {lang === "zh"
                    ? "多模态干预组合，产生协同效应" 
                    : "Multimodal intervention combinations create synergistic effects"}
                </li>
                <li>
                  {lang === "zh"
                    ? "干预方案随用户特征变化而动态调整" 
                    : "Intervention plans dynamically adjust as user characteristics change"}
                </li>
                <li>
                  {lang === "zh"
                    ? "系统能够预测潜在情绪变化，提前干预" 
                    : "The system can predict potential emotional changes and intervene in advance"}
                </li>
              </ul>
            </div>
            
            <div className="mt-6 p-4 bg-pink-900/20 rounded border border-pink-800">
              <p className="text-white text-center italic">
                {lang === "zh"
                  ? "「在未来的智能车机系统中，不再是简单的标准化解决方案，而是像一个真正懂你的智能伴侣，知道你什么时候需要安静，什么时候需要鼓励，以及如何提供最合适的帮助。」" 
                  : "\"In future intelligent vehicle systems, emotional intervention will no longer be a one-size-fits-all standard solution, but like an old friend who knows you well - knowing when you need quiet, when you need encouragement, and how to provide help in the way that suits you best.\""}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染导航按钮
  const renderNavButtons = () => {
    return (
      <div className="flex justify-between mt-8">
        <button
          onClick={() => goToStep(step - 1)}
          className={`px-4 py-2 rounded ${
            step > 1
              ? "bg-gray-600 text-white hover:bg-gray-700"
              : "bg-gray-800 text-gray-600 cursor-not-allowed"
          }`}
          disabled={step <= 1}
        >
          {t.prev}
        </button>
        
        <Link
          href="/tools"
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          {t.backToTools}
        </Link>
        
        <button
          onClick={() => goToStep(step + 1)}
          className={`px-4 py-2 rounded ${
            step < 6
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-800 text-gray-600 cursor-not-allowed"
          }`}
          disabled={step >= 6}
        >
          {t.next}
        </button>
      </div>
    );
  };

  // 渲染语言切换按钮
  const renderLanguageToggle = () => {
    return (
      <button
        onClick={toggleLanguage}
        className="fixed top-4 right-4 bg-gray-700 text-white px-3 py-1 rounded-full hover:bg-gray-600 transition-colors"
      >
        {lang === "zh" ? "English" : "中文"}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {renderLanguageToggle()}
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 text-blue-400">{t.title}</h1>
          <p className="text-xl text-gray-300">{t.subtitle}</p>
        </div>
        
        {renderStepIndicator()}
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
        {step === 6 && renderStep6()}
        
        {renderNavButtons()}
        {renderDots()}
      </div>
    </div>
  );
}