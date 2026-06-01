import { create } from "zustand";
import { getType } from "../features";

type FileItem = {
  _id: string;
  name: string;
  isEdited?: boolean;
};

type Output = {
  id: string;
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  error?: string;
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
  runCode: (fileId: string, content?: string) => Promise<void>;
  runCommand: (command: string, fileId: string) => Promise<void>;
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
    runCode: async (fileId) => {
      const code = get().code[fileId]?.content;

      if (!code?.trim()) {
        set((state) => ({
          outputs: [
            ...state.outputs,
            {
              id: crypto.randomUUID(),
              error: "No code to execute",
            },
          ],
        }));
        return;
      }

      const activeFile = get().openFiles.find((f) => f._id === fileId);

      const langId = getType(activeFile?.name)?.id;

      if (!langId) {
        set((state) => ({
          outputs: [
            ...state.outputs,
            {
              id: crypto.randomUUID(),
              error: "Unsupported file type",
            },
          ],
        }));
        return;
      }

      console.log(code, langId);
      console.log(fileId, get().openFiles.find((f) => f._id === fileId)?.name);

      try {
        const res = await fetch(
          "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              source_code: code,
              language_id: langId,
            }),
          },
        );

        const data = await res.json();
        console.log(data);

        set((state) => ({
          outputs: [
            ...state.outputs,
            {
              id: crypto.randomUUID(),
              stdout: data.stdout,
              stderr: data.stderr,
              compile_output: data.compile_output,
              message: data.message,
            },
          ],
        }));
      } catch (err) {
        console.error(err);

        set((state) => ({
          outputs: [
            ...state.outputs,
            {
              id: crypto.randomUUID(),
              error: "Failed to execute code",
            },
          ],
        }));
      }
    },
    runCommand: async (command, fileId) => {
      switch (command.trim().toLowerCase()) {
        case "clear":
          set({ outputs: [] });
          break;

        case "help":
          set((state) => ({
            outputs: [
              ...state.outputs,
              {
                id: crypto.randomUUID(),
                stdout: "Available commands: help, clear, run code",
              },
            ],
          }));
          break;

        case "run code":
          await get().runCode(fileId);
          break;

        default:
          set((state) => ({
            outputs: [
              ...state.outputs,
              {
                id: crypto.randomUUID(),
                stderr: `Command not found: ${command}`,
              },
            ],
          }));
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
