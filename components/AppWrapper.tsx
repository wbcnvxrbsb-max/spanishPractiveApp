"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import LoginScreen from "./LoginScreen";
import ApiKeySetup from "./ApiKeySetup";
import ChatWindow from "./ChatWindow";

export default function AppWrapper() {
  const { data: session, status } = useSession();
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [lang, setLang] = useState<"en" | "es" | "pt">("en");

  // Check for API key on mount and when session changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const key = localStorage.getItem("elevenlabs_key");
      setHasApiKey(!!key && key.length > 10 && key !== "YOUR_KEY_HERE");

      // Load saved language preference
      const savedLang = localStorage.getItem("uiLanguage");
      if (savedLang === "es" || savedLang === "pt" || savedLang === "en") {
        setLang(savedLang);
      }
    }
  }, [session]);

  // Debug logging - remove after fixing
  console.log("Auth status:", status, "Session:", !!session, "HasApiKey:", hasApiKey);

  // Show loading while checking auth
  if (status === "loading" || hasApiKey === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Not logged in - show login screen (explicit status check)
  if (status === "unauthenticated" || !session) {
    return <LoginScreen lang={lang} />;
  }

  // Logged in but no API key - show setup
  if (status === "authenticated" && !hasApiKey) {
    return (
      <ApiKeySetup
        lang={lang}
        onComplete={() => setHasApiKey(true)}
      />
    );
  }

  // Logged in with API key - show app
  if (status === "authenticated" && hasApiKey) {
    return <ChatWindow />;
  }

  // Fallback to login screen for any unexpected state
  return <LoginScreen lang={lang} />;
}
