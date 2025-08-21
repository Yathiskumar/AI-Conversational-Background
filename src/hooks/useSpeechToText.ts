import { useState } from "react";

export default function useSpeechToText() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);

  let recognition: any;

  if (typeof window !== "undefined") {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setText(transcript);
    };

    recognition.onend = () => setListening(false);
  }

  const startListening = () => {
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognition.stop();
    setListening(false);
  };

  return { text, listening, startListening, stopListening };
}
