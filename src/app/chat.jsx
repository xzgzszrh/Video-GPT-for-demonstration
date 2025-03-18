"use client";

import { useId, useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import useSilenceAwareRecorder from "silence-aware-recorder/react";
import useMediaRecorder from "@wmik/use-media-recorder";
import mergeImages from "merge-images";
import { useLocalStorage } from "../lib/use-local-storage";
import { translations } from "../lib/i18n";
import Image from "next/image";
import Link from "next/link";

// 默认值
const DEFAULT_SETTINGS = {
  interval: 1000,
  imageWidth: 512,
  imageQuality: 0.6,
  columns: 4,
  maxScreenshots: 1,
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

  const response = await fetch("https://tmpfiles.org/api/v1/upload", {
    method: "POST",
    body: formData,
  });

  const { data } = await response.json();

  return data.url.replace("https://tmpfiles.org/", "https://tmpfiles.org/dl/");
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

export default function Chat({ isDemo = false }) {
  const id = useId();
  const maxVolumeRef = useRef(0);
  const minVolumeRef = useRef(-100);
  const [displayDebug, setDisplayDebug] = useState(false);
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
  const [voiceMode, setVoiceMode] = useLocalStorage("voice-mode", "clone");
  const [scene, setScene] = useLocalStorage("scene", "demo");
  const [emotionScore, setEmotionScore] = useState(null);

  // 参数设置状态
  const [settings, setSettings] = useLocalStorage("video-settings", DEFAULT_SETTINGS);

  const isBusy = useRef(false);
  const screenshotsRef = useRef([]);
  const videoRef = useRef();
  const canvasRef = useRef();

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
    audio.startRecording();
    video.startRecording();

    setIsStarted(true);
    setPhase("user: waiting for speech");
  }

  function stopRecording() {
    document.location.reload();
  }

  async function onSpeech(data) {
    if (isBusy.current) return;

    // current state is not available here, so we get token from localstorage
    const token = JSON.parse(localStorage.getItem("ai-token"));

    isBusy.current = true;
    audio.stopRecording();

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
      // 情绪识别请求
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

    // same here
  }

  const { messages, append, reload, isLoading } = useChat({
    id,
    body: {
      id,
      token,
      lang,
      scene,
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

      audio.startRecording();
      isBusy.current = false;

      setPhase("user: waiting for speech");
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

  const lastAssistantMessage = messages
    .filter((it) => it.role === "assistant")
    .pop();

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />
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
              {isLoading && (
                <div className="absolute left-50 top-50 w-8 h-8 ">
                  <div className="w-6 h-6 -mr-3 -mt-3 rounded-full bg-cyan-500 animate-ping" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center p-4 opacity-50 gap-2">
          {isStarted ? (
            <button
              className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50"
              onClick={stopRecording}
            >
              {translations[interfaceLang].stopChat}
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50"
              onClick={startRecording}
            >
              {translations[interfaceLang].startChat}
            </button>
          )}
          <button
            className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50"
            onClick={() => reload()}
          >
            {translations[interfaceLang].regenerate}
          </button>
          <button
            className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50"
            onClick={() => setDisplayDebug((p) => !p)}
          >
            {translations[interfaceLang].debugPanel}
          </button>
          <button
            className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50"
            onClick={() => setDisplayTeamInfo(true)}
          >
            {interfaceLang === 'en' ? 'Team Info' : '制作团队'}
          </button>
        </div>
        <div
          className={`bg-[rgba(20,20,20,0.8)] backdrop-blur-xl p-8 rounded-sm absolute left-0 top-0 bottom-0 transition-all w-[75vw] sm:w-[33vw] ${
            displayDebug ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div
            className="absolute z-10 top-4 right-4 opacity-50 cursor-pointer"
            onClick={() => setDisplayDebug(false)}
          >
            ⛌
          </div>
          <div className="space-y-8 h-full overflow-y-auto pr-4" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
            <div className="space-y-2">
              <div className="font-semibold opacity-50">{translations[interfaceLang].currentStatus}：</div>
              <p>{phase}</p>
            </div>
            <div className="space-y-2">
              <div className="font-semibold opacity-50">{translations[interfaceLang].interfaceLanguage}：</div>
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded-md ${
                    interfaceLang === "zh"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => setInterfaceLang("zh")}
                >
                  {translations[interfaceLang].chinese}
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${
                    interfaceLang === "en"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                  onClick={() => setInterfaceLang("en")}
                >
                  {translations[interfaceLang].english}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold opacity-50">场景选择：</div>
              <select
                className="px-4 py-2 bg-gray-700 rounded-md text-white w-full"
                value={scene}
                onChange={(e) => setScene(e.target.value)}
              >
                <option value="demo">{translations[interfaceLang].demoScene}</option>
                <option value="scene1">{translations[interfaceLang].scene1}</option>
                <option value="scene2">{translations[interfaceLang].scene2}</option>
                <option value="scene3">{translations[interfaceLang].scene3}</option>
              </select>
            </div>
            <div className="space-y-2">
              <div className="font-semibold opacity-50">工具：</div>
              <Link href="/tools">
                <button className="px-4 py-2 bg-gray-700 rounded-md text-white w-full hover:bg-gray-600">
                  {translations[interfaceLang].tools}
                </button>
              </Link>
            </div>
            <div className="space-y-2">
              <div className="font-semibold opacity-50">{translations[interfaceLang].speechResult}：</div>
              <p>{transcription || "--"}</p>
            </div>
            <div className="space-y-2">
              <div className="font-semibold opacity-50">情绪预测：
                <span className="inline-block ml-2 w-4 h-4 rounded-full" style={{ backgroundColor: getEmotionColor(emotionScore) }}></span>
                {emotionScore !== null ? getEmotionEmoji(emotionScore) : ""}
              </div>
              <p>{emotionScore !== null ? emotionScore : "识别失败"}</p>
            </div>
            <div className="space-y-2">
              <div className="font-semibold opacity-50">{translations[interfaceLang].videoCapture}：</div>
              <img
                className="object-contain w-full border border-gray-500"
                alt="视频网格"
                src={imagesGridUrl || transparentPixel}
              />
            </div>
            <div className="space-y-4">
              <div className="font-semibold opacity-50">{translations[interfaceLang].paramSettings}：</div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm opacity-70 mb-1">{translations[interfaceLang].captureInterval}</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-gray-700 rounded-md"
                    value={settings.interval}
                    onChange={(e) =>
                      setSettings({ ...settings, interval: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm opacity-70 mb-1">{translations[interfaceLang].imageWidth}</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-gray-700 rounded-md"
                    value={settings.imageWidth}
                    onChange={(e) =>
                      setSettings({ ...settings, imageWidth: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm opacity-70 mb-1">{translations[interfaceLang].imageQuality}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    className="w-full px-3 py-2 bg-gray-700 rounded-md"
                    value={settings.imageQuality}
                    onChange={(e) =>
                      setSettings({ ...settings, imageQuality: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm opacity-70 mb-1">{translations[interfaceLang].gridColumns}</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-gray-700 rounded-md"
                    value={settings.columns}
                    onChange={(e) =>
                      setSettings({ ...settings, columns: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm opacity-70 mb-1">{translations[interfaceLang].maxScreenshots}</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-gray-700 rounded-md"
                    value={settings.maxScreenshots}
                    onChange={(e) =>
                      setSettings({ ...settings, maxScreenshots: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm opacity-70 mb-1">{translations[interfaceLang].silenceDuration}</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-gray-700 rounded-md"
                    value={settings.silenceDuration}
                    onChange={(e) =>
                      setSettings({ ...settings, silenceDuration: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm opacity-70 mb-1">{translations[interfaceLang].silenceThreshold}</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-gray-700 rounded-md"
                    value={settings.silentThreshold}
                    onChange={(e) =>
                      setSettings({ ...settings, silentThreshold: Number(e.target.value) })
                    }
                  />
                </div>
                <button
                  className="px-4 py-2 bg-blue-500 rounded-md text-white"
                  onClick={() => setSettings(DEFAULT_SETTINGS)}
                >
                  {translations[interfaceLang].resetDefault}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 制作团队弹窗 */}
        {displayTeamInfo && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setDisplayTeamInfo(false)}
            ></div>
            <div className="bg-[rgba(20,20,20,0.8)] backdrop-blur-xl p-8 rounded-lg shadow-lg text-center relative z-10 max-w-md">
              <button 
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={() => setDisplayTeamInfo(false)}
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold text-white mb-4">"灵伴驾途"制作团队</h2>
              <div className="text-lg text-white mb-6">
                <p className="mb-2">马姿含</p>
                <p className="mb-2">王昱硕</p>
              </div>
              <p className="text-white mb-4">西安高新一中实验中学</p>
              <div className="flex justify-center">
                <Image 
                  src="/schoollogo.png" 
                  alt="学校标志" 
                  width={150} 
                  height={150} 
                  className="mx-auto"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}