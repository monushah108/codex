import { MsgItem, useChatstore } from "./Chatstore";

const unique = (msgs: MsgItem[]) =>
  msgs.filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i);

export const chatActions = {
  async addMsg(roomId: string, msg: Partial<MsgItem>) {
    const store = useChatstore.getState();
    const user = store.user;
    if (!user) return;

    const tempId = crypto.randomUUID();

    const optimistic: MsgItem = {
      id: tempId,
      content: msg.content || "",
      userId: user.id,
      name: user.name,
      image: user.image,
      timeStamp: new Date().toISOString(),
      optimistic: true,
    };

    // 🔥 optimistic
    store.addLocalMsg(roomId, optimistic);

    try {
      const res = await fetch(`/api/playground/${roomId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: msg.content, msgId: tempId }),
      });

      const saved = await res.json();

      store.replaceMsg(roomId, tempId, {
        ...saved,
        id: saved._id,
        optimistic: false,
      });
    } catch {
      store.deleteLocalMsg(roomId, tempId);
    }
  },

  async loadMsg(roomId: string, cursor: string) {
    const store = useChatstore.getState();

    const res = await fetch(`/api/playground/${roomId}/chat?cursor=${cursor}`, {
      credentials: "include",
    });

    const data = await res.json();

    const existing = store.cache[roomId]?.msgs || [];

    store.setMsgs(roomId, unique([...data.msgs, ...existing]), data.hasMore);
  },

  async deleteMsg(roomId: string, msgId: string) {
    const store = useChatstore.getState();

    const prev = store.cache[roomId]?.msgs || [];

    // 🔥 optimistic
    store.deleteLocalMsg(roomId, msgId);

    try {
      await fetch(`/api/playground/${roomId}/chat`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ msgId }),
      });
      console.log("ok");
    } catch {
      // rollback
      store.setMsgs(roomId, prev);
    }
  },

  async editMsg(roomId: string, msgId: string, newText: string) {
    const store = useChatstore.getState();
    const prev = store.cache[roomId]?.msgs || [];

    // 🔥 optimistic
    store.editLocalMsg(roomId, msgId, newText);

    try {
      await fetch(`/api/playground/${roomId}/chat`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ msgId, newText }),
      });
    } catch {
      // rollback
      store.setMsgs(roomId, prev);
    }
  },
};
