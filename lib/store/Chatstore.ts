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
  timeStamp: string;
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

  loadMsg: (roomId: string, cursor: string) => Promise<void>;
  deleteMsg: (roomId: string, msgId: string) => void;
  editMsg: (roomId: string, msgId: string, newText: string) => void;
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
  addMsg: async (roomId, msg) => {
    const user = get().user;
    if (!user) return;

    const tempId = crypto.randomUUID();

    const optimisticMsg: MsgItem = {
      id: tempId,
      content: msg.content || "",
      userId: user.id,
      name: user.name,
      image: user.image,
      timeStamp: new Date().toLocaleTimeString(),
      optimistic: true,
    };

    // 🔹 1. Optimistic UI update
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
            msgs: [...cache.msgs, optimisticMsg],
          },
        },
      };
    });

    try {
      // 🔹 2. Save to DB
      const res = await fetch(`/api/playground/${roomId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: msg.content,
          msgId: tempId,
        }),
      });

      const savedMsg = await res.json();
      console.log(savedMsg);

      // 🔹 3. Replace optimistic msg with real msg
      set((state) => {
        const cache = state.cache[roomId];
        if (!cache) return state;

        return {
          cache: {
            ...state.cache,
            [roomId]: {
              ...cache,
              msgs: cache.msgs.map((m) =>
                m.id === tempId || m.id === savedMsg.msgId
                  ? {
                      id: savedMsg._id,
                      content: savedMsg.content,
                      timeStamp: savedMsg.timeStamp,
                      userId: savedMsg.userId,
                      image: msg.image,
                      name: msg.name,
                      optimistic: false,
                    }
                  : m,
              ),
            },
          },
        };
      });
    } catch (err) {
      // 🔹 4. Rollback on error
      set((state) => {
        const cache = state.cache[roomId];
        if (!cache) return state;

        return {
          cache: {
            ...state.cache,
            [roomId]: {
              ...cache,
              msgs: cache.msgs.filter((m) => m.id !== tempId),
            },
          },
        };
      });

      console.error("Message failed:", err);
    }
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
  editMsg: (roomId, msgId, newText) => {
    set((state) => {
      const cache = state.cache[roomId];
      if (!cache) return state;

      return {
        cache: {
          ...state.cache,
          [roomId]: {
            ...cache,
            msgs: cache.msgs.map((m) =>
              m.id === msgId ? { ...m, content: newText } : m,
            ),
          },
        },
      };
    });
  },
}));
