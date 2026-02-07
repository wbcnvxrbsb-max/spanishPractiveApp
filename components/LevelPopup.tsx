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
    name: { en: "First Words", es: "Primeras Palabras", pt: "Primeiras Palavras" },
    units: "Day 1",
    color: "bg-green-400"
  },
  2: {
    name: { en: "Introductions", es: "Presentaciones", pt: "Apresentações" },
    units: "Day 2-3",
    color: "bg-green-500"
  },
  3: {
    name: { en: "Basic Questions", es: "Preguntas Básicas", pt: "Perguntas Básicas" },
    units: "Week 1",
    color: "bg-green-600"
  },
  4: {
    name: { en: "Wants & Likes", es: "Gustos y Deseos", pt: "Gostos e Desejos" },
    units: "Unit 1",
    color: "bg-blue-400"
  },
  5: {
    name: { en: "Daily Life", es: "Vida Diaria", pt: "Vida Diária" },
    units: "Unit 2",
    color: "bg-blue-500"
  },
  6: {
    name: { en: "Past & Travel", es: "Pasado y Viajes", pt: "Passado e Viagens" },
    units: "Units 3-5",
    color: "bg-yellow-500"
  },
  7: {
    name: { en: "Feelings & Opinions", es: "Sentimientos y Opiniones", pt: "Sentimentos e Opiniões" },
    units: "Units 6-8",
    color: "bg-orange-400"
  },
  8: {
    name: { en: "Complex Conversation", es: "Conversación Compleja", pt: "Conversa Complexa" },
    units: "Units 9-12",
    color: "bg-orange-500"
  },
  9: {
    name: { en: "Advanced Expression", es: "Expresión Avanzada", pt: "Expressão Avançada" },
    units: "Units 13-20",
    color: "bg-red-400"
  },
  10: {
    name: { en: "Native-Like", es: "Nativo", pt: "Nativo" },
    units: "Units 21+",
    color: "bg-red-600"
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
