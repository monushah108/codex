import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

type MsgItem = {
  id: string;
  content: string;
  image: string;
  name: string;
  timeStamp: string;
};

type MsgCache = {
  msgs: MsgItem[];
  loaded: boolean;
  loading: boolean;
  hasMore?: boolean;
};

type Chatstore = {
  cache: Record<string, MsgCache>;
  user: User | null;
  setUser: (user: User | null) => void;
  addMsg: (roomId: string, content: string) => Promise<MsgItem | void>;
  loadMsg: (roomId: string, cursor: string) => Promise<void>;
  deleteMsg: (roomId: string, msgId: string) => void;
  editMsg: (roomId: string, msgId: string, newContent: string) => void;
};

export const useChatstore = create<Chatstore>((set, get) => ({
  cache: {},
  user: null,

  setUser: (user) => set({ user }),

  loadMsg: async (roomId, cursor) => {
    const cache = get().cache[roomId];

    if (cache?.loaded) return;

    set((state) => ({
      cache: {
        ...state.cache,
        [roomId]: {
          msgs: [...(state.cache[roomId]?.msgs || [])],
          loaded: false,
          loading: true,
        },
      },
    }));

    try {
      const res = await fetch(
        `/api/playground/${roomId}/chat?cursor=${cursor}`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      set((state) => ({
        cache: {
          ...state.cache,
          [roomId]: {
            msgs: cache ? [...data?.msgs, ...cache?.msgs] : data?.msgs,
            loaded: true,
            loading: false,
            hasMore: data.hasMore,
          },
        },
      }));
    } catch (err) {
      console.log(err);

      set((state) => ({
        cache: {
          ...state.cache,
          [roomId]: {
            ...state.cache[roomId],
            loading: false,
          },
        },
      }));
    }
  },

  addMsg: async (roomId, content) => {
    const id = crypto.randomUUID();
    const user = get().user;

    const tempMsg: MsgItem = {
      id,
      content,
      name: user?.name || "You",
      image: user?.image || "",
      timeStamp: new Date().toISOString(),
    };

    // optimistic message
    set((state) => {
      const cache = state.cache[roomId];
      if (!cache) return state;

      return {
        cache: {
          ...state.cache,
          [roomId]: {
            ...cache,
            msgs: [...cache.msgs, tempMsg],
          },
        },
      };
    });

    try {
      const res = await fetch(`/api/playground/${roomId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content, roomId, msgId: id }),
      });

      const data = await res.json();

      const formatMsg = {
        ...data,
        name: user?.name || "You",
        image: user?.image || "",
      };

      // replace temp message with real one
      set((state) => {
        const cache = state.cache[roomId];
        if (!cache) return state;

        return {
          cache: {
            ...state.cache,
            [roomId]: {
              ...cache,
              msgs: cache.msgs.map((m) => (m._id === id ? formatMsg : m)),
            },
          },
        };
      });
    } catch (err) {
      console.log(err);

      // remove failed message
      set((state) => {
        const cache = state.cache[roomId];
        if (!cache) return state;

        return {
          cache: {
            ...state.cache,
            [roomId]: {
              ...cache,
              msgs: cache.msgs.filter((m) => m._id !== id),
            },
          },
        };
      });
    }
  },

  deleteMsg: (roomId, msgId) => {
    set((state) => {
      const cache = state.cache[roomId];
      if (!cache) return state;

      return {
        cache: {
          ...state.cache,
          [roomId]: {
            ...cache,
            msgs: cache.msgs.filter((m) => m._id !== msgId),
          },
        },
      };
    });
  },

  editMsg: (roomId, msgId, newContent) => {
    set((state) => {
      const cache = state.cache[roomId];
      if (!cache) return state;

      return {
        cache: {
          ...state.cache,
          [roomId]: {
            ...cache,
            msgs: cache.msgs.map((m) =>
              m._id === msgId ? { ...m, content: newContent } : m,
            ),
          },
        },
      };
    });
  },
}));
