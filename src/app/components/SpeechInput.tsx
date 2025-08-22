"use client";
import { useState, useEffect, useRef } from "react";
import useSpeechToText from "@/hooks/useSpeechToText";

export default function SpeechInput({ selectedLang }: { selectedLang: string }) {
  const { text, listening, startListening, stopListening } = useSpeechToText();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [waitingReply, setWaitingReply] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // stop ongoing speech
  const stopSpeaking = () => {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }
  };

  // language configuration
  const getLangConfig = () => {
    switch (selectedLang) {
      case "hi": return { voice: "hi-IN", prompt: "Respond only in Hindi." };
      default:   return { voice: "en-US", prompt: "Respond only in English." };
    }
  };

  // speak helper
  const speak = (msg: string, lang: string) => {
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.lang = lang;
    utterance.pitch = 1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
    utterance.onend = () => startListening();
  };

  // autoscroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // start chat
  const startChat = async () => {
    stopSpeaking();
    setChatStarted(true);
    stopListening();

    const { voice, prompt } = getLangConfig();
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: `You are a casual AI friend. ${prompt}` }),
    });

    const data = await res.json();
    const aiReply = data.answer;

    setMessages([{ role: "assistant", content: aiReply }]);
    speak(aiReply, voice);
  };

  // reset chat
  const resetChat = () => {
    stopSpeaking();
    stopListening();
    setMessages([]);
    setChatStarted(false);
    setWaitingReply(false);
  };

  // auto reply
  useEffect(() => {
    if (!text || !chatStarted || waitingReply) return;

    const timeout = setTimeout(async () => {
      stopListening();
      setWaitingReply(true);
      const { voice, prompt } = getLangConfig();

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: `(${prompt}) User said: ${text}` }),
      });

      const data = await res.json();
      const aiReply = data.answer;

      setMessages((prev) => [...prev, { role: "user", content: text }, { role: "assistant", content: aiReply }]);
      setWaitingReply(false);
      speak(aiReply, voice);
    }, 1200);

    return () => clearTimeout(timeout);
  }, [text, chatStarted, selectedLang]);

  return (
    <div className="p-4 flex flex-col gap-4 border rounded-2xl shadow-md w-full max-w-md bg-gradient-to-b from-green-50 to-blue-50">
      <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-md">
        💬 Normal Chat
      </h2>

      {!chatStarted ? (
        <button className="px-4 py-2 rounded-xl bg-blue-500 text-white w-full shadow-md" onClick={startChat}>
          Start Chat 🎙️
        </button>
      ) : (
        <>
          {listening && <p className="text-gray-600 italic text-center">🎤 Listening... <span className="font-semibold">{text}</span></p>}
          <div className="mt-4 bg-white rounded-xl p-3 max-h-80 overflow-y-auto shadow-inner">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-start gap-2 mb-2 ${m.role === "assistant" ? "justify-start" : "justify-end"}`}>
                {m.role === "assistant" && <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center text-white">🤖</div>}
                <div className={`px-3 py-2 rounded-2xl max-w-[70%] text-sm ${m.role === "assistant" ? "bg-purple-200 text-black" : "bg-blue-200 text-black"}`}>
                  {m.content}
                </div>
                {m.role === "user" && <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white">👦</div>}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <button className="mt-3 px-4 py-2 rounded-xl bg-red-500 text-white shadow-md" onClick={resetChat}>🔄 Reset Chat</button>
        </>
      )}
    </div>
  );
}
