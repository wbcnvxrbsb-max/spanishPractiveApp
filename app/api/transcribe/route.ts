import { NextResponse } from "next/server";

const ELEVENLABS_STT_API_KEY = process.env.ELEVENLABS_STT_API_KEY;

export async function POST(request: Request) {
  if (!ELEVENLABS_STT_API_KEY) {
    return NextResponse.json(
      { error: "ElevenLabs STT API key not configured" },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const language = formData.get("language") as string || "es";

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    // Map target language to ElevenLabs language code
    const languageCode = language === "pt" ? "pt" : "es";

    // Create form data for ElevenLabs
    const elevenLabsFormData = new FormData();
    elevenLabsFormData.append("file", audioFile);
    elevenLabsFormData.append("model_id", "scribe_v1");
    elevenLabsFormData.append("language_code", languageCode);

    const response = await fetch(
      "https://api.elevenlabs.io/v1/speech-to-text",
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_STT_API_KEY,
        },
        body: elevenLabsFormData,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("ElevenLabs STT error:", error);
      return NextResponse.json(
        { error: "Transcription failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
