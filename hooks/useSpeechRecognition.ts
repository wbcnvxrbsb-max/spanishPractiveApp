"use client";

import { useState, useCallback, useRef } from "react";

import type { TargetLanguage } from "@/lib/languages";

const SILENCE_THRESHOLD = 10; // RMS below this = silence
const SILENCE_DURATION_MS = 2000; // stop after 2s of silence

export function useSpeechRecognition(targetLang: TargetLanguage = "es", silenceDetection = false) {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceRafRef = useRef<number | null>(null);
  const hasSoundRef = useRef(false); // only auto-stop after user actually spoke

  const clearSilenceTracking = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (silenceRafRef.current) {
      cancelAnimationFrame(silenceRafRef.current);
      silenceRafRef.current = null;
    }
  }, []);

  const startListening = useCallback(async () => {
    if (isListening) return;

    setTranscript("");
    setError(null);
    chunksRef.current = [];
    hasSoundRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        clearSilenceTracking();
        setIsTranscribing(true);

        try {
          const audioBlob = new Blob(chunksRef.current, {
            type: mediaRecorder.mimeType,
          });

          const formData = new FormData();
          formData.append("file", audioBlob, "recording.webm");
          formData.append("language", targetLang);

          const response = await fetch("/api/stt", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Transcription failed");
          }

          const data = await response.json();
          setTranscript(data.text || "");
        } catch (err) {
          console.error("Transcription error:", err);
          setError("transcription_failed");
        } finally {
          setIsTranscribing(false);
          setIsListening(false);
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsListening(true);

      // Silence detection using Web Audio API AnalyserNode
      if (silenceDetection) {
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkSilence = () => {
          if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") return;

          analyser.getByteTimeDomainData(dataArray);
          // Calculate RMS volume
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const val = (dataArray[i] - 128) / 128;
            sum += val * val;
          }
          const rms = Math.sqrt(sum / dataArray.length) * 100;

          if (rms > SILENCE_THRESHOLD) {
            hasSoundRef.current = true;
            // Reset silence timer whenever sound detected
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
              silenceTimerRef.current = null;
            }
          } else if (hasSoundRef.current && !silenceTimerRef.current) {
            // Sound detected before, now silent — start the timer
            silenceTimerRef.current = setTimeout(() => {
              if (mediaRecorderRef.current?.state === "recording") {
                mediaRecorderRef.current.stop();
              }
            }, SILENCE_DURATION_MS);
          }

          silenceRafRef.current = requestAnimationFrame(checkSilence);
        };

        silenceRafRef.current = requestAnimationFrame(checkSilence);
      }
    } catch (err) {
      console.error("Microphone error:", err);
      setError("microphone_error");
      setIsListening(false);
    }
  }, [isListening, targetLang, silenceDetection, clearSilenceTracking]);

  const stopListening = useCallback(() => {
    clearSilenceTracking();
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
    }
  }, [isListening, clearSilenceTracking]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    transcript,
    isListening,
    isSupported,
    error,
    isTranscribing,
    startListening,
    stopListening,
    resetTranscript,
  };
}
