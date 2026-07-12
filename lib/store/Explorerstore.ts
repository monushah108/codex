import { create } from "zustand";
import { useCodestore } from "./Codestore";

type FileItem = {
  _id: string;
  name: string;
  isEdited?: boolean;
  isDeleted?: boolean;
};

type FolderItem = {
  _id: string;
  name: string;
  isDeleted?: boolean;
};

type FolderChildren = {
  folders: FolderItem[];
  files: FileItem[];
  selectedFileId?: string;
  loaded: boolean;
  loading: boolean;
};

type ExplorerStore = {
  cache: Record<string, FolderChildren>;

  loadFolder: (
    roomId: string,
    parentId: string,
    force?: boolean,
  ) => Promise<void>;
  setSelectedFile: (parentId: string, fileId: string) => void;

  addFile: (roomId: string, parentId: string, name: string) => void;
  addFolder: (roomId: string, parentId: string, name: string) => void;

  renameFile: (
    roomId: string,
    parentId: string,
    fileId: string,
    newName: string,
  ) => void;
  renameFolder: (
    roomId: string,
    parentId: string,
    folderId: string,
    newName: string,
  ) => void;

  deleteFile: (roomId: string, parentId: string, fileId: string) => void;
  deleteFolder: (roomId: string, parentId: string, folderId: string) => void;
};

export const useExplorerstore = create<ExplorerStore>((set, get) => ({
  cache: {},

  /* ---------------- LOAD FOLDER ---------------- */

  loadFolder: async (roomId, parentId, force = false) => {
    const cache = get().cache[parentId];

    if (!force && cache?.loaded) return;

    set((state) => ({
      cache: {
        ...state.cache,
        [parentId]: {
          ...(state.cache[parentId] || {}),
          loading: true,
        },
      },
    }));

    try {
      const res = await fetch(
        `/api/playground/${roomId}/directory?parentId=${parentId}`,
      );

      const data = await res.json();

      set((state) => ({
        cache: {
          ...state.cache,
          [parentId]: {
            folders: data.folders || [],
            files: data.files || [],
            loaded: true,
            loading: false,
          },
        },
      }));
    } catch (err) {
      console.error(err);

      set((state) => ({
        cache: {
          ...state.cache,
          [parentId]: {
            ...state.cache[parentId],
            loading: false,
          },
        },
      }));
    }
  },

  /* ---------------- SELECT FILE ---------------- */

  setSelectedFile: (parentId, fileId) =>
    set((state) => ({
      cache: {
        ...state.cache,
        [parentId]: {
          ...state.cache[parentId],
          selectedFileId: fileId,
        },
      },
    })),

  /* ---------------- ADD ---------------- */

  addFile: async (roomId, parentId, name) => {
    const endpoint = `/api/playground/${roomId}/files`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        parentId,
      }),
    });

    const file = await res.json();

    set((state) => ({
      cache: {
        ...state.cache,
        [parentId]: {
          ...state.cache[parentId],
          files: [...(state.cache[parentId]?.files || []), file],
        },
      },
    }));
  },

  addFolder: async (roomId, parentId, name) => {
    const endpoint = `/api/playground/${roomId}/directory`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        parentId,
      }),
    });

    const folder = await res.json();
    set((state) => ({
      cache: {
        ...state.cache,
        [parentId]: {
          ...state.cache[parentId],
          folders: [...(state.cache[parentId]?.folders || []), folder],
        },
      },
    }));
  },
  /* ---------------- RENAME ---------------- */

  renameFile: async (roomId, parentId, fileId, newName) => {
    const endpoint = `/api/playground/${roomId}/files`;

    await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: fileId,
        name: newName,
      }),
    });
    set((state) => {
      const codestore = useCodestore.getState();

      const updatedOpenFiles = codestore.openFiles.map((f) =>
        f._id === fileId ? { ...f, name: newName } : f,
      );

      useCodestore.setState({
        openFiles: updatedOpenFiles,
      });
      return {
        cache: {
          ...state.cache,
          [parentId]: {
            ...state.cache[parentId],
            files:
              state.cache[parentId]?.files.map((f) =>
                f._id === fileId ? { ...f, name: newName } : f,
              ) || [],
          },
        },
      };
    });
  },

  renameFolder: async (roomId, parentId, folderId, newName) => {
    const endpoint = `/api/playground/${roomId}/directory`;

    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: folderId,
        name: newName,
      }),
    });
    const folder = await res.json();

    set((state) => {
      return {
        cache: {
          ...state.cache,
          [parentId]: {
            ...state.cache[parentId],
            folders:
              state.cache[parentId]?.folders.map((f) =>
                f._id === folderId ? folder : f,
              ) || [],
          },
        },
      };
    });
  },

  /* ---------------- DELETE ---------------- */

  deleteFile: async (roomId, parentId, fileId) => {
    const endpoint = `/api/playground/${roomId}/files`;

    await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: fileId }),
    });
    set((state) => {
      const codestore = useCodestore.getState();
      codestore.closeFile(fileId);
      delete codestore.code[fileId];
      return {
        cache: {
          ...state.cache,
          [parentId]: {
            ...state.cache[parentId],
            files:
              state.cache[parentId]?.files.filter((f) => f._id !== fileId) ||
              [],
          },
        },
      };
    });
  },

  deleteFolder: async (roomId, parentId, folderId) => {
    const endpoint = `/api/playground/${roomId}/directory`;

    await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: folderId }),
    });
    set((state) => {
      const newCache = { ...state.cache };
      const codestore = useCodestore.getState();

      function removeFolderRecursively(id: string) {
        const currentFolder = newCache[id];

        if (!currentFolder) return;

        // Close and remove files from CodeStore
        currentFolder.files.forEach((file) => {
          codestore.closeFile(file._id);
          delete codestore.code[file._id];
        });

        // Delete child folders first
        currentFolder.folders.forEach((folder) => {
          removeFolderRecursively(folder._id);
        });

        // Delete this folder from cache
        delete newCache[id];
      }

      // Remove all descendants
      removeFolderRecursively(folderId);

      // Remove folder reference from parent
      newCache[parentId] = {
        ...newCache[parentId],
        folders:
          newCache[parentId]?.folders.filter((f) => f._id !== folderId) || [],
      };

      return {
        cache: newCache,
      };
    });
  },
}));

/* TODO : RENAMING and DELETING folders are not working  */
