"use client";

import { useState } from "react";

interface RegisterScreenProps {
  onBack: () => void;
  onSuccess: () => void;
  lang?: "en" | "es" | "pt";
}

export default function RegisterScreen({ onBack, onSuccess, lang = "en" }: RegisterScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const text = {
    en: {
      title: "Create Account",
      name: "Name (optional)",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      register: "Create Account",
      back: "Back to Login",
      passwordMismatch: "Passwords do not match",
      passwordTooShort: "Password must be at least 6 characters",
      success: "Account created! Please sign in.",
      permissionNotice: "This app uses your microphone for speech recognition and plays audio responses. You'll be asked to allow microphone access when you start practicing.",
    },
    es: {
      title: "Crear Cuenta",
      name: "Nombre (opcional)",
      email: "Correo electrónico",
      password: "Contraseña",
      confirmPassword: "Confirmar Contraseña",
      register: "Crear Cuenta",
      back: "Volver al Inicio",
      passwordMismatch: "Las contraseñas no coinciden",
      passwordTooShort: "La contraseña debe tener al menos 6 caracteres",
      success: "¡Cuenta creada! Por favor inicia sesión.",
      permissionNotice: "Esta app usa tu micrófono para reconocimiento de voz y reproduce respuestas de audio. Se te pedirá permitir el acceso al micrófono cuando empieces a practicar.",
    },
    pt: {
      title: "Criar Conta",
      name: "Nome (opcional)",
      email: "E-mail",
      password: "Senha",
      confirmPassword: "Confirmar Senha",
      register: "Criar Conta",
      back: "Voltar ao Login",
      passwordMismatch: "As senhas não coincidem",
      passwordTooShort: "A senha deve ter pelo menos 6 caracteres",
      success: "Conta criada! Por favor, faça login.",
      permissionNotice: "Este app usa seu microfone para reconhecimento de fala e reproduz respostas de áudio. Você será solicitado a permitir o acesso ao microfone quando começar a praticar.",
    },
  };

  const t = text[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    if (password.length < 6) {
      setError(t.passwordTooShort);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">{t.title}</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <span className="text-lg flex-shrink-0">🎤🔊</span>
            <p className="text-sm text-blue-800">{t.permissionNotice}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {t.name}
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t.email}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t.password}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              {t.confirmPassword}
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "..." : t.register}
          </button>
        </form>

        <button
          onClick={onBack}
          className="w-full mt-4 text-sm text-gray-600 hover:text-gray-800"
        >
          {t.back}
        </button>
      </div>
    </div>
  );
}
