import Groq from "groq-sdk";
import { getSystemPrompt, Scenario, ComplexityLevel, WordCount, TargetLanguage } from "@/lib/prompts";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages, scenario, complexity, wordCount, targetLang, scenarioVariation } = await request.json();

    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = getSystemPrompt(
      scenario as Scenario || "free_chat",
      (complexity as ComplexityLevel) || 3,
      (wordCount as WordCount) || "medium",
      (targetLang as TargetLanguage) || "es",
      scenarioVariation
    );

    // Format messages for Groq (OpenAI-compatible format)
    const groqMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        ...groqMessages,
      ],
    });

    const assistantMessage = response.choices[0]?.message?.content || "";

    return Response.json({ message: assistantMessage });
  } catch (error) {
    console.error("Error calling Groq API:", error);
    return Response.json(
      { error: "Failed to get response from AI" },
      { status: 500 }
    );
  }
}
