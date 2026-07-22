import * as ExplorerApi from "@/lib/api/explorerApi";
import { useExplorerstore } from "../Explorerstore";
import { ExplorerActions } from "../types";

export const useExplorerActions: ExplorerActions = {
  async loadFolder(roomId, parentId = "") {
    console.log("loadFolder called", parentId);
    const store = useExplorerstore.getState();

    store.setLoading(parentId, true);
    try {
      const data = await ExplorerApi.loadFolder(roomId, parentId);
      store.loadFolder(data!);
      store.setLoading(parentId, false);
      return data!;
    } catch (err) {
      store.setError(parentId, err.message);
    }
  },

  async addFolder(roomId, parentId, name) {
    const store = useExplorerstore.getState();
    try {
      const data = await ExplorerApi.createFolder(roomId, parentId, name);

      store.insertFolder(parentId, data!);

      return data!;
    } catch (err) {
      store.setError(parentId, err.message);
    } finally {
      store.setLoading(parentId, false);
    }
  },

  async addFile(roomId, parentId, name) {
    const store = useExplorerstore.getState();
    try {
      const data = await ExplorerApi.createFile(roomId, parentId, name);

      store.insertFile(parentId, data!);

      return data!;
    } catch (err) {
      console.log(err);
      store.setError(parentId, err.message);
    }
  },

  async renameFolder(roomId, parentId, folderId, newName) {
    const store = useExplorerstore.getState();
    try {
      await ExplorerApi.renameFolder(roomId, folderId, newName);
      store.updateFolder(parentId, folderId, newName);
    } catch (err) {
      console.log(err);
      store.setError(parentId, err.message);
    }
  },

  async renameFile(roomId, parentId, fileId, newName) {
    const store = useExplorerstore.getState();
    try {
      await ExplorerApi.renameFile(roomId, fileId, newName);
      store.updateFile(parentId, fileId, newName);
    } catch (err) {
      console.log(err);
      store.setError(parentId, err.message);
    }
  },

  async deleteFolder(roomId, parentId, folderId) {
    const store = useExplorerstore.getState();
    try {
      await ExplorerApi.deleteFolder(roomId, folderId);

      store.removeFolder(parentId, folderId);
    } catch (err) {
      console.log(err);
      store.setError(parentId, err.message);
    }
  },

  async deleteFile(roomId, parentId, fileId) {
    const store = useExplorerstore.getState();
    try {
      await ExplorerApi.deleteFile(roomId, fileId);

      store.removeFile(parentId, fileId);
    } catch (err) {
      store.setError(parentId, err.message);
    }
  },
};

// TODO: file loading happing wrong way
