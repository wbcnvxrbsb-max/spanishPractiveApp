"use client";

import { useState } from "react";
import { Language, t } from "@/lib/translations";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  messageId: string;
  onSpeak?: (text: string, messageId: string) => void;
  isSpeaking?: boolean;
  isCurrentlySpeaking?: boolean;
  lang: Language;
  hideText?: boolean;
}

export default function MessageBubble({
  role,
  content,
  messageId,
  onSpeak,
  isSpeaking,
  isCurrentlySpeaking,
  lang,
  hideText = false,
}: MessageBubbleProps) {
  const isUser = role === "user";
  const isThisMessageSpeaking = isSpeaking && isCurrentlySpeaking;
  const [translation, setTranslation] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showText, setShowText] = useState(!hideText);

  const handleTranslate = async () => {
    if (translation) {
      // Toggle translation visibility
      setTranslation(null);
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content, targetLang: lang }),
      });
      const data = await response.json();
      if (data.translation) {
        setTranslation(data.translation);
        setShowText(true); // Show text when translation is requested
      }
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const TranslateButton = () => (
    <button
      onClick={handleTranslate}
      disabled={isTranslating}
      className={`p-2 rounded-full transition-colors self-center ${
        translation
          ? "bg-green-100 text-green-600"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
      } disabled:opacity-50`}
      title={isTranslating ? t("translating", lang) : t("translate", lang)}
    >
      {isTranslating ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
        </svg>
      )}
    </button>
  );

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {/* Translate button on LEFT for user messages */}
      {isUser && <TranslateButton />}

      {/* Speaker button on LEFT for assistant messages */}
      {!isUser && onSpeak && (
        <button
          onClick={() => onSpeak(content, messageId)}
          className={`mr-2 p-2 rounded-full transition-colors self-center ${
            isThisMessageSpeaking
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
          }`}
          title={isThisMessageSpeaking ? "Playing..." : "Listen"}
        >
          {isThisMessageSpeaking ? (
            <svg
              className="w-4 h-4 animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
          )}
        </button>
      )}

      {/* Message bubble */}
      <div
        className={`max-w-[85%] sm:max-w-[75%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl ${
          isUser
            ? "bg-blue-500 text-white rounded-br-md"
            : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100"
        }`}
        onMouseEnter={() => hideText && setShowText(true)}
        onMouseLeave={() => hideText && !translation && setShowText(false)}
      >
        {showText || translation ? (
          <>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
            {translation && (
              <p className={`text-sm leading-relaxed whitespace-pre-wrap mt-2 pt-2 border-t ${
                isUser ? "border-blue-400 text-blue-100" : "border-gray-200 text-gray-500 italic"
              }`}>
                {translation}
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-400 italic">
            {isUser ? "..." : "🔊 ..."}
          </p>
        )}
      </div>

      {/* Translate button on RIGHT for assistant messages */}
      {!isUser && <TranslateButton />}
    </div>
  );
}
