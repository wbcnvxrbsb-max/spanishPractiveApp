export type Language = "es" | "en";

export const translations = {
  es: {
    // Header
    title: "Practica Español",
    subtitle: "Tu tutor de español con IA",

    // Scenario selector
    scenario: "Escenario",

    // Audio controls
    speed: "Velocidad",
    level: "Nivel",
    words: "Palabras",
    short: "Corto",
    medium: "Medio",
    long: "Largo",

    // Level names
    level1: "Principiante",
    level2: "Básico",
    level3: "Intermedio",
    level4: "Avanzado",
    level5: "Experto",

    // Welcome screen
    welcome: "¡Bienvenido!",
    welcomeText: "Practica tu español con conversaciones naturales.",
    adjustLevel: "Ajusta el nivel de dificultad arriba antes de comenzar.",
    startConversation: "Comenzar Conversación",

    // Voice button
    pressToRecord: "Presiona para grabar...",
    recording: "Grabando... toca para parar",
    waiting: "Esperando respuesta...",
    switchToKeyboard: "Escribir con teclado",
    browserNotSupported: "Tu navegador no soporta reconocimiento de voz.",
    useKeyboard: "Usar teclado",

    // Message input
    placeholder: "Escribe tu mensaje...",
    send: "Enviar",
    switchToVoice: "Cambiar a modo voz",

    // Errors
    error: "Lo siento, hubo un error.",
    tryAgain: "Por favor, intenta de nuevo.",

    // Completion
    congratulations: "¡Felicidades!",
    completedConversation: "¡Has completado la conversación con éxito!",
    returnHome: "Volver al inicio",
  },
  en: {
    // Header
    title: "Practice Spanish",
    subtitle: "Your AI Spanish tutor",

    // Scenario selector
    scenario: "Scenario",

    // Audio controls
    speed: "Speed",
    level: "Level",
    words: "Words",
    short: "Short",
    medium: "Medium",
    long: "Long",

    // Level names
    level1: "Beginner",
    level2: "Basic",
    level3: "Intermediate",
    level4: "Advanced",
    level5: "Expert",

    // Welcome screen
    welcome: "Welcome!",
    welcomeText: "Practice your Spanish with natural conversations.",
    adjustLevel: "Adjust the difficulty level above before starting.",
    startConversation: "Start Conversation",

    // Voice button
    pressToRecord: "Press button to start recording...",
    recording: "Recording... tap to stop",
    waiting: "Waiting for response...",
    switchToKeyboard: "Type with keyboard",
    browserNotSupported: "Your browser doesn't support voice recognition.",
    useKeyboard: "Use keyboard",

    // Message input
    placeholder: "Write your message...",
    send: "Send",
    switchToVoice: "Switch to voice mode",

    // Errors
    error: "Sorry, there was an error.",
    tryAgain: "Please try again.",

    // Completion
    congratulations: "Congratulations!",
    completedConversation: "You successfully completed the conversation!",
    returnHome: "Return Home",
  },
};

export function t(key: keyof typeof translations.en, lang: Language): string {
  return translations[lang][key] || translations.en[key];
}
