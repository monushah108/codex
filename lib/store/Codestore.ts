import { create } from "zustand";
import { getType } from "../features";

type FileItem = {
  _id: string;
  name: string;
  isEdited?: boolean;
};

type Codestore = {
  code: Record<string, { loaded: boolean; loading: boolean; content?: string }>;
  openFiles: FileItem[];
  activeFileId: string | null;
  outputs: { id: string; [key: string]: any }[];
  runCode: (fileId: string, content?: string) => Promise<void>;
  runCommand: (command: string, fileId: string) => void;
  loadFileContent: (roomId: string, fileId: string) => Promise<void>;
  openFile: (file: FileItem, roomId: string) => void;
  closeFile: (fileId: string) => void;
  setActiveFile: (fileId: string) => void;
  setFileEdited: (fileId: string, edited: boolean) => void;
  updateContent: (fileId: string, content: string) => void;
  saveFileContent: (
    roomId: string,
    fileId: string,
    content: string,
  ) => Promise<void>;
};

export const useCodestore = create<Codestore>((set, get) => ({
  code: {},

  openFiles: [],
  outputs: [],
  activeFileId: null,

  openFile: async (file, roomId) => {
    const { openFiles } = get();
    const exists = openFiles.find((f) => f._id === file._id);

    if (!exists) {
      set((state) => ({
        openFiles: [...state.openFiles, { ...file, isEdited: false }],
        activeFileId: file._id,
      }));
    } else {
      // ← reset isEdited when switching back to a saved file
      set((state) => ({
        activeFileId: file._id,
        openFiles: state.openFiles.map((f) =>
          f._id === file._id
            ? {
                ...f,
                isEdited:
                  f.isEdited && get().code[f._id]?.content !== undefined
                    ? false
                    : f.isEdited,
              }
            : f,
        ),
      }));
    }

    await get().loadFileContent(roomId, file._id);
  },
  closeFile: (fileId) =>
    set((state) => {
      const newFiles = state.openFiles.filter((f) => f._id !== fileId);

      let newActive = state.activeFileId;

      if (state.activeFileId === fileId) {
        newActive = newFiles.length ? newFiles[newFiles.length - 1]._id : null;
      }

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

    if (cache?.loading) return;

    // already loaded — just make sure circle is cleared
    if (cache?.loaded && cache?.content !== undefined) {
      get().setFileEdited(fileId, false); // ← ADD THIS
      return;
    }

    set((state) => ({
      code: {
        ...state.code,
        [fileId]: {
          ...state.code[fileId],
          loading: true,
        },
      },
    }));

    try {
      const res = await fetch(
        `/api/playground/${roomId}/files?fileId=${fileId}`,
      );

      const data = await res.json();

      set((state) => {
        const existing = state.code[fileId];

        // IMPORTANT:
        // don't overwrite edited local content
        if (existing?.content && existing.content !== data?.content) {
          return {
            code: {
              ...state.code,

              [fileId]: {
                ...existing,
                loaded: true,
                loading: false,
              },
            },
          };
        }

        return {
          code: {
            ...state.code,

            [fileId]: {
              content: data?.content || "",
              loaded: true,
              loading: false,
            },
          },
        };
      });
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
    // optimistic update FIRST
    set((state) => ({
      code: {
        ...state.code,

        [fileId]: {
          ...state.code[fileId],
          content,
        },
      },
    }));

    try {
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

      set((state) => ({
        code: {
          ...state.code,

          [fileId]: {
            ...state.code[fileId],
            loaded: true,
            loading: false,
          },
        },
      }));
    } catch (err) {
      console.error(err);
    }
  },
  updateContent: (fileId, content) =>
    set((state) => ({
      code: {
        ...state.code,
        [fileId]: {
          ...state.code[fileId],
          content,
        },
      },
    })),

  runCode: async (fileId) => {
    const code = get().code[fileId]?.content;
    const outputs = get().outputs;
    const activeFile = get().openFiles.find((f) => f._id === fileId);
    const langId = getType(activeFile?.name)?.id;

    try {
      const res = await fetch(
        "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source_code: code,
            language_id: langId,
          }),
        },
      );
      const data = await res.json();

      set({ outputs: [...outputs, { id: crypto.randomUUID(), ...data }] });
    } catch (err) {
      console.error(err);

      set({
        outputs: [
          ...outputs,
          { id: crypto.randomUUID(), error: "Error running code" },
        ],
      });
    }
  },

  runCommand: async (command, fileId) => {
    const outputs = get().outputs;
    if (command === "clear") {
      console.log("Clearing outputs...");
      setTimeout(() => {
        outputs.length = 0;
      }, 500);
    } else if (command === "help") {
      outputs.push({
        id: crypto.randomUUID(),
        stdout: "Available commands: clear, help, run code",
      });
    } else if (command === "run code") {
      get().runCode(fileId);
    } else {
      outputs.push({
        id: crypto.randomUUID(),
        stderr: `Command not found: ${command}`,
      });
    }
  },
}));
