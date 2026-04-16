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
        userId: user.id,
      });
    });

    // 🔹 MEMBERS
    socket.on("room:members", (members: Member[]) => {
      setMembers(members);
    });

    // 🔹 CHAT RECEIVE
    socket.on("chat:receive", (msg) => {
      addMsg(roomId, msg);
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
    sendAwareness,
    // ydoc: ydocRef.current,
  };
}
