import { create } from "zustand";

type FileItem = {
  _id: string;
  name: string;
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

  /* IDE FILE STATE */

  openFiles: FileItem[];
  activeFileId: string | null;

  openFile: (file: FileItem) => void;
  closeFile: (fileId: string) => void;
  setActiveFile: (fileId: string) => void;

  /* DIRECTORY */

  loadFolder: (roomId: string, parentId: string) => Promise<void>;
  setSelectedFile: (parentId: string, fileId: string) => void;

  /* CRUD */

  addFile: (parentId: string, file: FileItem) => void;
  addFolder: (parentId: string, folder: FolderItem) => void;

  renameFile: (parentId: string, fileId: string, newName: string) => void;
  renameFolder: (parentId: string, folderId: string, newName: string) => void;

  deleteFile: (parentId: string, fileId: string) => void;
  deleteFolder: (parentId: string, folderId: string) => void;
};

export const useExplorerstore = create<ExplorerStore>((set, get) => ({
  cache: {},

  /* ---------------- OPEN FILES ---------------- */

  openFiles: [],
  activeFileId: null,

  openFile: (file) =>
    set((state) => {
      const exists = state.openFiles.find((f) => f._id === file._id);

      if (exists) {
        return { activeFileId: file._id };
      }

      return {
        openFiles: [...state.openFiles, file],
        activeFileId: file._id,
      };
    }),

  closeFile: (fileId) =>
    set((state) => {
      const newFiles = state.openFiles.filter((f) => f._id !== fileId);

      return {
        openFiles: newFiles,
        activeFileId:
          state.activeFileId === fileId
            ? newFiles.length
              ? newFiles[newFiles.length - 1]._id
              : null
            : state.activeFileId,
      };
    }),

  setActiveFile: (fileId) => set({ activeFileId: fileId }),

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
      const res = await fetch(`/api/directory/${roomId}?parentId=${parentId}`);
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
    set((state) => ({
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
      openFiles: state.openFiles.map((f) =>
        f._id === fileId ? { ...f, name: newName } : f,
      ),
    })),

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
    set((state) => ({
      cache: {
        ...state.cache,
        [parentId]: {
          ...state.cache[parentId],
          files:
            state.cache[parentId]?.files.filter((f) => f._id !== fileId) || [],
        },
      },
      openFiles: state.openFiles.filter((f) => f._id !== fileId),
    })),

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
