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
  loaded: boolean;
  loading: boolean;
};

type ExplorerStore = {
  cache: Record<string, FolderChildren>;

  loadFolder: (roomId: string, parentId: string) => Promise<void>;
  addFile: (parentId: string, file: FileItem) => void;
  addFolder: (parentId: string, folder: FolderItem) => void;
};

export const useFilestore = create<ExplorerStore>((set, get) => ({
  cache: {},

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
}));
