// lib/api/codeApi.ts

import { AxiosError } from "axios";

import { getType } from "../features";
import { api } from "./client";

export type ApiError = {
  status: number;
  message: string;
  data?: unknown;
};

/* -------------------------------------------------------------------------- */
/*                                    File                                    */
/* -------------------------------------------------------------------------- */

export async function fetchFile<T>(roomId: string, fileId: string): Promise<T> {
  const { data } = await api.get<T>(`/api/playground/${roomId}/files`, {
    params: {
      fileId,
    },
  });

  return data;
}

export async function persistFile<T>(
  roomId: string,
  fileId: string,
  content: string,
): Promise<T> {
  const { data } = await api.put<T>(`/api/playground/${roomId}/files`, {
    id: fileId,
    content,
  });

  return data;
}

/* -------------------------------------------------------------------------- */
/*                                     AI                                     */
/* -------------------------------------------------------------------------- */

export async function requestGeneration<T>(prompt: string): Promise<T> {
  const { data } = await api.post<T>("/api/ai", {
    prompt,
  });

  return data;
}

/* -------------------------------------------------------------------------- */
/*                                 Code Runner                                */
/* -------------------------------------------------------------------------- */

export async function executeCode<T>(
  filename: string,
  source: string,
): Promise<T> {
  const langId = getType(filename)?.id;

  if (!langId) {
    throw {
      status: 400,
      message: "Unsupported language",
    };
  }

  const { data } = await api.post<T>(
    "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
    {
      source_code: source,
      language_id: langId,
    },
  );

  return data;
}
