"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { ComplexityLevel, WordCount } from "@/lib/prompts";
import { LANGUAGE_LIST } from "@/lib/languages";
import type { TargetLanguage } from "@/lib/languages";
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
  isPremium: boolean;
}

const levelKeys: Record<ComplexityLevel, keyof typeof import("@/lib/translations").translations.en> = {
  1: "level1",
  2: "level2",
  3: "level3",
  4: "level4",
  5: "level5",
  6: "level6",
  7: "level7",
  8: "level8",
  9: "level9",
  10: "level10",
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
  isPremium,
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
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
              {LANGUAGE_LIST.map((language) => (
                <button
                  key={language.code}
                  onClick={() => onTargetLangChange(language.code)}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors ${
                    targetLang === language.code
                      ? "bg-green-500 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {language.flag} {language.name}
                </button>
              ))}
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
                {complexity}/10 {t(levelKeys[complexity], lang)}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
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
          <div className="mb-4">
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

          {/* Remove Ads / Premium Badge */}
          <div className="pt-3 border-t border-gray-200">
            {isPremium ? (
              <div className="flex items-center justify-center gap-1 py-2">
                <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  {t("premium", lang)}
                </span>
              </div>
            ) : (
              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/stripe/checkout", { method: "POST" });
                    const data = await res.json();
                    if (data.url) {
                      window.location.href = data.url;
                    }
                  } catch (err) {
                    console.error("Stripe checkout error:", err);
                  }
                }}
                className="w-full py-2 text-xs font-medium text-green-600 hover:bg-green-50 rounded-md transition-colors"
              >
                {t("removeAds", lang)}
              </button>
            )}
          </div>

          {/* Sign Out */}
          <div className="pt-3 border-t border-gray-200">
            <button
              onClick={() => signOut()}
              className="w-full py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              {lang === "pt" ? "Sair da conta" : lang === "es" ? "Cerrar sesión" : "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
