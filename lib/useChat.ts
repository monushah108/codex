import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import * as Y from "yjs";
import { useChatstore } from "./store/Chatstore";

type Member = {
  sId: string;
  uId: string;
};

export default function useChat(roomId: string) {
  const addMsg = useChatstore((s) => s.addMsg);
  const setMembers = useChatstore((s) => s.setMembers);
  const user = useChatstore((s) => s.user);
  const deleteMsg = useChatstore((s) => s.deleteMsg);
  const editMsg = useChatstore((s) => s.editMsg);
  const socketRef = useRef<Socket | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);

  useEffect(() => {
    if (!user || !roomId) return;

    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // 🔹 Create Yjs document
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // 🔹 CONNECT
    socket.on("connect", () => {
      console.log("connected:", socket.id);

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
    socket.on("room:members", (members: Member[]) => {
      setMembers(members);
    });

    // 🔹 CHAT RECEIVE
    socket.on("chat:receive", (msg) => {
      if (msg.userId !== user.id) {
        addMsg(roomId, msg);
      }
    });

    socket.on("chat:delete", (msgId) => {
      deleteMsg(roomId, msgId);
    });

    socket.on("chat:edit", ({ msgId, newText }) => {
      editMsg(roomId, msgId, newText);
    });

    // 🔹 YJS INIT (FULL STATE)
    socket.on("yjs:init", (state: number[]) => {
      const update = new Uint8Array(state);
      Y.applyUpdate(ydoc, update);
    });

    // 🔹 YJS UPDATE (INCREMENTAL)
    socket.on("yjs:update", (update: number[]) => {
      Y.applyUpdate(ydoc, new Uint8Array(update));
    });

    // 🔹 LOCAL YJS CHANGES → SERVER
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
  }, [roomId, user]);

  // 🔹 SEND CHAT MESSAGE
  const sendMessage = useCallback(
    (content: string) => {
      const socket = socketRef.current;
      if (!socket) return;

      socket.emit("chat:send", {
        roomId,
        content,
      });
    },
    [roomId],
  );

  const deleteMessage = useCallback(
    (msgId: string) => {
      const socket = socketRef.current;
      if (!socket) return;

      socket.emit("chat:delete", {
        msgId,
        roomId,
      });
    },
    [roomId],
  );

  const editMessage = useCallback(
    (msgId: string, newText: string) => {
      const socket = socketRef.current;
      if (!socket) return;

      socket.emit("chat:edit", {
        msgId,
        roomId,
        newText,
      });
    },
    [roomId],
  );

  // 🔹 OPTIONAL: AWARENESS (cursor, name, etc.)
  const sendAwareness = useCallback(
    (awareness: any) => {
      const socket = socketRef.current;
      if (!socket) return;

      socket.emit("yjs:awareness", {
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

    // ydoc: ydocRef.current,
  };
}
