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
  userId: string;
  name: string;
  image?: string;
  createdAt: number;
  optimistic?: boolean;
};

type MsgCache = {
  msgs: MsgItem[];
  loaded: boolean;
  loading: boolean;
  hasMore?: boolean;
};

type Member = {
  id: string;
  name?: string;
  image?: string;
};

type Chatstore = {
  cache: Record<string, MsgCache>;
  user: User | null;
  members: Member[];

  setUser: (user: User | null) => void;
  setMembers: (members: any[]) => void;

  addMsg: (roomId: string, msg: Partial<MsgItem>) => void;
  confirmMsg: (roomId: string, tempId: string, realMsg: MsgItem) => void;

  loadMsg: (roomId: string, cursor: string) => Promise<void>;
  deleteMsg: (roomId: string, msgId: string) => void;
  editMsg: (roomId: string, msgId: string, newContent: string) => void;
};

export const useChatstore = create<Chatstore>((set, get) => ({
  cache: {},
  user: null,
  members: [],

  // 🔹 USER
  setUser: (user) => set({ user }),

  // 🔹 MEMBERS (from socket)
  setMembers: (members) => {
    const user = get().user;

    set({
      members: members.map((m: any) => ({
        id: m.uId,
        name: m.uId === user?.id ? user.name : "Anonymous",
        image: m.uId === user?.id ? user.image : undefined,
      })),
    });
  },

  // 🔹 ADD MESSAGE (supports optimistic + socket)
  addMsg: (roomId, msg) => {
    const user = get().user;
    const id = msg.id || crypto.randomUUID();

    const newMsg: MsgItem = {
      id,
      content: msg.content || "",
      userId: msg.userId || user?.id || "",
      name: msg.name || user?.name || "You",
      image: msg.image || user?.image,
      createdAt: msg.createdAt || Date.now(),
      optimistic: msg.optimistic ?? false,
    };

    set((state) => {
      const cache = state.cache[roomId] || {
        msgs: [],
        loaded: true,
        loading: false,
      };

      return {
        cache: {
          ...state.cache,
          [roomId]: {
            ...cache,
            msgs: [...cache.msgs, newMsg],
          },
        },
      };
    });
  },

  // 🔹 CONFIRM OPTIMISTIC MESSAGE (replace temp with real)
  confirmMsg: (roomId, tempId, realMsg) => {
    set((state) => {
      const cache = state.cache[roomId];
      if (!cache) return state;

      return {
        cache: {
          ...state.cache,
          [roomId]: {
            ...cache,
            msgs: cache.msgs.map((m) =>
              m.id === tempId ? { ...realMsg, optimistic: false } : m,
            ),
          },
        },
      };
    });
  },

  // 🔹 LOAD HISTORY
  loadMsg: async (roomId, cursor) => {
    const cache = get().cache[roomId];

    if (cache?.loading) return;

    set((state) => ({
      cache: {
        ...state.cache,
        [roomId]: {
          ...(state.cache[roomId] || { msgs: [] }),
          loading: true,
        },
      },
    }));

    try {
      const res = await fetch(
        `/api/playground/${roomId}/chat?cursor=${cursor}`,
        { credentials: "include" },
      );

      const data = await res.json();

      set((state) => {
        const existing = state.cache[roomId]?.msgs || [];

        return {
          cache: {
            ...state.cache,
            [roomId]: {
              msgs: [...data.msgs, ...existing],
              loaded: true,
              loading: false,
              hasMore: data.hasMore,
            },
          },
        };
      });
    } catch (err) {
      console.error(err);

      set((state) => ({
        cache: {
          ...state.cache,
          [roomId]: {
            ...(state.cache[roomId] || { msgs: [] }),
            loading: false,
          },
        },
      }));
    }
  },

  // 🔹 DELETE
  deleteMsg: (roomId, msgId) => {
    set((state) => {
      const cache = state.cache[roomId];
      if (!cache) return state;

      return {
        cache: {
          ...state.cache,
          [roomId]: {
            ...cache,
            msgs: cache.msgs.filter((m) => m.id !== msgId),
          },
        },
      };
    });
  },

  // 🔹 EDIT
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
              m.id === msgId ? { ...m, content: newContent } : m,
            ),
          },
        },
      };
    });
  },
}));
