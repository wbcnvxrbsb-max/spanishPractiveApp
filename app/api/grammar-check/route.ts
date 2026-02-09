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

    const langName = targetLang === "pt" ? "Portuguese" : "Spanish";

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
- Keep the user's intended meaning
- Respond with ONLY the corrected sentence or CORRECT, nothing else
- No explanations, no extra text`,
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
