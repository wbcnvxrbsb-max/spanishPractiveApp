"use client";

import { useEffect } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Language, t } from "@/lib/translations";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  onTypingMode: () => void;
  lang: Language;
}

export default function VoiceButton({
  onTranscript,
  disabled,
  onTypingMode,
  lang,
}: VoiceButtonProps) {
  const {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // When recording stops and we have a transcript, send it
  useEffect(() => {
    if (!isListening && transcript) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [isListening, transcript, onTranscript, resetTranscript]);

  const handleClick = () => {
    if (disabled) return;

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white border-t border-gray-200">
        <p className="text-gray-500 text-sm mb-4">
          {t("browserNotSupported", lang)}
        </p>
        <button
          onClick={onTypingMode}
          className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
        >
          {t("useKeyboard", lang)}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white border-t border-gray-200">
      {/* Big Microphone Button */}
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${
          isListening
            ? "bg-red-500 hover:bg-red-600 animate-pulse scale-110"
            : "bg-blue-500 hover:bg-blue-600 hover:scale-105"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isListening ? (
          // Stop icon
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          // Microphone icon
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </button>

      {/* Instruction Text */}
      <p className="mt-4 text-gray-600 text-sm">
        {isListening ? (
          <span className="text-red-500 font-medium">
            {t("recording", lang)}
          </span>
        ) : disabled ? (
          t("waiting", lang)
        ) : (
          t("pressToRecord", lang)
        )}
      </p>

      {/* Live transcript preview */}
      {isListening && transcript && (
        <p className="mt-2 text-blue-600 text-sm italic max-w-xs text-center">
          &ldquo;{transcript}&rdquo;
        </p>
      )}

      {/* Keyboard toggle */}
      <button
        onClick={onTypingMode}
        disabled={disabled || isListening}
        className="mt-4 flex items-center gap-2 text-gray-400 hover:text-gray-600 text-xs transition-colors disabled:opacity-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>{t("switchToKeyboard", lang)}</span>
      </button>
    </div>
  );
}
