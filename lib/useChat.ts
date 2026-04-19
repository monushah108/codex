import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useChatstore } from "./store/Chatstore";

export default function useChat(roomId: string) {
  const { addMsg, deleteMsg, editMsg, setMembers, user } = useChatstore();

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user || !roomId) return;

    socketRef.current = io("http://localhost:3000");

    // 🔹 CONNECT
    socketRef.current.on("connect", () => {
      socketRef.current.emit("room:join", {
        roomId,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      });
    });

    // 🔹 MEMBERS
    socketRef.current.on("room:members", (members) => {
      setMembers(members);
    });

    // 🔹 RECEIVE MESSAGE
    socketRef.current.on("chat:receive", (msg) => {
      useChatstore.setState((state) => {
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
              msgs: [...cache.msgs, msg],
            },
          },
        };
      });
    });
    // 🔹 DELETE
    socketRef.current.on("chat:delete", ({ msgId }) => {
      useChatstore.setState((state) => {
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
    });

    // 🔹 EDIT
    socketRef.current.on("chat:edit", ({ msgId, newText }) => {
      useChatstore.setState((state) => {
        const cache = state.cache[roomId];
        if (!cache) return state;

        return {
          cache: {
            ...state.cache,
            [roomId]: {
              ...cache,
              msgs: cache.msgs.map((m) =>
                m.id === msgId ? { ...m, content: newText, edited: true } : m,
              ),
            },
          },
        };
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, user, setMembers]);

  // 🔹 SEND
  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      const tempId = crypto.randomUUID();

      addMsg(roomId, {
        content,
        id: tempId,
        name: user?.name,
        image: user?.image,
      });

      socketRef.current?.emit("chat:send", {
        roomId,
        content,
        msgId: tempId,
      });
    },
    [roomId, addMsg, user],
  );

  // 🔹 DELETE
  const deleteMessage = useCallback(
    (msgId: string) => {
      deleteMsg(roomId, msgId);

      socketRef.current?.emit("chat:delete", {
        msgId,
        roomId,
      });
    },
    [roomId, deleteMsg],
  );

  // 🔹 EDIT
  const editMessage = useCallback(
    (msgId: string, newText: string) => {
      editMsg(roomId, msgId, newText);

      socketRef.current?.emit("chat:edit", {
        msgId,
        newText,
        roomId,
      });
    },
    [roomId, editMsg],
  );

  return {
    user,
    sendMessage,
    deleteMessage,
    editMessage,
  };
}
