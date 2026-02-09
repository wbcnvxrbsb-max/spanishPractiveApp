"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import ChatWindow from "./ChatWindow";

export default function AppWrapper() {
  const { data: session, status } = useSession();
  const [lang, setLang] = useState<"en" | "es" | "pt">("en");
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("uiLanguage");
      if (savedLang === "es" || savedLang === "pt" || savedLang === "en") {
        setLang(savedLang);
      }
    }
  }, [session]);

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Not logged in
  if (status === "unauthenticated" || !session) {
    if (showRegister) {
      return (
        <RegisterScreen
          lang={lang}
          onBack={() => setShowRegister(false)}
          onSuccess={() => setShowRegister(false)}
        />
      );
    }
    return (
      <LoginScreen
        lang={lang}
        onRegister={() => setShowRegister(true)}
      />
    );
  }

  // Logged in - show app directly (no API key setup needed)
  if (status === "authenticated") {
    return <ChatWindow />;
  }

  // Fallback
  return (
    <LoginScreen
      lang={lang}
      onRegister={() => setShowRegister(true)}
    />
  );
}
