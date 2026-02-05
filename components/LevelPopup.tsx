"use client";

import { useEffect } from "react";
import { ComplexityLevel } from "@/lib/prompts";
import { Language } from "@/lib/translations";

interface LevelPopupProps {
  level: ComplexityLevel;
  lang: Language;
  onClose: () => void;
}

const levelInfo: Record<ComplexityLevel, { name: { en: string; es: string; pt: string }; units: string; color: string }> = {
  1: {
    name: { en: "Ultra-Beginner", es: "Ultra-Principiante", pt: "Ultra-Iniciante" },
    units: "Day 1",
    color: "bg-green-500"
  },
  2: {
    name: { en: "Beginner", es: "Principiante", pt: "Iniciante" },
    units: "Units 1-2",
    color: "bg-blue-500"
  },
  3: {
    name: { en: "Basic-Intermediate", es: "Básico-Intermedio", pt: "Básico-Intermediário" },
    units: "Units 3-10",
    color: "bg-yellow-500"
  },
  4: {
    name: { en: "Advanced", es: "Avanzado", pt: "Avançado" },
    units: "Units 11-20",
    color: "bg-orange-500"
  },
  5: {
    name: { en: "Expert", es: "Experto", pt: "Expert" },
    units: "Units 21+",
    color: "bg-red-500"
  },
};

export default function LevelPopup({ level, lang, onClose }: LevelPopupProps) {
  const info = levelInfo[level];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className={`${info.color} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
        <div className="text-2xl font-bold">{level}</div>
        <div>
          <div className="font-semibold">{info.name[lang]}</div>
          <div className="text-xs opacity-90">Duolingo {info.units}</div>
        </div>
      </div>
    </div>
  );
}
