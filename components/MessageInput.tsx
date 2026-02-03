"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Language, t } from "@/lib/translations";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  lang: Language;
}

export default function MessageInput({ onSend, disabled, lang }: MessageInputProps) {
  const [input, setInput] = useState("");
  const {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput((prev) => {
        if (!prev || prev.endsWith(" ")) {
          return prev + transcript;
        }
        return prev + " " + transcript;
      });
    }
  }, [transcript]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
      resetTranscript();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex gap-2 p-4 bg-white border-t border-gray-200">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          isListening
            ? t("recording", lang)
            : t("placeholder", lang)
        }
        disabled={disabled}
        rows={1}
        className={`flex-1 px-4 py-3 border rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm ${
          isListening ? "border-red-400 bg-red-50" : "border-gray-300"
        }`}
        style={{ minHeight: "44px", maxHeight: "120px" }}
      />

      {/* Microphone Button */}
      {isSupported && (
        <button
          onClick={toggleListening}
          disabled={disabled}
          className={`p-3 rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all text-sm ${
            isListening
              ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 animate-pulse"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isListening ? t("recording", lang) : t("pressToRecord", lang)}
        >
          {isListening ? (
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          )}
        </button>
      )}

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
      >
        {t("send", lang)}
      </button>
    </div>
  );
}
