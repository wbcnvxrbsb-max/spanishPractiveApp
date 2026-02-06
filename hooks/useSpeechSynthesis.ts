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

// Persistent AudioContext to keep audio unlocked after user interaction
let audioContext: AudioContext | null = null;

export function useSpeechSynthesis(targetLang: TargetLanguage = "es") {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(true);
  const [rate, setRate] = useState(0.9);
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

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
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch {
        // Already stopped
      }
      sourceNodeRef.current = null;
    }
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

  // Unlock audio playback by creating/resuming AudioContext (call on user click)
  const unlockAudio = useCallback(() => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
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
        const arrayBuffer = await audioBlob.arrayBuffer();

        // Ensure AudioContext exists and is running
        if (!audioContext) {
          audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        }
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        // Decode and play through AudioContext
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const sourceNode = audioContext.createBufferSource();
        sourceNode.buffer = audioBuffer;
        sourceNode.connect(audioContext.destination);
        sourceNodeRef.current = sourceNode;

        sourceNode.onended = () => {
          setIsSpeaking(false);
          setCurrentMessageId(null);
          sourceNodeRef.current = null;
        };

        sourceNode.start(0);
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
