export type ApiResponse<T> = {
  status: number;
  data?: T;
  error?: string;
};
const jsonHeaders = {
  "Content-Type": "application/json",
};

async function request<T>(
  url: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const res = await fetch(url, options);

  if (!res.ok) {
    return {
      status: res.status,
      error: await res.text(),
    };
  }

  return {
    status: res.status,
    data: await res.json(),
  };
}

export async function createRoom(data) {
  return request<{ roomId: string }>("/api/playground", {
    method: "POST",
    headers: jsonHeaders,
    credentials: "include",
    body: JSON.stringify(data),
  });
}
