import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useChatstore } from "./store/Chatstore";
type Message = {
  id: string;
  content: string;
  userId: string;
  name: string;
  image: string;
};

type Member = {
  id: string;
  name: string;
  image: string;
};

type user = {
  id: string;
  name: string;
  image: string;
};

export default function useChat(roomId: string) {
  const addMsg = useChatstore((state) => state.addMsg);
  const setMembers = useChatstore((state) => state.setMembers);
  const user = useChatstore((state) => state.user);
  const socketRef = useRef<any>();

  useEffect(() => {
    if (!user) return;

    socketRef.current = io("http://localhost:3000", {
      query: {
        userId: user.id,
        roomId,
      },
    });

    socketRef.current.on("connect", () => {
      console.log(socketRef.current.id);
    });

    socketRef.current.on("receive_message", (message: Message) => {
      // setMessages((prevMessages) => [...prevMessages, message]);
      addMsg(roomId, message.content);
    });

    socketRef.current.on("members", (members: Member[]) => {
      setMembers(members);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, user]);

  const joinRoom = (roomId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("joinRoom", { roomId, userId: user?.id });
  };

  const sendMessage = (content: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("send_message", { content, roomId });
  };

  return { user, joinRoom, sendMessage };
}
