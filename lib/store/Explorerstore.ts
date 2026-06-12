import { create } from "zustand";
import { useCodestore } from "./Codestore";

type FileItem = {
  _id: string;
  name: string;
  isEdited?: boolean;
};

type FolderItem = {
  _id: string;
  name: string;
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

  addFile: (parentId: string, file: FileItem) => void;
  addFolder: (parentId: string, folder: FolderItem) => void;

  renameFile: (parentId: string, fileId: string, newName: string) => void;
  renameFolder: (parentId: string, folderId: string, newName: string) => void;

  deleteFile: (parentId: string, fileId: string) => void;
  deleteFolder: (parentId: string, folderId: string) => void;
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

  addFile: (parentId, file) =>
    set((state) => ({
      cache: {
        ...state.cache,
        [parentId]: {
          ...state.cache[parentId],
          files: [...(state.cache[parentId]?.files || []), file],
        },
      },
    })),

  addFolder: (parentId, folder) => {
    console.log(get().cache[parentId]);
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

  renameFile: (parentId, fileId, newName) =>
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
    }),

  renameFolder: (parentId, folderId, newName) =>
    set((state) => ({
      cache: {
        ...state.cache,
        [parentId]: {
          ...state.cache[parentId],
          folders:
            state.cache[parentId]?.folders.map((f) =>
              f._id === folderId ? { ...f, name: newName } : f,
            ) || [],
        },
      },
    })),

  /* ---------------- DELETE ---------------- */

  deleteFile: (parentId, fileId) =>
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
    }),

  deleteFolder: (parentId, folderId) =>
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
    }),
}));
