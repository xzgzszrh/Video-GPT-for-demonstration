import Link from "next/link";

export default function ToolsPage() {
  const tools = [
    {
      title: "文字转语音工具",
      description: "使用火山引擎接口将文字转换为语音，支持自定义文件名和下载",
      path: "/tools/tts",
    },
    {
      title: "API状态监控",
      description: "用于监控API接口状态，帮助开发者快速排查API相关问题",
      path: "/tools/api-status",
    },
    // 未来可以在这里添加更多工具
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">开发工具集</h1>
        <Link href="/demo" className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
          返回首页
        </Link>
      </div>
      
      <p className="mb-6 text-gray-300">
        这里提供了各种开发和调试工具，帮助您更高效地进行开发和测试。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {tools.map((tool, index) => (
          <Link href={tool.path} key={index} className="no-underline">
            <div 
              className="h-full border border-gray-700 rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-gray-900"
            >
              <h2 className="text-lg font-semibold mb-2 text-white">{tool.title}</h2>
              <p className="text-gray-400">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
