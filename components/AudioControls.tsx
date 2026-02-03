"use client";

import { useEffect, useState } from "react";
import { ComplexityLevel, WordCount } from "@/lib/prompts";
import { Language, t } from "@/lib/translations";

interface AudioControlsProps {
  rate: number;
  onRateChange: (rate: number) => void;
  complexity: ComplexityLevel;
  onComplexityChange: (level: ComplexityLevel) => void;
  wordCount: WordCount;
  onWordCountChange: (count: WordCount) => void;
  isSupported: boolean;
  lang: Language;
}

const levelKeys: Record<ComplexityLevel, keyof typeof import("@/lib/translations").translations.en> = {
  1: "level1",
  2: "level2",
  3: "level3",
  4: "level4",
  5: "level5",
};

export default function AudioControls({
  rate,
  onRateChange,
  complexity,
  onComplexityChange,
  wordCount,
  onWordCountChange,
  isSupported,
  lang,
}: AudioControlsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-3 bg-gray-50 border-b border-gray-200 space-y-3">
      {/* Speed Control - only show if TTS supported */}
      {isSupported && (
        <div className="flex items-center gap-3">
          <span className="text-lg w-6">🔊</span>
          <label className="text-xs font-medium text-gray-600 w-20">
            {t("speed", lang)}:
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => onRateChange(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-xs font-mono text-gray-700 w-12 text-right">
            {rate.toFixed(1)}x
          </span>
        </div>
      )}

      {/* Complexity Level */}
      <div className="flex items-center gap-3">
        <span className="text-lg w-6">📚</span>
        <label className="text-xs font-medium text-gray-600 w-20">
          {t("level", lang)}:
        </label>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={complexity}
          onChange={(e) => onComplexityChange(parseInt(e.target.value) as ComplexityLevel)}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
        <span className="text-xs font-medium text-gray-700 w-28 text-right">
          {complexity}/5 {t(levelKeys[complexity], lang)}
        </span>
      </div>

      {/* Word Count */}
      <div className="flex items-center gap-3">
        <span className="text-lg w-6">📝</span>
        <label className="text-xs font-medium text-gray-600 w-20">
          {t("words", lang)}:
        </label>
        <div className="flex-1 flex gap-1">
          {(["short", "medium", "long"] as WordCount[]).map((count) => (
            <button
              key={count}
              onClick={() => onWordCountChange(count)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                wordCount === count
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {t(count, lang)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
