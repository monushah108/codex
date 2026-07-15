// lib/store/ExplorerStore
import { create } from "zustand";
import { useCodestore } from "./Codestore";
import { ExplorerStore } from "./types";

export const useExplorerstore = create<ExplorerStore>((set, get) => ({
  cache: {},

  members: [],

  activity: [],

  /* --------------- ACTIVITY ------------------- */

  setActivity: (activity) =>
    set((state) => ({
      activity: [activity, ...state.activity].slice(0, 20),
    })),

  removeActivity: (id) =>
    set((state) => ({
      activity: state.activity.filter((a) => a.id !== id),
    })),

  /* --------------- MEMBER --------------------- */

  setMembers: (members) =>
    set(() => ({
      members,
    })),

  /* ---------------- LOAD FOLDER ---------------- */

  loadFolder: async (roomId, parentId, data, force = false) => {
    const cache = get().cache[parentId];
    console.log(get().cache[parentId]?.folders);
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

  insertFile: async (parentId, file) => {
    set((state) => ({
      cache: {
        ...state.cache,
        [parentId]: {
          ...state.cache[parentId],
          files: [...(state.cache[parentId]?.files || []), file],
        },
      },
    }));
  },

  insertFolder: async (parentId, folder) => {
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

  updateFile: async (parentId, fileId, newName) => {
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
                f._id === fileId ? { ...f, name: newName, renamed: true } : f,
              ) || [],
          },
        },
      };
    });
  },

  updateFolder: async (parentId, folderId, newName) => {
    set((state) => {
      return {
        cache: {
          ...state.cache,
          [parentId]: {
            ...state.cache[parentId],
            folders:
              state.cache[parentId]?.folders.map((f) =>
                f._id === folderId ? { ...f, name: newName, renamed: true } : f,
              ) || [],
          },
        },
      };
    });
  },

  /* ---------------- DELETE ---------------- */

  removeFile: async (parentId, fileId) => {
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
    });
  },

  removeFolder: async (parentId, folderId) => {
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
    });
  },
}));

/* TODO : implement a instant file deletion system so it does not open while deleting file and folders it suppose not to be visible to user while deleting . deletion will continue in background
 */
