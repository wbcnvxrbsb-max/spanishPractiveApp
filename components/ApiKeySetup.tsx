"use client";

import { useState, useRef } from "react";
import { signOut } from "next-auth/react";

interface ApiKeySetupProps {
  onComplete: () => void;
  lang?: "en" | "es" | "pt";
}

export default function ApiKeySetup({ onComplete, lang = "en" }: ApiKeySetupProps) {
  const [keyFound, setKeyFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const text = {
    en: {
      title: "Setup Your API Key",
      step1: "1. Get your ElevenLabs API Key",
      step1Desc: "Create a free account at ElevenLabs and copy your API key from the profile settings.",
      getKey: "Get API Key",
      step2: "2. Set your key via browser console",
      step2Desc: "Open your browser's developer console (F12, Cmd+Option+J, or right-click anywhere and select \"Inspect\") and go to the Console tab. Then paste this command:",
      copyCommand: "Copy Command",
      copiedCommand: "Copied!",
      step3: "3. Verify your key",
      checkKey: "Check for Key",
      keyFound: "Key found!",
      downloadBackup: "Download Backup",
      continueToApp: "Continue to App",
      orUpload: "Or restore from backup:",
      uploadConfig: "Upload Config File",
      invalidFile: "Invalid config file",
      signOut: "Sign Out",
      whyConsole: "Why the console? Your API key never touches our servers - it stays in your browser only.",
    },
    es: {
      title: "Configura tu Clave API",
      step1: "1. Obtén tu clave API de ElevenLabs",
      step1Desc: "Crea una cuenta gratuita en ElevenLabs y copia tu clave API desde la configuración del perfil.",
      getKey: "Obtener Clave",
      step2: "2. Configura tu clave via consola del navegador",
      step2Desc: "Abre la consola de desarrollador (F12, Cmd+Option+J, o clic derecho y selecciona \"Inspeccionar\") y ve a la pestaña Consola. Luego pega este comando:",
      copyCommand: "Copiar Comando",
      copiedCommand: "¡Copiado!",
      step3: "3. Verifica tu clave",
      checkKey: "Verificar Clave",
      keyFound: "¡Clave encontrada!",
      downloadBackup: "Descargar Respaldo",
      continueToApp: "Continuar a la App",
      orUpload: "O restaurar desde respaldo:",
      uploadConfig: "Subir Archivo de Config",
      invalidFile: "Archivo de configuración inválido",
      signOut: "Cerrar Sesión",
      whyConsole: "¿Por qué la consola? Tu clave API nunca toca nuestros servidores - se queda solo en tu navegador.",
    },
    pt: {
      title: "Configure sua Chave API",
      step1: "1. Obtenha sua chave API do ElevenLabs",
      step1Desc: "Crie uma conta gratuita no ElevenLabs e copie sua chave API das configurações do perfil.",
      getKey: "Obter Chave",
      step2: "2. Configure sua chave via console do navegador",
      step2Desc: "Abra o console do desenvolvedor (F12, Cmd+Option+J, ou clique com o botão direito e selecione \"Inspecionar\") e vá para a aba Console. Depois cole este comando:",
      copyCommand: "Copiar Comando",
      copiedCommand: "Copiado!",
      step3: "3. Verifique sua chave",
      checkKey: "Verificar Chave",
      keyFound: "Chave encontrada!",
      downloadBackup: "Baixar Backup",
      continueToApp: "Continuar para o App",
      orUpload: "Ou restaurar do backup:",
      uploadConfig: "Enviar Arquivo de Config",
      invalidFile: "Arquivo de configuração inválido",
      signOut: "Sair",
      whyConsole: "Por que o console? Sua chave API nunca toca nossos servidores - ela fica apenas no seu navegador.",
    },
  };

  const t = text[lang];

  const consoleCommand = `localStorage.setItem('elevenlabs_key', 'YOUR_KEY_HERE')`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(consoleCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkForKey = () => {
    const key = localStorage.getItem("elevenlabs_key");
    if (key && key.length > 10 && key !== "YOUR_KEY_HERE") {
      setKeyFound(true);
      setError(null);
    } else {
      setKeyFound(false);
    }
  };

  const downloadBackup = () => {
    const key = localStorage.getItem("elevenlabs_key");
    if (!key) return;

    const config = JSON.stringify({ elevenlabs_key: key }, null, 2);
    const blob = new Blob([config], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "elevenlabs-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const config = JSON.parse(event.target?.result as string);
        if (config.elevenlabs_key && typeof config.elevenlabs_key === "string") {
          localStorage.setItem("elevenlabs_key", config.elevenlabs_key);
          setKeyFound(true);
          setError(null);
        } else {
          setError(t.invalidFile);
        }
      } catch {
        setError(t.invalidFile);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-xl font-bold text-gray-800">{t.title}</h1>
          <button
            onClick={() => signOut()}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {t.signOut}
          </button>
        </div>

        {/* Step 1: Get API Key */}
        <div className="mb-6">
          <h2 className="font-semibold text-gray-700 mb-1">{t.step1}</h2>
          <p className="text-sm text-gray-600 mb-2">{t.step1Desc}</p>
          <a
            href="https://elevenlabs.io/app/settings/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            {t.getKey}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Step 2: Console Command */}
        <div className="mb-6">
          <h2 className="font-semibold text-gray-700 mb-1">{t.step2}</h2>
          <p className="text-sm text-gray-600 mb-2">{t.step2Desc}</p>
          <div className="bg-gray-900 rounded-lg p-3 mb-2">
            <code className="text-green-400 text-sm break-all">{consoleCommand}</code>
          </div>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            {copied ? t.copiedCommand : t.copyCommand}
          </button>
          <p className="text-xs text-gray-500 mt-2 italic">{t.whyConsole}</p>
        </div>

        {/* Step 3: Verify */}
        <div className="mb-6">
          <h2 className="font-semibold text-gray-700 mb-2">{t.step3}</h2>
          {!keyFound ? (
            <button
              onClick={checkForKey}
              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
            >
              {t.checkKey}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">{t.keyFound}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={downloadBackup}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  {t.downloadBackup}
                </button>
                <button
                  onClick={onComplete}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  {t.continueToApp}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upload Option */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-2">{t.orUpload}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            {t.uploadConfig}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
