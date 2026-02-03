"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Language, t } from "@/lib/translations";

interface CompletionModalProps {
  onClose: () => void;
  lang: Language;
}

export default function CompletionModal({ onClose, lang }: CompletionModalProps) {
  useEffect(() => {
    // Fire confetti from both sides
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#ff0000", "#ffa500", "#ffff00", "#00ff00", "#0000ff", "#800080"];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Initial burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
    });

    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm mx-4 text-center transform animate-bounce-in">
        {/* Trophy/Star Icon */}
        <div className="text-6xl mb-4">🎉</div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t("congratulations", lang)}
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {t("completedConversation", lang)}
        </p>

        {/* Stars decoration */}
        <div className="flex justify-center gap-2 mb-6">
          <span className="text-3xl">⭐</span>
          <span className="text-4xl">⭐</span>
          <span className="text-3xl">⭐</span>
        </div>

        {/* Return Home Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-green-500 text-white rounded-full font-bold text-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          {t("returnHome", lang)}
        </button>
      </div>
    </div>
  );
}
