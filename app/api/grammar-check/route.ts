import Groq from "groq-sdk";
import { getLanguage } from "@/lib/languages";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text, targetLang, conversationContext } = await request.json();

    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const langName = getLanguage(targetLang)?.name ?? "Spanish";

    let contextBlock = "";
    if (conversationContext && conversationContext.length > 0) {
      const recent = conversationContext.slice(-6);
      contextBlock = "\n\nConversation context (use this to understand what the learner is trying to say):\n" +
        recent.map((m: {role: string; content: string}) => `${m.role}: ${m.content}`).join("\n");
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 256,
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `You are a grammar and spelling checker for a ${langName} language learner.

If the sentence is grammatically correct and has no spelling errors, respond with EXACTLY:
CORRECT

If there are errors, respond with the corrected sentence. Wrap ONLY the changed/corrected words in double asterisks like **this**.

Rules:
- Only fix grammar and spelling errors in ${langName}
- Do NOT change correct words
- Do NOT add words unless grammatically necessary
- Do NOT rewrite the sentence in a different style
- Use the conversation context to understand the learner's INTENT — fix words to match what they clearly meant to say
- For example, if the bot asked "¿Cómo te llamas?" and the user wrote "me amo", correct it to "me **llamo**"
- Keep the user's intended meaning
- Respond with ONLY the corrected sentence or CORRECT, nothing else
- No explanations, no extra text${contextBlock}`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const result = response.choices[0]?.message?.content?.trim() || "";

    if (result === "CORRECT" || result === "") {
      return Response.json({ correction: null });
    }

    return Response.json({ correction: result });
  } catch (error) {
    console.error("Grammar check error:", error);
    return Response.json(
      { error: "Failed to check grammar" },
      { status: 500 }
    );
  }
}
