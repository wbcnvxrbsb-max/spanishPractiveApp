"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import ScenarioSelector from "./ScenarioSelector";
import SettingsMenu from "./SettingsMenu";
import CompletionModal from "./CompletionModal";
import LevelPopup from "./LevelPopup";
import { Scenario, ComplexityLevel, WordCount, TargetLanguage, scenarioVariations } from "@/lib/prompts";
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
  const [complexity, setComplexity] = useState<ComplexityLevel>(2);
  const [wordCount, setWordCount] = useState<WordCount>("medium");
  const [lang, setLang] = useState<Language>("en");
  const [targetLang, setTargetLang] = useState<TargetLanguage>("es");
  const [hideText, setHideText] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showLevelPopup, setShowLevelPopup] = useState(false);
  const [scenarioVariation, setScenarioVariation] = useState<string | null>(null);
  const [conversationVoice, setConversationVoice] = useState<"feminine" | "masculine">("feminine");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  const {
    speak,
    stop,
    unlockAudio,
    isSpeaking,
    isSupported: ttsSupported,
    rate,
    setRate,
    currentMessageId,
  } = useSpeechSynthesis(targetLang);

  // Load preferences from localStorage
  useEffect(() => {
    const savedComplexity = localStorage.getItem("complexity");
    const savedWordCount = localStorage.getItem("wordCount");
    const savedLang = localStorage.getItem("uiLanguage");
    const savedTargetLang = localStorage.getItem("targetLanguage");
    const savedHideText = localStorage.getItem("hideText");
    if (savedComplexity) setComplexity(parseInt(savedComplexity) as ComplexityLevel);
    if (savedWordCount) setWordCount(savedWordCount as WordCount);
    if (savedLang) setLang(savedLang as Language);
    if (savedTargetLang) setTargetLang(savedTargetLang as TargetLanguage);
    if (savedHideText) setHideText(savedHideText === "true");
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

  useEffect(() => {
    localStorage.setItem("targetLanguage", targetLang);
  }, [targetLang]);

  useEffect(() => {
    localStorage.setItem("hideText", hideText.toString());
  }, [hideText]);

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
        speak(lastMessage.content, lastMessage.id, conversationVoice);
      }
    }
  }, [messages, ttsSupported, speak, conversationVoice]);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleSpeak = useCallback(
    (text: string, messageId: string) => {
      if (isSpeaking && currentMessageId === messageId) {
        stop();
      } else {
        speak(text, messageId, conversationVoice);
      }
    },
    [isSpeaking, currentMessageId, speak, stop, conversationVoice]
  );

  const toggleLanguage = () => {
    setLang((prev) => {
      if (prev === "en") return "es";
      if (prev === "es") return "pt";
      return "en";
    });
  };

  const handleTargetLangChange = (newTargetLang: TargetLanguage) => {
    setTargetLang(newTargetLang);
    // Reset conversation when changing learning language
    if (isStarted) {
      stop();
      setMessages([]);
      setIsStarted(false);
      lastMessageIdRef.current = null;
      setScenarioVariation(null);
    }
  };

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
    setScenarioVariation(null);
    stop();
  };

  const startConversation = async () => {
    // Unlock audio playback on user interaction
    unlockAudio();

    setIsStarted(true);
    setIsLoading(true);
    setShowLevelPopup(true);
    stop();

    // Select persona and voice for this conversation
    const variations = scenarioVariations[scenario];
    const selectedVariation = variations[Math.floor(Math.random() * variations.length)];
    const selectedVoice = Math.random() < 0.5 ? "feminine" : "masculine" as const;
    setScenarioVariation(selectedVariation);
    setConversationVoice(selectedVoice);

    const greeting = targetLang === "pt" ? "Olá!" : "¡Hola!";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: greeting }],
          scenario,
          complexity,
          wordCount,
          targetLang,
          scenarioVariation: selectedVariation,
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
        content: greeting,
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
      setScenarioVariation(null);
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
          targetLang,
          scenarioVariation,
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

      {/* Compact Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 shadow-md flex items-center justify-between">
        <h1 className="text-base font-bold">{t(targetLang === "pt" ? "titlePt" : "title", lang)}</h1>

        {/* Right side: Settings + Language */}
        <div className="flex items-center gap-2">
          <SettingsMenu
            rate={rate}
            onRateChange={setRate}
            complexity={complexity}
            onComplexityChange={setComplexity}
            wordCount={wordCount}
            onWordCountChange={setWordCount}
            targetLang={targetLang}
            onTargetLangChange={handleTargetLangChange}
            hideText={hideText}
            onHideTextChange={setHideText}
            isSupported={ttsSupported}
            lang={lang}
          />
          <button
            onClick={toggleLanguage}
            className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-medium transition-colors"
          >
            {lang === "pt" ? "🇧🇷 PT" : lang === "es" ? "🇪🇸 ES" : "🇺🇸 EN"}
          </button>
        </div>
      </div>

      {/* Scenario Selector - Inline */}
      <ScenarioSelector
        selected={scenario}
        onChange={handleScenarioChange}
        disabled={isLoading}
        lang={lang}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 chat-messages">
        {!isStarted ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="bg-white rounded-2xl shadow-sm p-6 max-w-sm">
              <div className="text-4xl mb-3">{targetLang === "pt" ? "🇧🇷" : "🇪🇸"}</div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {t("welcome", lang)}
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                {t(targetLang === "pt" ? "welcomeTextPt" : "welcomeText", lang)}
              </p>
              <button
                onClick={startConversation}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm"
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
                lang={lang}
                hideText={hideText}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="ml-10 bg-white text-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
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

      {/* Input Area - Always visible when started */}
      {isStarted && (
        <MessageInput onSend={sendMessage} disabled={isLoading} lang={lang} targetLang={targetLang} />
      )}
    </div>
  );
}
