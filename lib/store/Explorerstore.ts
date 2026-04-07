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

  loadFolder: (roomId: string, parentId: string) => Promise<void>;
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

  loadFolder: async (roomId, parentId) => {
    const cache = get().cache[parentId];

    if (cache?.loaded) return;

    set((state) => ({
      cache: {
        ...state.cache,
        [parentId]: {
          folders: [],
          files: [],
          loaded: false,
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

  addFolder: (parentId, folder) =>
    set((state) => ({
      cache: {
        ...state.cache,
        [parentId]: {
          ...state.cache[parentId],
          folders: [...(state.cache[parentId]?.folders || []), folder],
        },
      },
    })),

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
    set((state) => ({
      cache: {
        ...state.cache,
        [parentId]: {
          ...state.cache[parentId],
          folders:
            state.cache[parentId]?.folders.filter((f) => f._id !== folderId) ||
            [],
        },
      },
    })),
}));
