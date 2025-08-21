import SpeechInput from "./components/SpeechInput";
import Roleplay from "./components/Roleplay";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-blue-100 flex flex-col items-center justify-start p-10">
      {/* App Title */}
      <h1 className="text-4xl font-extrabold mb-10 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-md">
        🎙️ AI Conversation Playground
      </h1>

      {/* Two Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl items-start">
        {/* Left: Normal Chat */}
        <div className="flex justify-center pl-6 self-start">
          <div className="rounded-2xl shadow-xl p-6 border border-gray-200 w-full max-w-md transition-all duration-500">
            <SpeechInput />
          </div>
        </div>

        {/* Right: Roleplay Chat */}
        <div className="flex justify-center pl-6 self-start">
          <div className="rounded-2xl shadow-xl p-6 border border-gray-200 w-full max-w-md transition-all duration-500">
            <Roleplay />
          </div>
        </div>
      </div>
    </main>
  );
}
