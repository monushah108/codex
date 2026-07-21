// lib/api/explorer.ts

import { FileItem, FolderItem } from "../store/types";

import { api } from "./client";

export type FolderResponse = {
  folders: FolderItem[];
  files: FileItem[];
};

/* -------------------------------------------------------------------------- */
/*                                   Folder                                   */
/* -------------------------------------------------------------------------- */

export async function loadFolder(
  roomId: string,
  parentId?: string,
): Promise<FolderResponse> {
  const { data } = await api.get<FolderResponse>(
    `/api/playground/${roomId}/directory`,
    {
      params: parentId ? { parentId } : undefined,
      withCredentials: true,
    },
  );

  return data;
}

export async function createFolder(
  roomId: string,
  parentId: string,
  name: string,
): Promise<FolderItem> {
  const { data } = await api.post<FolderItem>(
    `/api/playground/${roomId}/directory`,
    {
      parentId,
      name,
    },
    {
      withCredentials: true,
    },
  );

  return data;
}

export async function renameFolder(
  roomId: string,
  folderId: string,
  name: string,
): Promise<FolderItem> {
  const { data } = await api.patch<FolderItem>(
    `/api/playground/${roomId}/directory`,
    {
      id: folderId,
      name,
    },
    {
      withCredentials: true,
    },
  );

  return data;
}

export async function deleteFolder(
  roomId: string,
  folderId: string,
): Promise<void> {
  await api.delete(`/api/playground/${roomId}/directory`, {
    withCredentials: true,
    data: {
      id: folderId,
    },
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
  const { data } = await api.post<FileItem>(
    `/api/playground/${roomId}/files`,
    {
      parentId,
      name,
    },
    {
      withCredentials: true,
    },
  );

  return data;
}

export async function renameFile(
  roomId: string,
  fileId: string,
  name: string,
): Promise<FileItem> {
  const { data } = await api.patch<FileItem>(
    `/api/playground/${roomId}/files`,
    {
      id: fileId,
      name,
    },
    {
      withCredentials: true,
    },
  );

  return data;
}

export async function deleteFile(
  roomId: string,
  fileId: string,
): Promise<void> {
  await api.delete(`/api/playground/${roomId}/files`, {
    withCredentials: true,
    data: {
      id: fileId,
    },
  });
}
