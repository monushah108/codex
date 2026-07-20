import * as ExplorerApi from "@/lib/api/explorerApi";
import { useExplorerstore } from "../Explorerstore";
import { ExplorerActions } from "../types";

export const useExplorerActions: ExplorerActions = {
  async loadFolder(roomId, parentId = "") {
    const res = await ExplorerApi.loadFolder(roomId, parentId);

    if (res.error) {
      throw new Error(res.error);
    }

    useExplorerstore.getState().loadFolder(res.data!);

    return res.data!;
  },

  async addFolder(roomId, parentId, name) {
    const res = await ExplorerApi.createFolder(roomId, parentId, name);

    if (res.error) {
      throw new Error(res.error);
    }

    useExplorerstore.getState().insertFolder(parentId, res.data!);

    return res.data!;
  },

  async addFile(roomId, parentId, name) {
    const res = await ExplorerApi.createFile(roomId, parentId, name);

    if (res.error) {
      throw new Error(res.error);
    }

    useExplorerstore.getState().insertFile(parentId, res.data!);

    return res.data!;
  },

  async renameFolder(roomId, parentId, folderId, newName) {
    const res = await ExplorerApi.renameFolder(roomId, folderId, newName);

    if (res.error) {
      throw new Error(res.error);
    }

    useExplorerstore.getState().updateFolder(parentId, folderId, newName);
  },

  async renameFile(roomId, parentId, fileId, newName) {
    const res = await ExplorerApi.renameFile(roomId, fileId, newName);

    if (res.error) {
      throw new Error(res.error);
    }

    useExplorerstore.getState().updateFile(parentId, fileId, newName);
  },

  async deleteFolder(roomId, parentId, folderId) {
    await ExplorerApi.deleteFolder(roomId, folderId);

    useExplorerstore.getState().removeFolder(parentId, folderId);
  },

  async deleteFile(roomId, parentId, fileId) {
    await ExplorerApi.deleteFile(roomId, fileId);

    useExplorerstore.getState().removeFile(parentId, fileId);
  },
};
