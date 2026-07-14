// lib/api/explorer.ts

import { FileItem, FolderItem } from "../store/types";

export type FolderResponse = {
  folders: FolderItem[];
  files: FileItem[];
};

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
/*                                   Folder                                   */
/* -------------------------------------------------------------------------- */

export async function loadFolder(
  roomId: string,
  parentId: string,
): Promise<FolderResponse> {
  return request<FolderResponse>(
    `/api/playground/${roomId}/directory?parentId=${parentId}`,
  );
}

export async function createFolder(
  roomId: string,
  parentId: string,
  name: string,
): Promise<FolderItem> {
  return request<FolderItem>(`/api/playground/${roomId}/directory`, {
    method: "POST",
    headers: jsonHeaders,
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
): Promise<FolderItem> {
  return request<FolderItem>(`/api/playground/${roomId}/directory`, {
    method: "PATCH",
    headers: jsonHeaders,
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
): Promise<FileItem> {
  return request<FileItem>(`/api/playground/${roomId}/files`, {
    method: "POST",
    headers: jsonHeaders,
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
): Promise<FileItem> {
  return request<FileItem>(`/api/playground/${roomId}/files`, {
    method: "PATCH",
    headers: jsonHeaders,
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
    body: JSON.stringify({
      id: fileId,
    }),
  });
}
