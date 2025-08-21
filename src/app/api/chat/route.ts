import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192", // free + fast
      messages: [
        { role: "system", content: "You are a friendly English tutor for kids aged 6-16. Always reply in simple, encouraging language." },
        { role: "user", content: question },
      ],
    });

    return NextResponse.json({ answer: response.choices[0]?.message?.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
