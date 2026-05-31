import { NextRequest, NextResponse } from "next/server";

const MODELS = ["openai/gpt-oss-120b:free", "deepseek/deepseek-v4-flash:free"];

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    let lastError: unknown = null;

    for (const model of MODELS) {
      try {
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "http://localhost:3000",
              "X-Title": "chat-codex",
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: "system",
                  content: `
You are an expert software engineer.

RULES:
- Return only the final code.
- No markdown.
- No explanations.
- No code fences.
- Keep imports.
- Keep architecture.
- Produce production-ready code.
- If modifying code, return the full updated code.
                  `.trim(),
                },
                {
                  role: "user",
                  content: message,
                },
              ],
            }),
          },
        );

        const data = await response.json();

        console.log(`Model: ${model}`);
        console.log("Status:", response.status);

        if (!response.ok) {
          lastError = data;
          continue;
        }

        const content = data?.choices?.[0]?.message?.content?.trim();

        if (!content) {
          lastError = "Empty model response";
          continue;
        }

        return NextResponse.json({
          response: content,
          model,
        });
      } catch (err) {
        lastError = err;
      }
    }

    return NextResponse.json(
      {
        error: "All models failed",
        details: lastError,
      },
      {
        status: 500,
      },
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Failed to generate code",
      },
      {
        status: 500,
      },
    );
  }
}
