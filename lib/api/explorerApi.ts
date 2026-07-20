// lib/api/explorer.ts

import { FileItem, FolderItem } from "../store/types";

export type FolderResponse = {
  folders: FolderItem[];
  files: FileItem[];
};

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

/* -------------------------------------------------------------------------- */
/*                                   Folder                                   */
/* -------------------------------------------------------------------------- */

export async function loadFolder(
  roomId: string,
  parentId: string,
): Promise<ApiResponse<FolderResponse>> {
  const url = parentId
    ? `/api/playground/${roomId}/directory?parentId=${parentId}`
    : `/api/playground/${roomId}/directory`;

  return request<FolderResponse>(url, {
    credentials: "include",
  });
}

export async function createFolder(
  roomId: string,
  parentId: string,
  name: string,
): Promise<ApiResponse<FolderItem>> {
  return request<FolderItem>(`/api/playground/${roomId}/directory`, {
    method: "POST",
    headers: jsonHeaders,
    credentials: "include",
    body: JSON.stringify({
      parentId,
      name,
    }),
  });
}

export async function renameFolder(
  roomId: string,
  folderId: string,
  name: string,
): Promise<ApiResponse<FolderItem>> {
  return request<FolderItem>(`/api/playground/${roomId}/directory`, {
    method: "PATCH",
    headers: jsonHeaders,
    credentials: "include",
    body: JSON.stringify({
      id: folderId,
      name,
    }),
  });
}

export async function deleteFolder(
  roomId: string,
  folderId: string,
): Promise<void> {
  await request(`/api/playground/${roomId}/directory`, {
    method: "DELETE",
    headers: jsonHeaders,
    credentials: "include",
    body: JSON.stringify({
      id: folderId,
    }),
  });
}

/* -------------------------------------------------------------------------- */
/*                                    File                                    */
/* -------------------------------------------------------------------------- */

export async function createFile(
  roomId: string,
  parentId: string,
  name: string,
): Promise<ApiResponse<FileItem>> {
  return request<FileItem>(`/api/playground/${roomId}/files`, {
    method: "POST",
    headers: jsonHeaders,
    credentials: "include",
    body: JSON.stringify({
      parentId,
      name,
    }),
  });
}

export async function renameFile(
  roomId: string,
  fileId: string,
  name: string,
): Promise<ApiResponse<FileItem>> {
  return request<FileItem>(`/api/playground/${roomId}/files`, {
    method: "PATCH",
    headers: jsonHeaders,
    credentials: "include",
    body: JSON.stringify({
      id: fileId,
      name,
    }),
  });
}

export async function deleteFile(
  roomId: string,
  fileId: string,
): Promise<void> {
  await request(`/api/playground/${roomId}/files`, {
    method: "DELETE",
    headers: jsonHeaders,
    credentials: "include",
    body: JSON.stringify({
      id: fileId,
    }),
  });
}
