# 智能驾驶Copilot - 视频通话展示项目

这是一个用于展示的项目，具备与GPT进行视频通话的能力和一系列实用工具，支持多种语音API和语音克隆功能，为智能驾驶场景提供交互式体验。

## 项目概述

本项目是一个基于Next.js开发的Web应用，旨在展示AI视频通话和语音交互能力。它包含一个公开版和一个演示版，支持实时视频通话、语音识别、语音合成和情绪分析等功能。

## 主要功能

### 视频通话

- 实时视频捕获和显示
- 语音识别和转录
- 实时对话和响应
- 情绪分析和可视化

### 语音功能

- **语音识别**：支持百度和OpenAI的语音转文本API
- **语音合成**：支持OpenAI的文本转语音功能
- **语音克隆**：支持使用火山云API进行语音克隆训练

### 工具集

- 语音克隆训练工具
- 文本转语音工具
- 情绪分析工具

### 兼容性

- 兼容FastGPT的chatID机制，支持会话持久化

## 技术架构

- **前端框架**：Next.js 14.0.4, React 18
- **UI设计**：Tailwind CSS
- **API集成**：
  - OpenAI API (语音识别、文本生成)
  - 百度语音API (语音识别)
  - 火山云API (语音克隆)

## 环境变量配置

项目使用以下环境变量进行配置：

### 通用配置
```
PASSWORD=your_password  # 用于身份验证
```

### 聊天API配置
```
CHAT_API_KEY_DEMO=your_api_key  # 演示版API密钥
CHAT_API_KEY_SCENE1=your_api_key  # 场景1 API密钥
CHAT_API_KEY_SCENE2=your_api_key  # 场景2 API密钥
CHAT_API_KEY_SCENE3=your_api_key  # 场景3 API密钥
CHAT_API_BASE_URL=your_api_base_url  # 自定义API基础URL
```

### 语音识别配置
```
# 语音识别提供商选择 (openai 或 baidu)
STT_PROVIDER=openai

# OpenAI语音识别配置
STT_API_KEY=your_api_key
STT_API_BASE_URL=your_api_base_url

# 百度语音识别配置
BAIDU_VOICE_APP_ID=your_app_id
BAIDU_VOICE_API_KEY=your_api_key
BAIDU_VOICE_SECRET_KEY=your_secret_key
```

### 文本转语音配置
```
# 文本转语音提供商选择 (openai 或 volcano)
TTS_PROVIDER=volcano

# OpenAI文本转语音配置
OPENAI_TTS_API_KEY=your_api_key
OPENAI_TTS_BASE_URL=your_api_base_url

# 火山云文本转语音配置
VOLCANO_APP_ID=your_app_id
VOLCANO_TOKEN=your_token
VOLCANO_CLUSTER=your_cluster
VOLCANO_VOICE_TYPE=your_voice_type
```

### 情绪分析配置
```
EMOTION_API_KEY=your_api_key
EMOTION_API_BASE_URL=your_api_base_url
```

## 安装与运行

1. 克隆项目
```bash
git clone <repository-url>
cd gpt-video-main-gxsy
```

2. 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑.env文件，填入所需的API密钥和配置
```

4. 运行开发服务器
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

5. 构建生产版本
```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

6. 启动生产服务器
```bash
npm run start
# 或
yarn start
# 或
pnpm start
```

## 使用指南

### 公开版
访问根路径 `/` 进入公开版界面，可以进行基本的视频通话交互。

### 演示版
访问 `/demo` 路径进入演示版界面，提供更多功能和交互选项。

### 语音克隆工具
访问 `/tools/voice-clone` 路径使用语音克隆训练工具，可以上传音频样本进行语音克隆训练。

## 注意事项

- 本项目仅用于展示目的，请确保在使用过程中遵守相关API的使用条款。
- 使用前请确保已正确配置所有必要的环境变量。
- 视频和音频数据仅在本地处理，不会永久存储。

## 许可证

[MIT](LICENSE)