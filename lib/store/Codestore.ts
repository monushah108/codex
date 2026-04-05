import { create } from "zustand";

type FileItem = {
  _id: string;
  name: string;
  isEdited?: boolean;
};

type Codestore = {
  code: Record<string, { loaded: boolean; loading: boolean; content?: string }>;
  openFiles: FileItem[];
  activeFileId: string | null;

  loadFileContent: (roomId: string, fileId: string) => Promise<void>;
  openFile: (file: FileItem) => void;
  closeFile: (fileId: string) => void;
  setActiveFile: (fileId: string) => void;
  setFileEdited: (fileId: string, edited: boolean) => void;
  saveFileContent: (
    roomId: string,
    fileId: string,
    content: string,
  ) => Promise<void>;
};

export const useCodestore = create<Codestore>((set, get) => ({
  code: {},

  openFiles: [],
  activeFileId: null,

  openFile: (file) =>
    set((state) => {
      const exists = state.openFiles.find((f) => f._id === file._id);

      if (exists) {
        return { activeFileId: file._id };
      }

      return {
        openFiles: [...state.openFiles, { ...file, isEdited: false }],
        activeFileId: file._id,
      };
    }),

  closeFile: (fileId) =>
    set((state) => {
      const newFiles = state.openFiles.filter((f) => f._id !== fileId);

      let newActive = state.activeFileId;

      if (state.activeFileId === fileId) {
        newActive = newFiles.length ? newFiles[newFiles.length - 1]._id : null;
      }

      return {
        openFiles: [...newFiles],
        activeFileId: newActive,
      };
    }),

  setActiveFile: (fileId) => set({ activeFileId: fileId }),

  setFileEdited: (fileId, edited) => {
    set((state) => ({
      openFiles: state.openFiles.map((f) =>
        f._id === fileId ? { ...f, isEdited: edited } : f,
      ),
    }));
  },

  loadFileContent: async (roomId, fileId) => {
    const cache = get().code[fileId];

    if (cache?.loaded) return;

    set((state) => ({
      code: {
        ...state.code,
        [fileId]: {
          content: "",
          loaded: false,
          loading: true,
        },
      },
    }));

    try {
      const res = await fetch(
        `/api/playground/${roomId}/files?fileId=${fileId}`,
      );

      const data = await res.json();

      set((state) => ({
        code: {
          ...state.code,
          [fileId]: {
            content: data?.content,
            loaded: true,
            loading: false,
          },
        },
      }));
    } catch (err) {
      console.error(err);

      set((state) => ({
        code: {
          ...state.code,
          [fileId]: {
            ...state.code[fileId],
            loading: false,
          },
        },
      }));
    }
  },

  saveFileContent: async (roomId, fileId, content) => {
    try {
      const res = await fetch(`/api/playground/${roomId}/files`, {
        method: "PUT",
        body: JSON.stringify({ id: fileId, content }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      set((state) => ({
        code: {
          ...state.code,
          [fileId]: {
            content: data.content,
            loaded: true,
            loading: false,
          },
        },
      }));
    } catch (err) {
      console.error(err);
      set((state) => ({
        code: {
          ...state.code,
          [fileId]: {
            ...state.code[fileId],
            loading: false,
          },
        },
      }));
    }
  },
}));
