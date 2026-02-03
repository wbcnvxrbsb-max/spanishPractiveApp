"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import VoiceButton from "./VoiceButton";
import ScenarioSelector from "./ScenarioSelector";
import AudioControls from "./AudioControls";
import CompletionModal from "./CompletionModal";
import { Scenario, ComplexityLevel, WordCount } from "@/lib/prompts";
import { Language, t } from "@/lib/translations";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const COMPLETION_MARKER = "[CONVERSATION_COMPLETE]";

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [scenario, setScenario] = useState<Scenario>("free_chat");
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [useTyping, setUseTyping] = useState(false);
  const [complexity, setComplexity] = useState<ComplexityLevel>(2);
  const [wordCount, setWordCount] = useState<WordCount>("medium");
  const [lang, setLang] = useState<Language>("es");
  const [showCompletion, setShowCompletion] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  const {
    speak,
    stop,
    isSpeaking,
    isSupported: ttsSupported,
    rate,
    setRate,
    currentMessageId,
  } = useSpeechSynthesis();

  // Load preferences from localStorage
  useEffect(() => {
    const savedComplexity = localStorage.getItem("complexity");
    const savedWordCount = localStorage.getItem("wordCount");
    const savedLang = localStorage.getItem("uiLanguage");
    if (savedComplexity) setComplexity(parseInt(savedComplexity) as ComplexityLevel);
    if (savedWordCount) setWordCount(savedWordCount as WordCount);
    if (savedLang) setLang(savedLang as Language);
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem("complexity", complexity.toString());
  }, [complexity]);

  useEffect(() => {
    localStorage.setItem("wordCount", wordCount);
  }, [wordCount]);

  useEffect(() => {
    localStorage.setItem("uiLanguage", lang);
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-play new assistant messages
  useEffect(() => {
    if (messages.length > 0 && ttsSupported) {
      const lastMessage = messages[messages.length - 1];
      if (
        lastMessage.role === "assistant" &&
        lastMessage.id !== lastMessageIdRef.current
      ) {
        lastMessageIdRef.current = lastMessage.id;
        speak(lastMessage.content, lastMessage.id);
      }
    }
  }, [messages, ttsSupported, speak]);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleSpeak = useCallback(
    (text: string, messageId: string) => {
      if (isSpeaking && currentMessageId === messageId) {
        stop();
      } else {
        speak(text, messageId);
      }
    },
    [isSpeaking, currentMessageId, speak, stop]
  );

  const toggleLanguage = () => {
    setLang((prev) => (prev === "es" ? "en" : "es"));
  };

  // Check if message contains completion marker and strip it
  const processAIResponse = (content: string): { text: string; isComplete: boolean } => {
    const isComplete = content.includes(COMPLETION_MARKER);
    const text = content.replace(COMPLETION_MARKER, "").trim();
    return { text, isComplete };
  };

  const handleCompletion = () => {
    setShowCompletion(false);
    setMessages([]);
    setIsStarted(false);
    lastMessageIdRef.current = null;
    stop();
  };

  const startConversation = async () => {
    setIsStarted(true);
    setIsLoading(true);
    stop();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "¡Hola!" }],
          scenario,
          complexity,
          wordCount,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const { text, isComplete } = processAIResponse(data.message);

      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content: "¡Hola!",
      };
      const assistantMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: text,
      };

      setMessages([userMsg, assistantMsg]);

      if (isComplete) {
        setTimeout(() => setShowCompletion(true), 1500);
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      setMessages([
        {
          id: generateId(),
          role: "assistant",
          content: t("error", lang) + " " + t("tryAgain", lang),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScenarioChange = (newScenario: Scenario) => {
    setScenario(newScenario);
    if (isStarted) {
      stop();
      setMessages([]);
      setIsStarted(false);
      lastMessageIdRef.current = null;
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    stop();

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: content.trim(),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          scenario,
          complexity,
          wordCount,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const { text, isComplete } = processAIResponse(data.message);

      const assistantMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: text,
      };

      setMessages([...newMessages, assistantMsg]);

      // Show completion modal after a short delay to let the message display
      if (isComplete) {
        setTimeout(() => setShowCompletion(true), 1500);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        {
          id: generateId(),
          role: "assistant",
          content: t("error", lang) + " " + t("tryAgain", lang),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50">
      {/* Completion Modal */}
      {showCompletion && (
        <CompletionModal onClose={handleCompletion} lang={lang} />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md relative">
        <h1 className="text-xl font-bold text-center">{t("title", lang)}</h1>
        <p className="text-xs text-blue-100 text-center mt-1">
          {t("subtitle", lang)}
        </p>

        {/* Language Toggle - Top Right */}
        <button
          onClick={toggleLanguage}
          className="absolute top-3 right-3 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-xs font-medium transition-colors flex items-center gap-1"
        >
          {lang === "es" ? "🇪🇸 ES" : "🇺🇸 EN"}
        </button>
      </div>

      {/* Scenario Selector */}
      <ScenarioSelector
        selected={scenario}
        onChange={handleScenarioChange}
        disabled={isLoading}
        lang={lang}
      />

      {/* Audio & Difficulty Controls */}
      <AudioControls
        rate={rate}
        onRateChange={setRate}
        complexity={complexity}
        onComplexityChange={setComplexity}
        wordCount={wordCount}
        onWordCountChange={setWordCount}
        isSupported={ttsSupported}
        lang={lang}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 chat-messages">
        {!isStarted ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md">
              <div className="text-5xl mb-4">🇪🇸</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {t("welcome", lang)}
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                {t("welcomeText", lang)}
              </p>
              <p className="text-gray-500 mb-6 text-xs">
                {t("adjustLevel", lang)}
              </p>
              <button
                onClick={startConversation}
                className="px-8 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {t("startConversation", lang)}
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                messageId={msg.id}
                onSpeak={ttsSupported ? handleSpeak : undefined}
                isSpeaking={isSpeaking}
                isCurrentlySpeaking={currentMessageId === msg.id}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area - Voice First or Typing */}
      {isStarted && (
        useTyping ? (
          <div>
            <MessageInput onSend={sendMessage} disabled={isLoading} lang={lang} />
            <button
              onClick={() => setUseTyping(false)}
              className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 bg-gray-50 border-t"
            >
              🎤 {t("switchToVoice", lang)}
            </button>
          </div>
        ) : (
          <VoiceButton
            onTranscript={sendMessage}
            disabled={isLoading}
            onTypingMode={() => setUseTyping(true)}
            lang={lang}
          />
        )
      )}
    </div>
  );
}
