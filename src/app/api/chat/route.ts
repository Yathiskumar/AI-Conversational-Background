import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY is not set" }, { status: 500 });
    }

    const groq = new Groq({ apiKey });

    const { question } = await req.json();

    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192", // free + fast
      messages: [
        { role: "system", content: "You are a friendly English tutor for kids aged 6-16. Always reply in simple, encouraging language." },
        { role: "user", content: question },
      ],
    });

    return NextResponse.json({ answer: response.choices[0]?.message?.content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
