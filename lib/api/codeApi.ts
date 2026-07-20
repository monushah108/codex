// lib/api/code.ts

import { getType } from "../features";

const jsonHeaders = {
  "Content-Type": "application/json",
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Request failed");
  }

  return res.json();
}

/* -------------------------------------------------------------------------- */
/*                                    File                                    */
/* -------------------------------------------------------------------------- */

export async function fetchFile<T = unknown>(
  roomId: string,
  fileId: string,
): Promise<T> {
  return request<T>(`/api/playground/${roomId}/files?fileId=${fileId}`);
}

export async function persistFile<T = unknown>(
  roomId: string,
  fileId: string,
  content: string,
): Promise<T> {
  return request<T>(`/api/playground/${roomId}/files`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify({
      id: fileId,
      content,
    }),
  });
}

/* -------------------------------------------------------------------------- */
/*                                     AI                                     */
/* -------------------------------------------------------------------------- */

export async function requestGeneration<T = unknown>(
  prompt: string,
): Promise<T> {
  return request<T>("/api/ai", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({
      prompt,
    }),
  });
}

/* -------------------------------------------------------------------------- */
/*                                 Code Runner                                */
/* -------------------------------------------------------------------------- */

export async function executeCode<T = unknown>(
  filename: string,
  source: string,
): Promise<T> {
  const langId = getType(filename)?.id;

  if (!langId) {
    throw new Error("Unsupported language");
  }

  return request<T>(
    "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
    {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({
        source_code: source,
        language_id: langId,
      }),
    },
  );
}
