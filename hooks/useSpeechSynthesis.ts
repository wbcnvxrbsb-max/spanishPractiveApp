"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Voice index cycles through 6 voices (0-5)
// 0-2: feminine voices, 3-5: masculine voices
let globalVoiceIndex = 0;

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const [spanishVoices, setSpanishVoices] = useState<{
    feminine: SpeechSynthesisVoice[];
    masculine: SpeechSynthesisVoice[];
  }>({ feminine: [], masculine: [] });
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);

      const savedRate = localStorage.getItem("speechRate");
      if (savedRate) {
        setRate(parseFloat(savedRate));
      }

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // Filter Spanish voices and categorize by gender
        const spanish = availableVoices.filter(
          (v) => v.lang.startsWith("es-") || v.lang === "es"
        );

        // Categorize voices by common naming patterns
        // Feminine names often include: Monica, Paulina, Laura, Lucia, Elena, Francisca, Marisol
        // Masculine names often include: Jorge, Diego, Juan, Carlos, Pablo, Andres
        const femininePatterns = /monica|paulina|laura|lucia|elena|francisca|marisol|female|mujer|rosa|carmen|isabel|maria|ana|sofia|valentina|camila/i;
        const masculinePatterns = /jorge|diego|juan|carlos|pablo|andres|male|hombre|antonio|jose|miguel|manuel|francisco|pedro|luis|rafael|daniel/i;

        const feminine: SpeechSynthesisVoice[] = [];
        const masculine: SpeechSynthesisVoice[] = [];

        spanish.forEach((voice) => {
          if (femininePatterns.test(voice.name)) {
            feminine.push(voice);
          } else if (masculinePatterns.test(voice.name)) {
            masculine.push(voice);
          } else {
            // If can't determine, alternate assignment
            if (feminine.length <= masculine.length) {
              feminine.push(voice);
            } else {
              masculine.push(voice);
            }
          }
        });

        setSpanishVoices({ feminine, masculine });
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("speechRate", rate.toString());
    }
  }, [rate]);

  const getNextVoice = useCallback(() => {
    const { feminine, masculine } = spanishVoices;
    const allVoices = [...feminine, ...masculine];

    if (allVoices.length === 0) {
      // Fallback to any Spanish voice
      return voices.find((v) => v.lang.startsWith("es")) || null;
    }

    // We want to cycle through up to 6 voices: 3 feminine, 3 masculine
    // Index 0-2: feminine, Index 3-5: masculine
    const targetIndex = globalVoiceIndex % 6;
    globalVoiceIndex++;

    if (targetIndex < 3) {
      // Feminine voice
      if (feminine.length > 0) {
        return feminine[targetIndex % feminine.length];
      }
      // Fallback to masculine if no feminine available
      return masculine.length > 0 ? masculine[0] : allVoices[0];
    } else {
      // Masculine voice (index 3, 4, 5 -> 0, 1, 2)
      const mascIndex = targetIndex - 3;
      if (masculine.length > 0) {
        return masculine[mascIndex % masculine.length];
      }
      // Fallback to feminine if no masculine available
      return feminine.length > 0 ? feminine[0] : allVoices[0];
    }
  }, [spanishVoices, voices]);

  const speak = useCallback(
    (text: string, messageId?: string) => {
      if (!isSupported || !text) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voice = getNextVoice();
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = "es-ES";
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentMessageId(messageId || null);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentMessageId(null);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentMessageId(null);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, rate, getNextVoice]
  );

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentMessageId(null);
    }
  }, [isSupported]);

  const pause = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.pause();
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.resume();
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isSupported,
    rate,
    setRate,
    currentMessageId,
    voices,
    spanishVoices,
  };
}
