import { NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const VOICES = {
  feminine: "EXAVITQu4vr4xnSDxMaL", // Sarah
  masculine: "TX3LPaxmHKxFdv7VOQHJ", // Liam
};

export async function POST(request: Request) {
  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json(
      { error: "ElevenLabs API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { text, voice = "feminine", speed = 1.0 } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const voiceId = voice === "masculine" ? VOICES.masculine : VOICES.feminine;

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            speed: Math.max(0.5, Math.min(1.0, speed)),
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("ElevenLabs TTS error:", error);
      return NextResponse.json(
        { error: "TTS generation failed" },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
