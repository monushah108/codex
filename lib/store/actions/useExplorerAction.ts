import * as ExplorerApi from "@/lib/api/explorerApi";
import { useExplorerstore } from "../Explorerstore";
import { ExplorerActions } from "../types";

export const useExplorerActions: ExplorerActions = {
  async loadFolder(roomId, parentId = "") {
    try {
      const data = await ExplorerApi.loadFolder(roomId, parentId);
      console.log(data);
      useExplorerstore.getState().loadFolder(data!);
      return data!;
    } catch (err) {
      console.log(err);
    }
  },

  async addFolder(roomId, parentId, name) {
    try {
      const data = await ExplorerApi.createFolder(roomId, parentId, name);

      useExplorerstore.getState().insertFolder(parentId, data!);

      return data!;
    } catch (err) {
      console.log(err);
    }
  },

  async addFile(roomId, parentId, name) {
    try {
      const data = await ExplorerApi.createFile(roomId, parentId, name);

      useExplorerstore.getState().insertFile(parentId, data!);

      return data!;
    } catch (err) {
      console.log(err);
    }
  },

  async renameFolder(roomId, parentId, folderId, newName) {
    try {
      await ExplorerApi.renameFolder(roomId, folderId, newName);
      useExplorerstore.getState().updateFolder(parentId, folderId, newName);
    } catch (err) {
      console.log(err);
    }
  },

  async renameFile(roomId, parentId, fileId, newName) {
    try {
      await ExplorerApi.renameFile(roomId, fileId, newName);
      useExplorerstore.getState().updateFile(parentId, fileId, newName);
    } catch (err) {
      console.log(err);
    }
  },

  async deleteFolder(roomId, parentId, folderId) {
    try {
      await ExplorerApi.deleteFolder(roomId, folderId);

      useExplorerstore.getState().removeFolder(parentId, folderId);
    } catch (err) {
      console.log(err);
    }
  },

  async deleteFile(roomId, parentId, fileId) {
    try {
      await ExplorerApi.deleteFile(roomId, fileId);

      useExplorerstore.getState().removeFile(parentId, fileId);
    } catch (err) {
      console.log(err);
    }
  },
};
