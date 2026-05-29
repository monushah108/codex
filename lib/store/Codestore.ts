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

type CodeState = {
  content: string;
  loaded?: boolean;
  loading?: boolean;
  saving?: boolean;
  generating?: boolean;
};

type Store = {
  code: Record<string, CodeState>;

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

  generateCode: (fileId: string, prompt: string) => Promise<void>;
};

export const useCodestore = create<Store>((set, get) => {
  const updateCode = (fileId: string, data: Partial<CodeState>) =>
    set((state) => ({
      code: {
        ...state.code,

        [fileId]: {
          ...(state.code[fileId] || {
            content: "",
          }),

          ...data,
        },
      },
    }));

  return {
    code: {},

    openFiles: [],

    activeFileId: null,

    outputs: [],

    // OPEN FILE
    openFile: async (file, roomId) => {
      set((state) => ({
        activeFileId: file._id,

        openFiles: state.openFiles.some((f) => f._id === file._id)
          ? state.openFiles
          : [
              ...state.openFiles,

              {
                ...file,

                isEdited: false,
              },
            ],
      }));

      await get().loadFileContent(roomId, file._id);
    },

    // CLOSE FILE
    closeFile: (fileId) =>
      set((state) => {
        const files = state.openFiles.filter((f) => f._id !== fileId);

        return {
          openFiles: files,

          activeFileId:
            state.activeFileId === fileId
              ? files.at(-1)?._id || null
              : state.activeFileId,
        };
      }),

    // ACTIVE FILE
    setActiveFile: (activeFileId) =>
      set({
        activeFileId,
      }),

    // EDIT STATUS
    setFileEdited: (fileId, edited) =>
      set((state) => ({
        openFiles: state.openFiles.map((file) =>
          file._id === fileId
            ? {
                ...file,

                isEdited: edited,
              }
            : file,
        ),
      })),

    // UPDATE CONTENT
    updateContent: (fileId, content) => {
      updateCode(fileId, {
        content,
      });

      get().setFileEdited(fileId, true);
    },

    // LOAD FILE
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

        if (!res.ok) {
          throw new Error("Failed to load file");
        }

        const data = await res.json();

        updateCode(fileId, {
          content: data?.content || "",

          loaded: true,

          loading: false,
        });
      } catch (err) {
        console.error(err);

        updateCode(fileId, {
          loading: false,
        });
      }
    },

    // SAVE FILE
    saveFileContent: async (roomId, fileId, content) => {
      updateCode(fileId, {
        saving: true,

        content,
      });

      try {
        const res = await fetch(`/api/playground/${roomId}/files`, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: fileId,

            content,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to save file");
        }

        get().setFileEdited(fileId, false);
      } catch (err) {
        console.error(err);
      } finally {
        updateCode(fileId, {
          saving: false,
        });
      }
    },

    // AI GENERATION
    generateCode: async (fileId, prompt) => {
      const existingContent = get().code[fileId]?.content || "";

      updateCode(fileId, {
        generating: true,
      });

      try {
        const res = await fetch("/api/ai", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            prompt,

            content: existingContent,
          }),
        });

        if (!res.ok) {
          throw new Error("Generation failed");
        }

        const data = await res.json();

        updateCode(fileId, {
          content: data.code,

          generating: false,
        });

        get().setFileEdited(fileId, true);
      } catch (err) {
        console.error(err);

        updateCode(fileId, {
          generating: false,
        });
      }
    },
  };
});
