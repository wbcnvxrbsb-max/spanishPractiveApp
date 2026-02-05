import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text, targetLang } = await request.json();

    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const langNames: Record<string, string> = {
      en: "English",
      es: "Spanish",
      pt: "Portuguese",
    };

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 512,
      messages: [
        {
          role: "system",
          content: `You are a translator. Translate the following text to ${langNames[targetLang] || "English"}. Only output the translation, nothing else. Do not add quotes or explanations.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const translation = response.choices[0]?.message?.content || "";

    return Response.json({ translation: translation.trim() });
  } catch (error) {
    console.error("Error translating:", error);
    return Response.json(
      { error: "Failed to translate" },
      { status: 500 }
    );
  }
}
