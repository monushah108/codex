import { getType } from "../features";

export async function loadFile(roomId: string, fileId: string) {
  const res = await fetch(`/api/playground/${roomId}/files?fileId=${fileId}`);

  if (!res.ok) {
    throw new Error("Failed to load file");
  }

  return res.json();
}

export async function saveFile(
  roomId: string,
  fileId: string,
  content: string,
) {
  const res = await fetch(`/api/playground/${roomId}/files`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: fileId,
      content,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to save file");
  }

  return res.json();
}

export async function generateCode(prompt: string, content: string) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      content,
    }),
  });

  if (!res.ok) {
    throw new Error("Generation failed");
  }

  return res.json();
}

export async function runCode(filename: string, source: string) {
  const langId = getType(filename)?.id;

  if (!langId) {
    throw new Error("Unsupported language");
  }

  const res = await fetch(
    "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_code: source,
        language_id: langId,
      }),
    },
  );

  return res.json();
}
