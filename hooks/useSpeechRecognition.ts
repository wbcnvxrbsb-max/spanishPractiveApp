"use client";

import { useState, useCallback, useRef } from "react";

type TargetLanguage = "es" | "pt";

export function useSpeechRecognition(targetLang: TargetLanguage = "es") {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startListening = useCallback(async () => {
    if (isListening) return;

    setTranscript("");
    setError(null);
    chunksRef.current = [];

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
        setIsTranscribing(true);

        try {
          // Get API key from localStorage
          const apiKey = localStorage.getItem("elevenlabs_key");
          if (!apiKey) {
            throw new Error("No ElevenLabs API key found");
          }

          const audioBlob = new Blob(chunksRef.current, {
            type: mediaRecorder.mimeType,
          });

          // Map target language to ElevenLabs language code
          const languageCode = targetLang === "pt" ? "pt" : "es";

          // Create form data for ElevenLabs
          const formData = new FormData();
          formData.append("file", audioBlob, "recording.webm");
          formData.append("model_id", "scribe_v2");
          formData.append("language_code", languageCode);

          // Call ElevenLabs STT API directly from browser
          const response = await fetch(
            "https://api.elevenlabs.io/v1/speech-to-text",
            {
              method: "POST",
              headers: {
                "xi-api-key": apiKey,
              },
              body: formData,
            }
          );

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

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error("Microphone error:", err);
      setError("microphone_error");
      setIsListening(false);
    }
  }, [isListening, targetLang]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
    }
  }, [isListening]);

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
