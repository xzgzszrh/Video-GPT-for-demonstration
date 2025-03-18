"use client";

import { useId, useEffect, useRef, useState, useCallback } from "react";
import { useChat } from "ai/react";
import useSilenceAwareRecorder from "silence-aware-recorder/react";
import useMediaRecorder from "@wmik/use-media-recorder";
import Image from "next/image";
import { useLocalStorage } from "../lib/use-local-storage";
import { translations } from "../lib/i18n";
import OnboardingModal from "./components/OnboardingModal";
import mergeImages from "merge-images";

// 图标组件
// 语音图标
const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
    <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/>
  </svg>
);

// 停止图标
const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/>
  </svg>
);

// 刷新图标
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
    <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
  </svg>
);

// 团队图标
const TeamIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
  </svg>
);

// 设置图标
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
  </svg>
);

// 文本图标
const TextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
  </svg>
);

// 语音模式图标
const VoiceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z"/>
  </svg>
);

// 默认值 - 公开版修改了截图间隔和最大截图数量
const DEFAULT_SETTINGS = {
  interval: 500, // 修改为500ms
  imageWidth: 512,
  imageQuality: 0.6,
  columns: 4,
  maxScreenshots: 20, // 修改为20
  silenceDuration: 2500,
  silentThreshold: -30,
};

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
};

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

const transparentPixel =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/2lXzAAAACV0RVh0ZGF0ZTpjcmVhdGU9MjAyMy0xMC0xOFQxNTo0MDozMCswMDowMEfahTAAAAAldEVYdGRhdGU6bW9kaWZ5PTIwMjMtMTAtMThUMTU6NDA6MzArMDA6MDBa8cKfAAAAAElFTkSuQmCC";

// A function that plays an audio from a url and reutnrs a promise that resolves when the audio ends
function playAudio(url) {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.onended = resolve;
    audio.play();
  });
}

async function getImageDimensions(src) {
  return new Promise((resolve, reject) => {
    const img = new globalThis.Image();

    img.onload = function () {
      resolve({
        width: this.width,
        height: this.height,
      });
    };

    img.onerror = function () {
      reject(new Error("Failed to load image."));
    };

    img.src = src;
  });
}

function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

async function uploadImageToFreeImageHost(base64Image) {
  const blob = base64ToBlob(base64Image, "image/jpeg");
  const formData = new FormData();
  formData.append("file", blob, "image.jpg");

  try {
    const response = await fetch("https://tmpfiles.org/api/v1/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("Upload failed:", response.status, response.statusText);
      return null; // 返回null而不是抛出错误，这样可以继续执行
    }

    const { data } = await response.json();
    return data.url.replace("https://tmpfiles.org/", "https://tmpfiles.org/dl/");
  } catch (error) {
    console.error("Error uploading image:", error);
    return null; // 出错时返回null
  }
}

async function imagesGrid({
  base64Images,
  columns = 4,
  gridImageWidth = 512,
  quality = 0.6,
}) {
  if (!base64Images.length) {
    return transparentPixel;
  }

  const dimensions = await getImageDimensions(base64Images[0]);

  // Calculate the aspect ratio of the first image
  const aspectRatio = dimensions.width / dimensions.height;

  const gridImageHeight = gridImageWidth / aspectRatio;

  const rows = Math.ceil(base64Images.length / columns); // Number of rows

  // Prepare the images for merging
  const imagesWithCoordinates = base64Images.map((src, index) => ({
    src,
    x: (index % columns) * gridImageWidth,
    y: Math.floor(index / columns) * gridImageHeight,
  }));

  // Merge images into a single base64 string
  return await mergeImages(imagesWithCoordinates, {
    format: "image/jpeg",
    quality,
    width: columns * gridImageWidth,
    height: rows * gridImageHeight,
  });
}

