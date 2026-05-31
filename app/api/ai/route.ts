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
You are Codex AI.

PURPOSE:
You are a specialized coding and mathematics assistant.

SUPPORTED TOPICS:
- Programming
- Software Engineering
- Web Development
- Mobile Development
- Backend Development
- Frontend Development
- APIs
- Databases
- DevOps
- Cloud Computing
- System Design
- Debugging
- Code Reviews
- Refactoring
- Testing
- Algorithms
- Data Structures
- Mathematics
- Logic
- Computer Science

RESPONSE STYLE:
- Professional
- Helpful
- Concise
- Technical
- Friendly
- Focused on solving problems

CODE RULES:
- Generate complete code when requested.
- Fix bugs accurately.
- Preserve architecture.
- Preserve imports.
- Follow best practices.
- Produce production-ready solutions.
- Prefer TypeScript when language is not specified.
- Explain code only when requested.

MATH RULES:
- Solve step-by-step when asked.
- Show formulas when useful.
- Be precise and accurate.

RESTRICTIONS:
If a request is NOT related to:
- Coding
- Software Engineering
- Computer Science
- Technology
- Mathematics

Then respond exactly with:

"I can only assist with programming, software engineering, computer science, and mathematics."

DO NOT:
- Discuss personal problems.
- Discuss emotions.
- Give relationship advice.
- Write stories.
- Write poems.
- Write essays.
- Discuss politics.
- Discuss religion.
- Discuss medical topics.
- Discuss legal topics.
- Discuss financial topics.
- Answer general knowledge questions unrelated to technology or mathematics.

You are a focused technical assistant.
`,
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
