import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import * as Y from "yjs";
import { useChatstore } from "./store/Chatstore";
import { chatActions } from "./store/chatActions";

type Member = {
  sId: string;
  uId: string;
};

export default function useChat(roomId: string) {
  const { addLocalMsg, deleteLocalMsg, editLocalMsg, setMembers, user, cache } =
    useChatstore();

  const socketRef = useRef<Socket | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);

  useEffect(() => {
    if (!user || !roomId) return;

    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // 🔹 CONNECT
    socket.on("connect", () => {
      socket.emit("room:join", {
        roomId,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      });
    });

    // 🔹 MEMBERS
    socket.on("room:members", setMembers);

    // 🔹 RECEIVE MESSAGE (DEDUP SAFE)
    socket.on("chat:receive", (msg) => {
      const existing = cache[roomId]?.msgs || [];

      const alreadyExists = existing.some((m) => m.id === msg.id);
      if (alreadyExists) return;

      addLocalMsg(roomId, msg);
    });

    // 🔹 DELETE
    socket.on("chat:delete", ({ msgId }) => {
      deleteLocalMsg(roomId, msgId);
    });

    // 🔹 EDIT
    socket.on("chat:edit", ({ msgId, newText }) => {
      editLocalMsg(roomId, msgId, newText);
    });

    // 🔹 YJS
    socket.on("yjs:init", (state: number[]) => {
      Y.applyUpdate(ydoc, new Uint8Array(state));
    });

    socket.on("yjs:update", (update: number[]) => {
      Y.applyUpdate(ydoc, new Uint8Array(update));
    });

    ydoc.on("update", (update: Uint8Array) => {
      socket.emit("yjs:update", {
        roomId,
        update: Array.from(update),
      });
    });

    return () => {
      socket.disconnect();
      ydoc.destroy();
    };
  }, [roomId]); // ✅ stable dependency

  // 🔹 SEND
  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      // ✅ optimistic update
      chatActions.addMsg(roomId, { content });

      socketRef.current?.emit("chat:send", { roomId, content });
    },
    [roomId],
  );

  // 🔹 DELETE
  const deleteMessage = useCallback(
    (msgId: string) => {
      socketRef.current?.emit("chat:delete", { msgId, roomId });
    },
    [roomId],
  );

  // 🔹 EDIT
  const editMessage = useCallback(
    (msgId: string, newText: string) => {
      socketRef.current?.emit("chat:edit", {
        msgId,
        roomId,
        newText,
      });
    },
    [roomId],
  );

  const sendAwareness = useCallback(
    (awareness: any) => {
      socketRef.current?.emit("yjs:awareness", {
        roomId,
        awareness,
      });
    },
    [roomId],
  );

  return {
    user,
    sendMessage,
    deleteMessage,
    editMessage,
    sendAwareness,
  };
}