export default function PublicChat() {
  // 添加样式
  const tooltipStyles = `
    .tooltip-container {
      position: relative;
    }
    .tooltip {
      visibility: hidden;
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 10;
      opacity: 0;
      transition: opacity 0.2s, visibility 0.2s;
    }
    .tooltip-container:hover .tooltip {
      visibility: visible;
      opacity: 1;
    }
  `;

  const id = useId();
  const maxVolumeRef = useRef(0);
  const minVolumeRef = useRef(-100);
  const [displayTeamInfo, setDisplayTeamInfo] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [phase, setPhase] = useState("not inited");
  const [transcription, setTranscription] = useState("");
  const [imagesGridUrl, setImagesGridUrl] = useState(null);
  const [currentVolume, setCurrentVolume] = useState(-50);
  const [volumePercentage, setVolumePercentage] = useState(0);
  const [token, setToken] = useLocalStorage("ai-token", "");
  const [lang, setLang] = useLocalStorage("lang", "zh");
  const [interfaceLang, setInterfaceLang] = useLocalStorage("interface-lang", "zh");
  // 每次打开都显示引导模态框，而不是只有首次使用时
  const [showOnboarding, setShowOnboarding] = useState(true);
  // 从localStorage获取chatId和useChatId设置
  const [chatId] = useLocalStorage("chat-id", "");
  const [useChatId] = useLocalStorage("use-chat-id", true);
  // 文本输入相关状态
  const [textInput, setTextInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false); // 是否显示文本输入弹窗
  const [inputMode, setInputMode] = useState("voice"); // 输入模式：voice或text
  // 默认使用克隆模式
  const voiceMode = "clone";
  // 默认使用场景三
  const scene = "scene3";
  const [emotionScore, setEmotionScore] = useState(null);

  // 使用固定的设置
  const settings = DEFAULT_SETTINGS;

  const isBusy = useRef(false);
  const screenshotsRef = useRef([]);
  const videoRef = useRef();
  const canvasRef = useRef();

  // 在组件顶部添加一个状态来跟踪加载状态
  const [isLoading, setIsLoading] = useState(false);
  const [mediaInitialized, setMediaInitialized] = useState(false); // 新增状态来跟踪媒体设备初始化状态

  const audio = useSilenceAwareRecorder({
    onDataAvailable: onSpeech,
    onVolumeChange: setCurrentVolume,
    silenceDuration: settings.silenceDuration,
    silentThreshold: settings.silentThreshold,
    minDecibels: -100,
  });

  let { liveStream, ...video } = useMediaRecorder({
    recordScreen: false,
    blobOptions: { type: "video/webm" },
    mediaStreamConstraints: { audio: false, video: true },
  });

  function startRecording() {
    // 确保在开始新的录音前，重置所有状态
    try {
      // 先停止正在录制的语音和视频
      if (audio.isRecording) {
        audio.stopRecording();
      }
      if (video.status === "recording") {
        video.stopRecording();
      }
      
      // 等待300毫秒后再开始录音
      setTimeout(() => {
        audio.startRecording();
        video.startRecording();
        
        setIsStarted(true);
        setPhase("user: waiting for speech");
        isBusy.current = false; // 重置忙碌状态，确保可以接收新的输入
        screenshotsRef.current = []; // 清空之前的截图
      }, 300);
    } catch (error) {
      console.error("启动录音时出错:", error);
      alert(interfaceLang === 'en' ? 'Error starting recording. Please refresh the page.' : '启动录音时出错，请刷新页面。');
    }
  }

  function stopRecording() {
    // 停止录音和视频录制，而不是重新加载页面
    try {
      audio.stopRecording();
      video.stopRecording();
      setIsStarted(false);
      setPhase("not inited");
      // 不要在这里设置isBusy.current = false，因为可能正在处理最后的对话
    } catch (error) {
      console.error("停止录音时出错:", error);
      isBusy.current = false; // 出错时重置忙碌状态
    }
  }

  async function onSpeech(data) {
    if (isBusy.current) return;

    // current state is not available here, so we get token from localstorage
    const token = JSON.parse(localStorage.getItem("ai-token"));

    isBusy.current = true;
    setIsLoading(true); // 设置isLoading状态为true
    audio.stopRecording();

    try {
      setPhase("user: processing speech to text");

      const speechtotextFormData = new FormData();
      speechtotextFormData.append("file", data, "audio.webm");
      speechtotextFormData.append("token", token);
      speechtotextFormData.append("lang", lang);

      const speechtotextResponse = await fetch("/api/speechtotext", {
        method: "POST",
        body: speechtotextFormData,
      });

      const { text, error } = await speechtotextResponse.json();

      if (error) {
        alert(error);
        isBusy.current = false;
        setIsLoading(false);
        // 如果正在录音，则继续录音
        if (inputMode === "voice" && isStarted) {
          audio.startRecording();
          setPhase("user: waiting for speech");
        }
        return;
      }

      setTranscription(text);

      setPhase("user: uploading video captures");

      // Keep only the last XXX screenshots
      screenshotsRef.current = screenshotsRef.current.slice(-settings.maxScreenshots);

      const imageUrl = await imagesGrid({
        base64Images: screenshotsRef.current,
        columns: settings.columns,
        gridImageWidth: settings.imageWidth,
        quality: settings.imageQuality,
      });

      screenshotsRef.current = [];

      const uploadUrl = await uploadImageToFreeImageHost(imageUrl);

      setImagesGridUrl(imageUrl);

      setPhase("user: 处理情绪识别和聊天");
      
      // 并行处理情绪识别和聊天请求
      const [emotionPromise, chatPromise] = await Promise.all([
        // 情绪识别
        fetch("/api/emotion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            image_url: uploadUrl,
            token,
          }),
        }).then(res => res.json())
        .catch(error => {
          console.error("情绪识别失败:", error);
          return { score: null };
        }),
        
        // 聊天请求
        append({
          role: "user",
          content: [
            { type: "text", text: text },
            {
              type: "image_url",
              image_url: {
                url: uploadUrl,
              },
            },
          ],
        })
      ]);

      // 处理情绪识别结果
      setEmotionScore(emotionPromise.score);

      setPhase("user: processing completion");

      await chatPromise;

      setPhase("assistant: processing text to speech");

      isBusy.current = false;
      setIsLoading(false); // 设置isLoading状态为false
    } catch (error) {
      console.error("Speech processing error:", error);
      isBusy.current = false;
      setIsLoading(false); // 设置isLoading状态为false
      // 如果正在录音，则继续录音
      if (inputMode === "voice" && isStarted) {
        audio.startRecording();
        setPhase("user: waiting for speech");
      }
    }
  }

  async function handleTextSubmit(text) {
    if (isBusy.current || !text.trim()) return;

    isBusy.current = true;
    setIsLoading(true); // 设置isLoading状态为true
    setPhase("user: processing text input");

    // 获取当前屏幕截图
    let currentScreenshot = [];
    if (videoRef.current && canvasRef.current) {
      const videoNode = videoRef.current;
      const canvasNode = canvasRef.current;
      const targetWidth = settings.imageWidth;

      const context = canvasNode.getContext("2d");
      const originalWidth = videoNode.videoWidth;
      const originalHeight = videoNode.videoHeight;
      const aspectRatio = originalHeight / originalWidth;

      // 设置画布尺寸
      canvasNode.width = targetWidth;
      canvasNode.height = targetWidth * aspectRatio;

      context.drawImage(
        videoNode,
        0,
        0,
        canvasNode.width,
        canvasNode.height
      );
      
      // 压缩并转换为JPEG格式
      const quality = settings.imageQuality;
      const base64Image = canvasNode.toDataURL("image/jpeg", quality);

      if (base64Image !== "data:,") {
        currentScreenshot.push(base64Image);
      }
    }

    // 如果没有截图，使用透明像素
    if (currentScreenshot.length === 0) {
      currentScreenshot.push(transparentPixel);
    }

    // 创建图片网格
    const imageUrl = await imagesGrid({
      base64Images: currentScreenshot,
      columns: 1,
      gridImageWidth: settings.imageWidth,
      quality: settings.imageQuality,
    });

    const uploadUrl = await uploadImageToFreeImageHost(imageUrl);
    setImagesGridUrl(imageUrl);

    setPhase("user: 处理情绪识别和聊天");
    
    // 并行处理情绪识别和聊天请求
    const [emotionPromise, chatPromise] = await Promise.all([
      // 情绪识别
      fetch("/api/emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          image_url: uploadUrl,
          token: JSON.parse(localStorage.getItem("ai-token")),
        }),
      }).then(res => res.json())
      .catch(error => {
        console.error("情绪识别失败:", error);
        return { score: null };
      }),
      
      // 聊天请求
      append({
        role: "user",
        content: [
          { type: "text", text },
          {
            type: "image_url",
            image_url: {
              url: uploadUrl,
            },
          },
        ],
      })
    ]);

    // 处理情绪识别结果
    setEmotionScore(emotionPromise.score);

    setPhase("user: processing completion");

    await chatPromise;

    setPhase("assistant: processing text to speech");

    isBusy.current = false;
    setIsLoading(false); // 设置isLoading状态为false
  }

  const { messages, append, reload, isLoading: isLoadingChat } = useChat({
    id: useChatId ? chatId : id, // 根据useChatId设置决定使用chatId还是id
    body: {
      id: useChatId ? chatId : id, // 根据useChatId设置决定使用chatId还是id
      token,
      lang,
      scene,
      chatId: useChatId ? chatId : undefined, // 根据useChatId设置决定是否传递chatId
    },
    async onFinish(message) {
      setPhase("assistant: processing text to speech");

      // same here
      const token = JSON.parse(localStorage.getItem("ai-token"));

      const texttospeechFormData = new FormData();
      texttospeechFormData.append("input", message.content);
      texttospeechFormData.append("token", token);
      texttospeechFormData.append("mode", voiceMode);

      const response = await fetch("/api/texttospeech", {
        method: "POST",
        body: texttospeechFormData,
      });

      setPhase("assistant: playing audio");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      await playAudio(url);

      // 如果正在录音，则继续录音
      if (isStarted) {
        audio.startRecording();
        setPhase("user: waiting for speech");
      } else {
        setPhase("not inited");
      }
      
      isBusy.current = false;
    },
  });

  useEffect(() => {
    if (videoRef.current && liveStream && !videoRef.current.srcObject) {
      videoRef.current.srcObject = liveStream;
    }
  }, [liveStream]);

  useEffect(() => {
    const captureFrame = () => {
      if (video.status === "recording" && audio.isRecording) {
        const targetWidth = settings.imageWidth;

        const videoNode = videoRef.current;
        const canvasNode = canvasRef.current;

        if (videoNode && canvasNode) {
          const context = canvasNode.getContext("2d");
          const originalWidth = videoNode.videoWidth;
          const originalHeight = videoNode.videoHeight;
          const aspectRatio = originalHeight / originalWidth;

          // Set new width while maintaining aspect ratio
          canvasNode.width = targetWidth;
          canvasNode.height = targetWidth * aspectRatio;

          context.drawImage(
            videoNode,
            0,
            0,
            canvasNode.width,
            canvasNode.height
          );
          // Compress and convert image to JPEG format
          const quality = settings.imageQuality;
          const base64Image = canvasNode.toDataURL("image/jpeg", quality);

          if (base64Image !== "data:,") {
            screenshotsRef.current.push(base64Image);
          }
        }
      }
    };

    const intervalId = setInterval(captureFrame, settings.interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [video.status, audio.isRecording, settings.interval]);

  useEffect(() => {
    if (!audio.isRecording) {
      setVolumePercentage(0);
      return;
    }

    if (typeof currentVolume === "number" && isFinite(currentVolume)) {
      if (currentVolume > maxVolumeRef.current)
        maxVolumeRef.current = currentVolume;
      if (currentVolume < minVolumeRef.current)
        minVolumeRef.current = currentVolume;

      if (maxVolumeRef.current !== minVolumeRef.current) {
        setVolumePercentage(
          (currentVolume - minVolumeRef.current) /
            (maxVolumeRef.current - minVolumeRef.current)
        );
      }
    }
  }, [currentVolume, audio.isRecording]);

  useEffect(() => {
    // 检查是否是首次访问
    if (!showOnboarding) {
      // 如果不是首次访问，自动请求摄像头和麦克风权限
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            // 获取权限后立即停止流，因为我们只是想要请求权限
            stream.getTracks().forEach((track) => track.stop());
          })
          .catch((error) => {
            console.error("访问媒体设备时出错:", error);
          });
      }
    }
  }, [showOnboarding]);

  useEffect(() => {
    // u521du59cbu5316u5a92u4f53u8bbeu5907
    if (!mediaInitialized && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setMediaInitialized(true);
          console.log("u5a92u4f53u8bbeu5907u521du59cbu5316u6210u529f");
          // u83b7u53d6u6743u9650u540eu7acbu5373u505cu6b62u6d41uff0cu56e0u4e3au6211u4eec
          // u53eau662fu60f3u8981u8bf7u6c42u6743u9650uff0cu5b9eu9645u5f55u5236u5c06u7531useMediaRecorderu5904u7406
          stream.getTracks().forEach((track) => track.stop());
        })
        .catch((error) => {
          console.error("u8bbfu95eeu5a92u4f53u8bbeu5907u65f6u51fau9519:", error);
        });
    }
  }, [mediaInitialized]);

  // 重置对话函数
  const resetChat = useCallback(() => {
    try {
      // 停止任何正在进行的录音
      if (audio.isRecording) {
        audio.stopRecording();
      }
      if (video.status === "recording") {
        video.stopRecording();
      }
      
      // 重置状态
      setIsStarted(false);
      setPhase("not inited");
      isBusy.current = false;
      setIsLoading(false);
      screenshotsRef.current = [];
      
      // 重新加载对话
      reload();
      
      // 短暂延迟后重新开始录音
      setTimeout(() => {
        startRecording();
      }, 500);
    } catch (error) {
      console.error("重置对话时出错:", error);
      alert(interfaceLang === 'en' ? 'Error resetting chat. Please refresh the page.' : '重置对话时出错，请刷新页面。');
    }
  }, [audio, video, reload, startRecording]);

  const lastAssistantMessage = messages
    .filter((it) => it.role === "assistant")
    .pop();

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
        interfaceLang={interfaceLang} 
        setInterfaceLang={setInterfaceLang} 
      />
      <div className="antialiased w-screen h-screen p-4 flex flex-col justify-center items-center bg-black">
        <div className="w-full h-full sm:container sm:h-auto grid grid-rows-[auto_1fr] grid-cols-[1fr] sm:grid-cols-[2fr_1fr] sm:grid-rows-[1fr] justify-content-center bg-black">
          <div className="relative">
            <video
              ref={videoRef}
              className="h-auto w-full aspect-[4/3] object-cover rounded-[1rem] bg-gray-900"
              autoPlay
            />
            {audio.isRecording ? (
              <div className="w-16 h-16 absolute bottom-4 left-4 flex justify-center items-center">
                <div
                  className="w-16 h-16 bg-red-500 opacity-50 rounded-full"
                  style={{
                    transform: `scale(${Math.pow(volumePercentage, 4).toFixed(
                      4
                    )})`,
                  }}
                ></div>
              </div>
            ) : (
              <div className="w-16 h-16 absolute bottom-4 left-4 flex justify-center items-center cursor-pointer">
                <div className="text-5xl text-red-500 opacity-50">⏸</div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-start justify-start p-12 text-md leading-relaxed relative">
            <div className="text-left mb-4 w-full">
              <h1 className="text-base font-normal text-blue-400">{translations[interfaceLang].title}</h1>
              <h2 className="text-4xl text-white font-bold mt-2">{translations[interfaceLang].subtitle}</h2>
              {/* 情绪预测显示 */}
              {emotionScore !== null && (
                <div className="mt-2 flex items-center">
                  <span className="text-base font-normal text-gray-300">{interfaceLang === 'en' ? 'Emotion Prediction:' : '情绪预测：'}</span>
                  <span className="inline-block ml-2 w-4 h-4 rounded-full" style={{ backgroundColor: getEmotionColor(emotionScore) }}></span>
                  <span className="ml-2 text-xl">{getEmotionEmoji(emotionScore)}</span>
                </div>
              )}
            </div>
            <div className="flex-grow flex items-center justify-center w-full">
              <div className="text-xl lg:text-2xl text-white leading-relaxed">
                {lastAssistantMessage?.content}
              </div>
              {(isLoading || isLoadingChat) && (
                <div className="absolute left-50 top-50 w-8 h-8 ">
                  <div className="w-6 h-6 -mr-3 -mt-3 rounded-full bg-cyan-500 animate-ping" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full max-w-[640px] mx-auto">
          {/* 控制按钮区域靠左对齐 */}
          <div className="flex flex-wrap p-4 gap-2 justify-start">
            {/* 语音模式按钮 */}
            <button
              className="p-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none shadow-md tooltip-container"
              onClick={() => setInputMode(inputMode === "voice" ? "text" : "voice")}
              title={interfaceLang === 'en' 
                ? (inputMode === "voice" ? 'Text Mode' : 'Voice Mode')
                : (inputMode === "voice" ? '文本模式' : '语音模式')}
            >
              {inputMode === "voice" ? <TextIcon /> : <VoiceIcon />}
              <span className="tooltip">
                {interfaceLang === 'en' 
                  ? (inputMode === "voice" ? 'Text Mode' : 'Voice Mode')
                  : (inputMode === "voice" ? '文本模式' : '语音模式')}
              </span>
            </button>
            
            {/* 开始/停止按钮 */}
            {inputMode === "voice" && (
              <button
                className={`p-3 ${isStarted ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md transition-colors focus:outline-none shadow-md tooltip-container`}
                onClick={isStarted ? stopRecording : startRecording}
                title={isStarted ? translations[interfaceLang].stopChat : translations[interfaceLang].startChat}
              >
                {isStarted ? <StopIcon /> : <MicIcon />}
                <span className="tooltip">{isStarted ? translations[interfaceLang].stopChat : translations[interfaceLang].startChat}</span>
              </button>
            )}
            
            {/* 刷新按钮 */}
            <button
              className="p-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none shadow-md tooltip-container"
              onClick={() => reload()}
              title={translations[interfaceLang].regenerate}
            >
              <RefreshIcon />
              <span className="tooltip">{translations[interfaceLang].regenerate}</span>
            </button>
            
            <button
              className="p-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none shadow-md tooltip-container"
              onClick={() => setDisplayTeamInfo(true)}
              title={interfaceLang === 'en' ? 'Team Info' : '团队信息'}
            >
              <TeamIcon />
              <span className="tooltip">{interfaceLang === 'en' ? 'Team Info' : '团队信息'}</span>
            </button>
            
            <button
              className="p-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none shadow-md tooltip-container"
              onClick={() => setShowOnboarding(true)}
              title={interfaceLang === 'en' ? 'Settings' : '设置'}
            >
              <SettingsIcon />
              <span className="tooltip">{interfaceLang === 'en' ? 'Settings' : '设置'}</span>
            </button>
            
            <button
              className="p-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none shadow-md tooltip-container"
              onClick={() => resetChat()}
              title={interfaceLang === 'en' ? 'Reset Chat' : '重置对话'}
            >
              <RefreshIcon />
              <span className="tooltip">{interfaceLang === 'en' ? 'Reset Chat' : '重置对话'}</span>
            </button>
          </div>

          {/* 文本输入框 */}
          {inputMode === "text" && (
            <div className="flex w-full mx-auto mb-4 bg-[#1e2030] rounded-md overflow-hidden">
              <input
                type="text"
                className="flex-grow px-4 py-3 bg-transparent text-white text-lg focus:outline-none"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={interfaceLang === 'en' ? 'Type your message here...' : '在此输入消息...'}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleTextSubmit(textInput);
                    setTextInput("");
                  }
                }}
              />
              <button
                className="px-5 py-3 bg-blue-600 text-white text-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none flex items-center justify-center min-w-[60px]"
                onClick={() => {
                  handleTextSubmit(textInput);
                  setTextInput("");
                }}
                disabled={isBusy.current || !textInput.trim()}
              >
                {isBusy.current ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{tooltipStyles}</style>
    </>
  );
}
