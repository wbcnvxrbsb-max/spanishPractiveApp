"use client";

import { useState, useEffect, useCallback } from "react";
import { Language, t } from "@/lib/translations";
import AdUnit from "./AdUnit";

interface RewardGateProps {
  onClose: () => void;
  lang: Language;
}

export default function RewardGate({ onClose, lang }: RewardGateProps) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleUpgrade = useCallback(async () => {
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 w-full text-center">
        <p className="text-xs text-gray-400 mb-3">
          {t("adSupport", lang)}
        </p>

        {/* Ad unit */}
        <div className="w-full min-h-[250px] mb-4">
          <AdUnit adSlot="6134119618" adFormat="rectangle" />
        </div>

        {countdown > 0 ? (
          <p className="text-sm text-gray-400">
            {t("adContinue", lang)} ({countdown}s)
          </p>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-500 text-white rounded-full font-bold text-sm hover:bg-blue-600 transition-colors"
          >
            {t("adContinue", lang)}
          </button>
        )}

        <button
          onClick={handleUpgrade}
          className="mt-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          {t("adUpgrade", lang)}
        </button>
      </div>
    </div>
  );
}
