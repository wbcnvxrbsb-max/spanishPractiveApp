import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { toFile } from "groq-sdk/uploads";
import { getLanguage } from "@/lib/languages";
import type { TargetLanguage } from "@/lib/languages";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "Groq API key not configured" },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const targetLang = (formData.get("language") as string) || "es";
    const language = getLanguage(targetLang as TargetLanguage)?.whisperCode ?? targetLang;

    if (!file) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    // Convert to a format groq-sdk can handle
    const audioFile = await toFile(file, "recording.webm");

    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
      language,
    });

    return NextResponse.json({ text: transcription.text || "" });
  } catch (error) {
    console.error("STT error:", error);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}
