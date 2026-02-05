"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type TargetLanguage = "es" | "pt";
type Voice = "feminine" | "masculine";

// ElevenLabs voice IDs
const VOICES = {
  feminine: "EXAVITQu4vr4xnSDxMaL", // Sarah
  masculine: "TX3LPaxmHKxFdv7VOQHJ", // Liam
};

let globalVoiceIndex = 0;

export function useSpeechSynthesis(targetLang: TargetLanguage = "es") {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(true);
  const [rate, setRate] = useState(0.9);
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRate = localStorage.getItem("speechRate");
      if (savedRate) {
        setRate(parseFloat(savedRate));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("speechRate", rate.toString());
    }
  }, [rate]);

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  // Unlock audio playback by playing a silent audio (call on user click)
  const unlockAudio = useCallback(() => {
    const audio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
    audio.play().catch(() => {});
  }, []);

  const getNextVoice = useCallback((): Voice => {
    const voiceIndex = globalVoiceIndex % 2;
    globalVoiceIndex++;
    return voiceIndex === 0 ? "feminine" : "masculine";
  }, []);

  const speak = useCallback(
    async (text: string, messageId?: string, voiceOverride?: Voice) => {
      if (!text) return;

      // Get API key from localStorage
      const apiKey = localStorage.getItem("elevenlabs_key");
      if (!apiKey) {
        console.error("No ElevenLabs API key found in localStorage");
        return;
      }

      cleanupAudio();

      const voice = voiceOverride || getNextVoice();
      const voiceId = voice === "masculine" ? VOICES.masculine : VOICES.feminine;

      setIsSpeaking(true);
      setCurrentMessageId(messageId || null);

      try {
        // Call ElevenLabs API directly from browser
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
          {
            method: "POST",
            headers: {
              "xi-api-key": apiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                speed: Math.max(0.5, Math.min(1.0, rate)),
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error("TTS request failed");
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        blobUrlRef.current = audioUrl;

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          setCurrentMessageId(null);
          cleanupAudio();
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          setCurrentMessageId(null);
          cleanupAudio();
        };

        await audio.play();
      } catch (error) {
        console.error("TTS error:", error);
        setIsSpeaking(false);
        setCurrentMessageId(null);
        cleanupAudio();
      }
    },
    [rate, getNextVoice, cleanupAudio]
  );

  const stop = useCallback(() => {
    cleanupAudio();
    setIsSpeaking(false);
    setCurrentMessageId(null);
  }, [cleanupAudio]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return {
    speak,
    stop,
    pause,
    resume,
    unlockAudio,
    isSpeaking,
    isSupported,
    rate,
    setRate,
    currentMessageId,
    voices: [],
    targetVoices: { feminine: [], masculine: [] },
  };
}
