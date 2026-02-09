import { NextResponse } from "next/server";
import { EdgeTTS, Constants } from "@andresaya/edge-tts";

// Voice mapping for each language and gender
const VOICES: Record<string, Record<string, string>> = {
  es: {
    feminine: "es-MX-DaliaNeural",
    masculine: "es-MX-JorgeNeural",
  },
  pt: {
    feminine: "pt-BR-FranciscaNeural",
    masculine: "pt-BR-AntonioNeural",
  },
};

export async function POST(request: Request) {
  try {
    const { text, voice = "feminine", speed = 1.0, targetLang = "es" } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const lang = targetLang === "pt" ? "pt" : "es";
    const voiceName = VOICES[lang][voice] || VOICES[lang].feminine;

    // Convert speed (0.5-1.5) to Edge-TTS rate percentage (-50% to +50%)
    const ratePercent = Math.round((speed - 1) * 100);
    const rateStr = ratePercent >= 0 ? `+${ratePercent}%` : `${ratePercent}%`;

    const tts = new EdgeTTS();
    await tts.synthesize(text, voiceName, {
      rate: rateStr,
      outputFormat: Constants.OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3,
    });

    const audioBuffer = tts.toBuffer();
    const uint8Array = new Uint8Array(audioBuffer);

    return new NextResponse(uint8Array, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "TTS generation failed" },
      { status: 500 }
    );
  }
}
