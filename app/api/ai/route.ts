import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, content } = await req.json();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Codex",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-v4-flash:free",

          reasoning: {
            enabled: true,
          },

          messages: [
            {
              role: "system",
              content: `
You are an expert software engineer.

STRICT RULES:
- Return ONLY code
- No markdown
- No explanations
- No code fences
- Return complete code
- Preserve imports
- Preserve architecture
`,
            },

            {
              role: "user",
              content: `
CURRENT FILE:

${content}

TASK:

${prompt}
`,
            },
          ],
        }),
      },
    );

    const data = await response.json();

    console.log("STATUS:", response.status);
    console.log("DATA:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error ?? "OpenRouter Error",
        },
        {
          status: response.status,
        },
      );
    }

    const code = data?.choices?.[0]?.message?.content;

    if (!code) {
      return NextResponse.json(
        {
          error: "Empty response from model",
          raw: data,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      code,
    });
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
