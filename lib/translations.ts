export type Language = "es" | "en" | "pt";
export type TargetLanguage = "es" | "pt";

export const translations = {
  es: {
    // Header
    title: "Practica Español",
    titlePt: "Practica Portugués",
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
    learning: "Aprendiendo",

    // Level names
    level1: "Ultra-Principiante",
    level2: "Principiante",
    level3: "Básico-Intermedio",
    level4: "Avanzado",
    level5: "Experto",

    // Welcome screen
    welcome: "¡Bienvenido!",
    welcomeText: "Practica tu español con conversaciones naturales.",
    welcomeTextPt: "Practica tu portugués con conversaciones naturales.",
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

    // Translation & Hide Text
    translate: "Traducir",
    hideText: "Ocultar Texto",
    translating: "Traduciendo...",
  },
  en: {
    // Header
    title: "Practice Spanish",
    titlePt: "Practice Portuguese",
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
    learning: "Learning",

    // Level names
    level1: "Ultra-Beginner",
    level2: "Beginner",
    level3: "Basic-Intermediate",
    level4: "Advanced",
    level5: "Expert",

    // Welcome screen
    welcome: "Welcome!",
    welcomeText: "Practice your Spanish with natural conversations.",
    welcomeTextPt: "Practice your Portuguese with natural conversations.",
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

    // Translation & Hide Text
    translate: "Translate",
    hideText: "Hide Text",
    translating: "Translating...",
  },
  pt: {
    // Header
    title: "Pratique Espanhol",
    titlePt: "Pratique Português",
    subtitle: "Seu tutor de idiomas com IA",

    // Scenario selector
    scenario: "Cenário",

    // Audio controls
    speed: "Velocidade",
    level: "Nível",
    words: "Palavras",
    short: "Curto",
    medium: "Médio",
    long: "Longo",
    learning: "Aprendendo",

    // Level names
    level1: "Ultra-Iniciante",
    level2: "Iniciante",
    level3: "Básico-Intermediário",
    level4: "Avançado",
    level5: "Expert",

    // Welcome screen
    welcome: "Bem-vindo!",
    welcomeText: "Pratique seu espanhol com conversas naturais.",
    welcomeTextPt: "Pratique seu português com conversas naturais.",
    adjustLevel: "Ajuste o nível de dificuldade acima antes de começar.",
    startConversation: "Começar Conversa",

    // Voice button
    pressToRecord: "Pressione para gravar...",
    recording: "Gravando... toque para parar",
    waiting: "Aguardando resposta...",
    switchToKeyboard: "Digitar com teclado",
    browserNotSupported: "Seu navegador não suporta reconhecimento de voz.",
    useKeyboard: "Usar teclado",

    // Message input
    placeholder: "Escreva sua mensagem...",
    send: "Enviar",
    switchToVoice: "Mudar para modo voz",

    // Errors
    error: "Desculpe, houve um erro.",
    tryAgain: "Por favor, tente novamente.",

    // Completion
    congratulations: "Parabéns!",
    completedConversation: "Você completou a conversa com sucesso!",
    returnHome: "Voltar ao Início",

    // Translation & Hide Text
    translate: "Traduzir",
    hideText: "Ocultar Texto",
    translating: "Traduzindo...",
  },
};

export function t(key: keyof typeof translations.en, lang: Language): string {
  return translations[lang][key] || translations.en[key];
}
