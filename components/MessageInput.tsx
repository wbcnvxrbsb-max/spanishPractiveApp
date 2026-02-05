"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Language, t } from "@/lib/translations";
import { TargetLanguage } from "@/lib/prompts";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  lang: Language;
  targetLang: TargetLanguage;
}

export default function MessageInput({ onSend, disabled, lang, targetLang }: MessageInputProps) {
  const [input, setInput] = useState("");
  const {
    transcript,
    isListening,
    isSupported,
    isTranscribing,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition(targetLang);

  // When recording stops and we have a transcript, auto-send it
  useEffect(() => {
    if (!isListening && transcript) {
      onSend(transcript);
      resetTranscript();
    }
  }, [isListening, transcript, onSend, resetTranscript]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
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
      resetTranscript();
      startListening();
    }
  };

  // Global Enter key to toggle recording when not typing
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        const activeElement = document.activeElement;
        const isTyping = activeElement?.tagName === "TEXTAREA" || activeElement?.tagName === "INPUT";

        if (!isTyping && !disabled && !isTranscribing && isSupported) {
          e.preventDefault();
          toggleListening();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [disabled, isTranscribing, isSupported, isListening]);

  return (
    <div className="flex items-center gap-2 p-3 bg-white border-t border-gray-200">
      {/* Microphone Button - LEFT */}
      {isSupported && (
        <button
          onClick={toggleListening}
          disabled={disabled || isTranscribing}
          className={`p-3 rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
            isListening
              ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 animate-pulse"
              : isTranscribing
              ? "bg-yellow-500 text-white focus:ring-yellow-500"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-gray-400"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isListening ? t("recording", lang) : t("pressToRecord", lang)}
        >
          {isTranscribing ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : isListening ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          )}
        </button>
      )}

      {/* Text Input - MIDDLE */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          isTranscribing
            ? "Transcribing..."
            : isListening
            ? t("recording", lang)
            : t("placeholder", lang)
        }
        disabled={disabled || isListening || isTranscribing}
        rows={1}
        className={`flex-1 px-4 py-2.5 border rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm ${
          isListening ? "border-red-300 bg-red-50" : isTranscribing ? "border-yellow-300 bg-yellow-50" : "border-gray-300"
        }`}
        style={{ minHeight: "42px", maxHeight: "100px" }}
      />

      {/* Send Button - RIGHT */}
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim() || isListening}
        className="px-3 sm:px-5 py-2.5 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
      >
        <span className="hidden sm:inline">{t("send", lang)}</span>
        <svg className="w-5 h-5 sm:hidden" fill="currentColor" viewBox="0 0 24 24">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
}
