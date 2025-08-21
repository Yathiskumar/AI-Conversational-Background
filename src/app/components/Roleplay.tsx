"use client";
import { useState, useEffect, useRef } from "react";
import useSpeechToText from "@/hooks/useSpeechToText";

type Scenario = "school" | "store" | "home" | null;

export default function Roleplay() {
  const { text, listening, startListening, stopListening } = useSpeechToText();
  const [scenario, setScenario] = useState<Scenario>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [waitingReply, setWaitingReply] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ⛔ Stop any ongoing speech
  const stopSpeaking = () => {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }
  };

  // 🔊 Speak function
  const speak = (msg: string) => {
    stopSpeaking(); // make sure previous speech is stopped
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
    utterance.onend = () => startListening();
  };

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start new roleplay
  const startRoleplay = async (selected: Scenario) => {
    stopSpeaking(); // stop current voice immediately
    setScenario(selected);
    setMessages([]);
    stopListening();

    const systemPrompt =
      selected === "school"
        ? "We are roleplaying at school. You are a teacher, I am a student. Start with a greeting and stay in role."
        : selected === "store"
        ? "We are roleplaying at a store. You are a shopkeeper, I am a customer. Start by offering help and stay in role."
        : "We are roleplaying at home. You are a family member, I am myself. Start casually and stay in role.";

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: systemPrompt }),
    });

    const data = await res.json();
    const aiReply = data.answer;

    setMessages([{ role: "assistant", content: aiReply }]);
    speak(aiReply);
  };

  // AI auto reply when user stops speaking
  useEffect(() => {
    if (!text || !scenario || waitingReply) return;

    const timeout = setTimeout(async () => {
      stopListening();
      setWaitingReply(true);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `(${scenario} roleplay) User said: ${text}. Respond in role.`,
        }),
      });

      const data = await res.json();
      const aiReply = data.answer;

      setMessages((prev) => [
        ...prev,
        { role: "user", content: text },
        { role: "assistant", content: aiReply },
      ]);

      setWaitingReply(false);
      speak(aiReply); // auto-stop handled inside
    }, 1200);

    return () => clearTimeout(timeout);
  }, [text, scenario]);

  return (
    <div className="p-4 flex flex-col gap-4 border rounded-2xl shadow-md w-full max-w-md bg-gradient-to-b from-blue-50 to-purple-50">
      <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent drop-shadow-md">
        🎭 Fun Roleplay Chat
      </h2>

      {/* Scenario Buttons */}
      <div className="flex gap-2 justify-center">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-xl shadow-md"
          onClick={() => startRoleplay("school")}
        >
          🏫 School
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-xl shadow-md"
          onClick={() => startRoleplay("store")}
        >
          🛒 Store
        </button>
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded-xl shadow-md"
          onClick={() => startRoleplay("home")}
        >
          🏠 Home
        </button>
      </div>

      {/* Live Speech */}
      {listening && (
        <p className="text-gray-600 italic text-center">
          🎙️ Listening... <span className="font-semibold">{text}</span>
        </p>
      )}

      {/* Chat Bubbles */}
      <div className="mt-4 rounded-xl p-3 max-h-80 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 mb-2 ${
              m.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center text-white">
                🤖
              </div>
            )}
            <div
              className={`px-3 py-2 rounded-2xl max-w-[70%] text-sm ${
                m.role === "assistant"
                  ? "bg-purple-200 text-black"
                  : "bg-blue-200 text-black"
              }`}
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white">
                👦
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}
