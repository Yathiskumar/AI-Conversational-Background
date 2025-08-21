import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Replace with your ElevenLabs Voice ID

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text: "Hello, this is a test from ElevenLabs.",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
