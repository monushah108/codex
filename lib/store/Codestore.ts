import { create } from "zustand";
import { getType } from "../features";
import { socket } from "../socket";
import { CodeState, Store } from "./types";

import * as codeApi from "@/lib/api/codeApi";

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
    user: {},

    // set User
    setUser: (user) => set({ user }),

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
        savedContent: "",
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
        const data = await codeApi.loadFile(roomId, fileId);

        updateCode(fileId, {
          content: data?.content || "",
          savedContent: data?.content || "",
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

      const IsSaved = get().code[fileId]?.savedContent == content;
      const file = get().code[fileId];

      if (file?.isDeleted) {
        return;
      }

      if (IsSaved) {
        updateCode(fileId, {
          saving: false,
        });
        return;
      }

      try {
        await codeApi.saveFile(roomId, fileId, content);

        get().setFileEdited(fileId, false);

        socket.emit("file:saved", {
          roomId,
          fileId,
          content,
        });

        updateCode(fileId, {
          content,
          savedContent: content,
          saving: false,
        });
      } catch (err) {
        console.error(err);
      } finally {
        updateCode(fileId, {
          saving: false,
        });
      }
    },

    // RUN CODE
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

      const langId = getType(activeFile?.name as string)?.id;

      if (!langId) {
        set((state) => ({
          outputs: [
            ...state.outputs,
            {
              id: crypto.randomUUID(),
              error: "Unsupported file type",
              loading: false,
            },
          ],
        }));
        return;
      }

      updateCode(fileId, {
        running: true,
      });

      const loadingId = crypto.randomUUID();

      set((state) => ({
        outputs: [
          ...state.outputs,
          {
            id: loadingId,
            stdout: "⏳ Running code...",
            loading: true,
            loaded: false,
          },
        ],
      }));

      try {
        const data = await codeApi.runCode(activeFile?.name as string, code);

        set((state) => ({
          outputs: [
            ...state.outputs.filter((o) => o.id !== loadingId),
            {
              id: crypto.randomUUID(),
              stdout: data.stdout,
              stderr: data.stderr,
              compile_output: data.compile_output,
              message: data.message,
              loading: false,
              loaded: true,
            },
          ],
        }));

        updateCode(fileId, {
          running: false,
        });
      } catch (err) {
        console.error(err);

        set((state) => ({
          outputs: [
            ...state.outputs.filter((o) => o.id !== loadingId),
            {
              id: crypto.randomUUID(),
              error: "Failed to execute code",
            },
          ],
        }));
      } finally {
        updateCode(fileId, {
          running: false,
        });
      }
    },

    clearOutputs: () => set({ outputs: [] }),

    // RUN COMMAND
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

    generateCode: async (fileId, prompt) => {
      const content = get().code[fileId]?.content || "";

      updateCode(fileId, {
        generating: true,
      });

      try {
        const data = await codeApi.generateCode(prompt, content);

        updateCode(fileId, {
          content: data.code,

          generating: false,
        });
      } catch (err) {
        console.error(err);

        updateCode(fileId, {
          generating: false,
        });
      }
    },
  };
});

/* TODO: Implement real time file deletion functionality and real time file saved functionality when one user saves a file than others files will be updated in real time */
