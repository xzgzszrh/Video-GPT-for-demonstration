import Chat from "../chat";

export const metadata = {
  title: "智能驾驶Copliot - 演示版",
  description: "An experiment to reproduce the gemini staged video for real.",
};

export default function DemoPage() {
  return <Chat isDemo={true} />;
}
