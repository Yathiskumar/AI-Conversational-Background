"use client";
import { useState } from "react";
import SpeechInput from "./components/SpeechInput";
import Roleplay from "./components/Roleplay";

export default function Home() {
  const [selectedLang, setSelectedLang] = useState("en"); // default English
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const options = [
    { value: "en", label: "English", color: "text-blue-500" },
    { value: "hi", label: "Hindi", color: "text-red-500" },
  ];

  const selectedOption = options.find((opt) => opt.value === selectedLang) ?? options[0];

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-blue-100 flex flex-col items-center justify-start p-10">
      {/* App Title */}
      <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-md">
        🎙️ AI Conversation Playground
      </h1>

      {/* Language Selector */}
      <div className="mb-8 flex flex-col gap-2 w-48 relative">
        <label className="font-semibold text-gray-700 flex items-center gap-2">
          🌐 Language:
        </label>

        <div className="relative">
          <button
            className={`w-full px-3 py-2 border rounded-xl shadow-sm text-left focus:ring-2 focus:ring-indigo-400 ${selectedOption.color} flex justify-between items-center`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedOption.label}
            <span className={`ml-2 transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`}>
              ▼
            </span>
          </button>

          {dropdownOpen && (
            <ul className="absolute mt-1 w-full bg-white border rounded-xl shadow-lg overflow-hidden z-10">
              {options.map((opt) => (
                <li
                  key={opt.value}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${opt.color}`}
                  onClick={() => {
                    setSelectedLang(opt.value);
                    setDropdownOpen(false);
                  }}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Two Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl items-start">
        {/* Left: Normal Chat */}
        <div className="flex justify-center pl-6 self-start">
          <div className="rounded-2xl shadow-xl p-6 border border-gray-200 w-full max-w-md transition-all duration-500">
            <SpeechInput selectedLang={selectedLang} />
          </div>
        </div>

        {/* Right: Roleplay Chat */}
        <div className="flex justify-center pl-6 self-start">
          <div className="rounded-2xl shadow-xl p-6 border border-gray-200 w-full max-w-md transition-all duration-500">
            <Roleplay selectedLang={selectedLang} />
          </div>
        </div>
      </div>
    </main>
  );
}
