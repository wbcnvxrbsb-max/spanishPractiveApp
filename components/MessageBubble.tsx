"use client";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  messageId: string;
  onSpeak?: (text: string, messageId: string) => void;
  isSpeaking?: boolean;
  isCurrentlySpeaking?: boolean;
}

export default function MessageBubble({
  role,
  content,
  messageId,
  onSpeak,
  isSpeaking,
  isCurrentlySpeaking,
}: MessageBubbleProps) {
  const isUser = role === "user";
  const isThisMessageSpeaking = isSpeaking && isCurrentlySpeaking;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-blue-500 text-white rounded-br-md"
            : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>

        {/* Speaker button for assistant messages */}
        {!isUser && onSpeak && (
          <button
            onClick={() => onSpeak(content, messageId)}
            className={`mt-2 p-1.5 rounded-full transition-colors ${
              isThisMessageSpeaking
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            }`}
            title={isThisMessageSpeaking ? "Reproduciendo..." : "Escuchar"}
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
      </div>
    </div>
  );
}
