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
        },

        body: JSON.stringify({
          model: "qwen/qwen3-coder:free",

          messages: [
            {
              role: "system",

              content: `
You are an expert software engineer.

STRICT RULES:
- Return ONLY raw code
- No markdown
- No explanation
- No \`\`\`
- Return complete valid file
- Preserve architecture
- Do not omit imports
- Do not truncate code
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

    const code = data?.choices?.[0]?.message?.content || "";

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
