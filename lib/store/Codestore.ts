import { create } from "zustand";

type FileItem = {
  _id: string;
  name: string;
  isEdited?: boolean;
};

type Output = {
  id: string;
  output: string;
  error?: boolean;
};

type Store = {
  code: Record<string, any>;
  openFiles: FileItem[];
  activeFileId: string | null;
  outputs: Output[];

  openFile: (file: FileItem, roomId: string) => Promise<void>;

  closeFile: (fileId: string) => void;

  setActiveFile: (fileId: string) => void;

  setFileEdited: (fileId: string, edited: boolean) => void;

  updateContent: (fileId: string, content: string) => void;

  loadFileContent: (roomId: string, fileId: string) => Promise<void>;

  saveFileContent: (
    roomId: string,
    fileId: string,
    content: string,
  ) => Promise<void>;
};

export const useCodestore = create<Store>((set, get) => {
  const updateCode = (fileId: string, data: any) =>
    set((s) => ({
      code: {
        ...s.code,
        [fileId]: {
          ...s.code[fileId],
          ...data,
        },
      },
    }));

  return {
    code: {},
    openFiles: [],
    outputs: [],
    activeFileId: null,

    // OPEN FILE
    openFile: async (file, roomId) => {
      set((s) => ({
        activeFileId: file._id,

        openFiles: s.openFiles.some((f) => f._id === file._id)
          ? s.openFiles
          : [
              ...s.openFiles,
              {
                ...file,
                isEdited: false,
              },
            ],
      }));

      await get().loadFileContent(roomId, file._id);
    },

    // CLOSE
    closeFile: (fileId) =>
      set((s) => {
        const files = s.openFiles.filter((f) => f._id !== fileId);

        return {
          openFiles: files,

          activeFileId:
            s.activeFileId === fileId
              ? files.at(-1)?._id || null
              : s.activeFileId,
        };
      }),

    setActiveFile: (activeFileId) =>
      set({
        activeFileId,
      }),

    setFileEdited: (fileId, edited) =>
      set((s) => ({
        openFiles: s.openFiles.map((f) =>
          f._id === fileId
            ? {
                ...f,
                isEdited: edited,
              }
            : f,
        ),
      })),

    // CONTENT
    updateContent: (fileId, content) =>
      updateCode(fileId, {
        content,
      }),

    loadFileContent: async (roomId, fileId) => {
      const cache = get().code[fileId];

      if (cache?.loading || cache?.loaded) return;

      updateCode(fileId, {
        loading: true,
      });

      try {
        const res = await fetch(
          `/api/playground/${roomId}/files?fileId=${fileId}`,
        );

        const data = await res.json();

        updateCode(fileId, {
          content: data?.content || "",
          loaded: true,
          loading: false,
        });
      } catch {
        updateCode(fileId, {
          loading: false,
        });
      }
    },

    saveFileContent: async (roomId, fileId, content) => {
      updateCode(fileId, {
        content,
      });

      await fetch(`/api/playground/${roomId}/files`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: fileId,
          content,
        }),
      });

      get().setFileEdited(fileId, false);
    },
  };
});
