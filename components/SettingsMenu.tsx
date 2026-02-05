"use client";

import { useState, useRef, useEffect } from "react";
import { ComplexityLevel, WordCount, TargetLanguage } from "@/lib/prompts";
import { Language, t } from "@/lib/translations";

interface SettingsMenuProps {
  rate: number;
  onRateChange: (rate: number) => void;
  complexity: ComplexityLevel;
  onComplexityChange: (level: ComplexityLevel) => void;
  wordCount: WordCount;
  onWordCountChange: (count: WordCount) => void;
  targetLang: TargetLanguage;
  onTargetLangChange: (lang: TargetLanguage) => void;
  hideText: boolean;
  onHideTextChange: (hide: boolean) => void;
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

export default function SettingsMenu({
  rate,
  onRateChange,
  complexity,
  onComplexityChange,
  wordCount,
  onWordCountChange,
  targetLang,
  onTargetLangChange,
  hideText,
  onHideTextChange,
  isSupported,
  lang,
}: SettingsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Gear Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-colors"
        title="Settings"
      >
        ⚙️
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-3 sm:p-4 z-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            {lang === "pt" ? "Configurações" : lang === "es" ? "Configuración" : "Settings"}
          </h3>

          {/* Learning Language */}
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-600 block mb-2">
              🌍 {t("learning", lang)}
            </label>
            <div className="flex gap-1">
              <button
                onClick={() => onTargetLangChange("es")}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  targetLang === "es"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                🇪🇸 {lang === "pt" ? "Espanhol" : lang === "es" ? "Español" : "Spanish"}
              </button>
              <button
                onClick={() => onTargetLangChange("pt")}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  targetLang === "pt"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                🇧🇷 {lang === "pt" ? "Português" : lang === "es" ? "Portugués" : "Portuguese"}
              </button>
            </div>
          </div>

          {/* Speed Control */}
          {isSupported && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-600">
                  🔊 {t("speed", lang)}
                </label>
                <span className="text-xs font-mono text-gray-500">
                  {rate.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={rate}
                onChange={(e) => onRateChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          )}

          {/* Complexity Level */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-gray-600">
                📚 {t("level", lang)}
              </label>
              <span className="text-xs text-gray-500">
                {complexity}/5 {t(levelKeys[complexity], lang)}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={complexity}
              onChange={(e) => onComplexityChange(parseInt(e.target.value) as ComplexityLevel)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>

          {/* Word Count */}
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-600 block mb-2">
              📝 {t("words", lang)}
            </label>
            <div className="flex gap-1">
              {(["short", "medium", "long"] as WordCount[]).map((count) => (
                <button
                  key={count}
                  onClick={() => onWordCountChange(count)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    wordCount === count
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t(count, lang)}
                </button>
              ))}
            </div>
          </div>

          {/* Hide Text Toggle */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">
              👁️ {t("hideText", lang)}
            </label>
            <div className="flex gap-1">
              <button
                onClick={() => onHideTextChange(false)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  !hideText
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {lang === "pt" ? "Mostrar" : lang === "es" ? "Mostrar" : "Show"}
              </button>
              <button
                onClick={() => onHideTextChange(true)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  hideText
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {lang === "pt" ? "Ocultar" : lang === "es" ? "Ocultar" : "Hide"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
