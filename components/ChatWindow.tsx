"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import ScenarioSelector from "./ScenarioSelector";
import SettingsMenu from "./SettingsMenu";
import CompletionModal from "./CompletionModal";
import RewardGate from "./RewardGate";
import LevelPopup from "./LevelPopup";
import { Scenario, ComplexityLevel, WordCount, scenarioVariations } from "@/lib/prompts";
import { getLanguage, LANGUAGE_LIST } from "@/lib/languages";
import type { TargetLanguage } from "@/lib/languages";
import { Language, t } from "@/lib/translations";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const COMPLETION_MARKER = "[CONVERSATION_COMPLETE]";
const RESPONSE_TIMEOUT_MS = 15000;

export default function ChatWindow() {
  const { data: session, update: updateSession } = useSession();
  const isPremium = session?.user?.isPremium ?? false;
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
  const [showReward, setShowAd] = useState(false);
  const [showLevelPopup, setShowLevelPopup] = useState(false);
  const [scenarioVariation, setScenarioVariation] = useState<string | null>(null);
  const [conversationVoice, setConversationVoice] = useState<"feminine" | "masculine">("feminine");
  const [corrections, setCorrections] = useState<Record<string, string | null>>({});
  const [isRealTime, setIsRealTime] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownValueRef = useRef<number>(0);
  // Stable ref for isRealTime so callbacks don't go stale
  const isRealTimeRef = useRef(isRealTime);
  useEffect(() => { isRealTimeRef.current = isRealTime; }, [isRealTime]);

  // --- Speech Recognition (lifted up) ---
  const {
    transcript,
    isListening,
    isSupported: sttSupported,
    isTranscribing,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition(targetLang, isRealTime); // silence detection ON in real-time mode

  // Auto-send transcript when recording stops
  useEffect(() => {
    if (!isListening && transcript) {
      stopCountdown();
      sendMessage(transcript);
      resetTranscript();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);

  // Stop countdown if user starts speaking in real-time mode
  useEffect(() => {
    if (isListening) {
      stopCountdown();
    }
  }, [isListening]);

  // --- Countdown helpers ---
  const stopCountdown = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdown(null);
  }, []);

  const startCountdown = useCallback((onExpire: () => void) => {
    stopCountdown();
    countdownValueRef.current = Math.ceil(RESPONSE_TIMEOUT_MS / 1000);
    setCountdown(countdownValueRef.current);
    countdownTimerRef.current = setInterval(() => {
      countdownValueRef.current -= 1;
      setCountdown(countdownValueRef.current);
      if (countdownValueRef.current <= 0) {
        stopCountdown();
        onExpire();
      }
    }, 1000);
  }, [stopCountdown]);

  // Called when TTS playback finishes
  const handlePlaybackEnd = useCallback(() => {
    if (!isRealTimeRef.current) return;
    // Auto-start mic and begin countdown
    startListening();
    startCountdown(() => {
      // Timer expired: nudge the AI
      stopListening();
      sendNudge();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startListening, startCountdown, stopListening]);

  // --- Speech Synthesis ---
  const {
    speak,
    stop,
    unlockAudio,
    isSpeaking,
    isSupported: ttsSupported,
    rate,
    setRate,
    currentMessageId,
  } = useSpeechSynthesis(targetLang, handlePlaybackEnd);

  // Refresh session after Stripe upgrade
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("upgraded") === "true") {
        updateSession();
        window.history.replaceState({}, "", "/practice");
      }
    }
  }, [updateSession]);

  // Load preferences from localStorage
  useEffect(() => {
    const savedComplexity = localStorage.getItem("complexity");
    const savedWordCount = localStorage.getItem("wordCount");
    const savedLang = localStorage.getItem("uiLanguage");
    const savedTargetLang = localStorage.getItem("targetLanguage");
    const savedHideText = localStorage.getItem("hideText");
    const savedRealTime = localStorage.getItem("isRealTime");
    if (savedComplexity) {
      const old = parseInt(savedComplexity);
      const migrated = localStorage.getItem("levelMigratedV10");
      if (!migrated && old >= 1 && old <= 5) {
        const mapping: Record<number, number> = { 1: 2, 2: 4, 3: 6, 4: 8, 5: 10 };
        const newLevel = mapping[old] || old;
        setComplexity(newLevel as ComplexityLevel);
        localStorage.setItem("complexity", newLevel.toString());
        localStorage.setItem("levelMigratedV10", "true");
      } else {
        setComplexity(old as ComplexityLevel);
      }
    }
    if (savedWordCount) setWordCount(savedWordCount as WordCount);
    if (savedLang) setLang(savedLang as Language);
    if (savedTargetLang) setTargetLang(savedTargetLang as TargetLanguage);
    if (savedHideText) setHideText(savedHideText === "true");
    if (savedRealTime) setIsRealTime(savedRealTime === "true");
  }, []);

  // Save preferences
  useEffect(() => { localStorage.setItem("complexity", complexity.toString()); }, [complexity]);
  useEffect(() => { localStorage.setItem("wordCount", wordCount); }, [wordCount]);
  useEffect(() => { localStorage.setItem("uiLanguage", lang); }, [lang]);
  useEffect(() => { localStorage.setItem("targetLanguage", targetLang); }, [targetLang]);
  useEffect(() => { localStorage.setItem("hideText", hideText.toString()); }, [hideText]);
  useEffect(() => { localStorage.setItem("isRealTime", isRealTime.toString()); }, [isRealTime]);

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

  const checkGrammar = useCallback(async (messageId: string, content: string, conversationMessages: {role: string; content: string}[]) => {
    try {
      const response = await fetch("/api/grammar-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content, targetLang, conversationContext: conversationMessages }),
      });
      const data = await response.json();
      if (data.correction) {
        setCorrections(prev => ({ ...prev, [messageId]: data.correction }));
      }
    } catch (error) {
      console.error("Grammar check error:", error);
    }
  }, [targetLang]);

  const toggleLanguage = () => {
    setLang((prev) => {
      if (prev === "en") return "es";
      if (prev === "es") return "pt";
      return "en";
    });
  };

  const handleTargetLangChange = (newTargetLang: TargetLanguage) => {
    setTargetLang(newTargetLang);
    if (isStarted) {
      stop();
      stopCountdown();
      setMessages([]);
      setCorrections({});
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

  const handleCompletionClose = () => {
    setShowCompletion(false);
    if (isPremium) {
      handleReturnHome();
    } else {
      setShowAd(true);
    }
  };

  const handleReturnHome = () => {
    setShowAd(false);
    setMessages([]);
    setCorrections({});
    setIsStarted(false);
    lastMessageIdRef.current = null;
    setScenarioVariation(null);
    stop();
    stopCountdown();
  };

  const startConversation = async () => {
    unlockAudio();
    setIsStarted(true);
    setIsLoading(true);
    setShowLevelPopup(true);
    stop();

    const variations = scenarioVariations[scenario];
    const selectedVariation = variations[Math.floor(Math.random() * variations.length)];
    const selectedVoice = Math.random() < 0.5 ? "feminine" : "masculine" as const;
    setScenarioVariation(selectedVariation);
    setConversationVoice(selectedVoice);

    const greeting = getLanguage(targetLang).greeting;

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

      const { text } = processAIResponse(data.message);
      // Never end conversation on the very first exchange

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
      stopCountdown();
      setMessages([]);
      setCorrections({});
      setIsStarted(false);
      lastMessageIdRef.current = null;
      setScenarioVariation(null);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Interrupt AI if it's speaking
    stop();
    stopCountdown();

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: content.trim(),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    checkGrammar(userMsg.id, content.trim(), messages.map(m => ({ role: m.role, content: m.content })));

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

  // Nudge the AI when the user doesn't respond in time
  const sendNudge = useCallback(async () => {
    const langName = getLanguage(targetLang).name;
    const nudge = `[the user went silent — continue the conversation or ask something in ${langName}]`;
    await sendMessage(nudge);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLang, messages, scenarioVariation, scenario, complexity, wordCount]);

  const handleToggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      // Interrupt AI if speaking
      if (isSpeaking) stop();
      stopCountdown();
      resetTranscript();
      startListening();
    }
  }, [isListening, isSpeaking, stop, stopCountdown, resetTranscript, startListening, stopListening]);

  const toggleRealTime = () => {
    const newVal = !isRealTime;
    setIsRealTime(newVal);
    // If turning off, clean up any active real-time state
    if (!newVal) {
      stopCountdown();
      if (isListening) stopListening();
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50">
      {/* Completion Modal */}
      {showCompletion && (
        <CompletionModal onClose={handleCompletionClose} lang={lang} />
      )}

      {/* Reward Gate */}
      {showReward && (
        <RewardGate onClose={handleReturnHome} lang={lang} />
      )}

      {/* Compact Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 shadow-md flex items-center justify-between">
        <h1 className="text-base font-bold">{lang === "pt" ? "Pratique" : lang === "es" ? "Practica" : "Practice"} {getLanguage(targetLang).name}</h1>

        {/* Right side: Real-time toggle + Settings + Language */}
        <div className="flex items-center gap-2">
          {/* Real-time mode toggle — always visible */}
          <button
            onClick={toggleRealTime}
            title={isRealTime ? "Switch to Self-paced" : "Switch to Real-time"}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${
              isRealTime
                ? "bg-green-400 text-green-900 border-green-300 shadow-sm shadow-green-300/50"
                : "bg-white/20 text-white border-white/30 hover:bg-white/30"
            }`}
          >
            {isRealTime ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-green-800 animate-pulse" />
                Live
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                Paced
              </>
            )}
          </button>

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
            isPremium={isPremium}
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
              <div className="text-4xl mb-3">{getLanguage(targetLang).flag}</div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {t("welcome", lang)}
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                {t("welcomeText", lang)}
              </p>
              <button
                onClick={startConversation}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm"
              >
                {t("startConversation", lang)}
              </button>
              <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                New to {getLanguage(targetLang).name}? Visit{" "}
                <a
                  href="https://www.duolingo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 font-medium hover:underline"
                >
                  Duolingo
                </a>{" "}
                first to learn some basic words and phrases!
              </p>
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
                correction={corrections[msg.id] || null}
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
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Countdown indicator for real-time mode */}
      {isStarted && isRealTime && countdown !== null && (
        <div className="px-3 pb-1 flex justify-center">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-3 h-3 text-green-500 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>
              {isListening
                ? "Listening..."
                : `Your turn · ${countdown}s`}
            </span>
          </div>
        </div>
      )}

      {/* Input Area */}
      {isStarted && (
        <MessageInput
          onSend={sendMessage}
          disabled={isLoading}
          lang={lang}
          targetLang={targetLang}
          isListening={isListening}
          isTranscribing={isTranscribing}
          isSupported={sttSupported}
          onToggleListening={handleToggleListening}
        />
      )}
    </div>
  );
}
