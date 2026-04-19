import { create } from "zustand";
import { chatAction } from "./chatActions";

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
  edited?: boolean;
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
  setMembers: (members: Member[]) => void;

  addMsg: (roomId: string, msg: Partial<MsgItem>) => void;

  loadMsg: (roomId: string, cursor: string) => Promise<void>;
  deleteMsg: (roomId: string, msgId: string) => void;
  editMsg: (roomId: string, msgId: string, newText: string) => void;
};

export const useChatstore = create<Chatstore>((set, get) => ({
  cache: {},
  user: null,
  members: [],

  setUser: (user) => set({ user }),

  setMembers: (members) => {
    const user = get().user;

    set({
      members: members.map((m) => ({
        id: m.uId,
        name: m.uId === user?.id ? user.name : "Anonymous",
        image: m.uId === user?.id ? user.image : undefined,
      })),
    });
  },

  // 🔹 ADD MESSAGE
  addMsg: async (roomId, msg) => {
    const user = get().user;
    if (!user) return;

    // 1. optimistic UI
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
            msgs: [...cache.msgs],
          },
        },
      };
    });

    try {
      // 2. API call (moved)
      const savedMsg = await chatAction.addMsg(
        roomId,
        msg.content || "",
        msg.id,
      );

      // 3. replace optimistic
      set((state) => {
        const cache = state.cache[roomId];
        if (!cache) return state;

        return {
          cache: {
            ...state.cache,
            [roomId]: {
              ...cache,
              msgs: cache.msgs.map((m) =>
                m.id === msg.id
                  ? {
                      id: savedMsg._id,
                      content: savedMsg.content,
                      timeStamp: savedMsg.timeStamp,
                      userId: savedMsg.userId,
                      image: msg.image,
                      name: msg.name,
                      edited: false,
                    }
                  : m,
              ),
            },
          },
        };
      });
    } catch (err) {
      // rollback
      set((state) => {
        const cache = state.cache[roomId];
        if (!cache) return state;

        return {
          cache: {
            ...state.cache,
            [roomId]: {
              ...cache,
              msgs: cache.msgs.filter((m) => m.id !== msg.id),
            },
          },
        };
      });

      console.error("Message failed:", err);
    }
  },

  // 🔹 LOAD
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
      const data = await chatAction.loadMsg(roomId, cursor);

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
  deleteMsg: async (roomId, msgId) => {
    try {
      await chatAction.deleteMsg(roomId, msgId);

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
    } catch (err) {
      console.log(err);

      set((state) => {
        const cache = state.cache[roomId];
        if (!cache) return state;

        return {
          cache: {
            ...state.cache,
            [roomId]: {
              ...cache,
              msgs: [...cache.msgs],
            },
          },
        };
      });
    }
  },

  // 🔹 EDIT
  editMsg: async (roomId, msgId, newText) => {
    try {
      await chatAction.editMsg(roomId, msgId, newText);

      set((state) => {
        const cache = state.cache[roomId];
        if (!cache) return state;

        return {
          cache: {
            ...state.cache,
            [roomId]: {
              ...cache,
              msgs: cache.msgs.map((m) =>
                m.id === msgId
                  ? {
                      ...m,
                      content: newText,
                      edited: m.content == newText ? true : false,
                    }
                  : m,
              ),
            },
          },
        };
      });
    } catch {
      set((state) => {
        const cache = state.cache[roomId];
        if (!cache) return state;

        return {
          cache: {
            ...state.cache,
            [roomId]: {
              ...cache,
              msgs: [...cache.msgs],
            },
          },
        };
      });
    }
  },
}));

/* 
  ui - go to socket 
  socket - zustand 
  zustand - db 

*/
