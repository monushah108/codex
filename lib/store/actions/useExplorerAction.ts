// lib/useExplorer
import * as ExplorerApi from "@/lib/api/explorerApi";
import { useExplorerstore } from "../Explorerstore";
import { ExplorerActions } from "../types";

export const useExplorerActions: ExplorerActions = {
  loadFolder: async (roomId, parentId, force) => {
    const data = await ExplorerApi.loadFolder(roomId, parentId);
    useExplorerstore.getState().loadFolder(roomId, parentId, data, force);
    return data;
  },
  addFolder: async (roomId, parentId, name) => {
    const folder = await ExplorerApi.createFolder(roomId, parentId, name);
    useExplorerstore.getState().insertFolder(parentId, folder);
    return folder;
  },

  addFile: async (roomId, parentId, name) => {
    const file = await ExplorerApi.createFile(roomId, parentId, name);
    useExplorerstore.getState().insertFile(parentId, file);
    return file;
  },

  renameFile: async (roomId, parentId, fileId, newName) => {
    await ExplorerApi.renameFile(roomId, fileId, newName);
    useExplorerstore.getState().updateFile(parentId, fileId, newName);
  },

  renameFolder: async (roomId, parentId, folderId, newName) => {
    await ExplorerApi.renameFolder(roomId, folderId, newName);
    useExplorerstore.getState().updateFolder(parentId, folderId, newName);
  },

  deleteFile: async (roomId, parentId, fileId) => {
    await ExplorerApi.deleteFile(roomId, fileId);
    useExplorerstore.getState().removeFile(parentId, fileId);
  },

  deleteFolder: async (roomId, parentId, folderId) => {
    await ExplorerApi.deleteFolder(roomId, folderId);
    useExplorerstore.getState().removeFolder(parentId, folderId);
  },
};
