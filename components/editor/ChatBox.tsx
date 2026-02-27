"use client";
import { MessageSquare, MessageSquareCode, SendIcon } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import ChatBubble from "./ui/chatBubble";
import { Textarea } from "../ui/textarea";
import { socket } from "@/lib/socket";

const ChatBox = memo(function ChatBox() {
  const [msg, setMsg] = useState("");
  const [chats, setChats] = useState([]);
  const endRef = useRef<HTMLDivElement>(null);

  const handlePostMsg = () => {
    if (!msg.trim()) return;
    const postSkeleton = {
      id: crypto.randomUUID(),
      time: new Date().toLocaleTimeString("en-us", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      content: "",
      name: "monu",
    };

    setChats((pre) => [...pre, { ...postSkeleton, content: msg }]);
    setMsg("");
  };

  const handleChange = (e) => {
    setMsg(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  useEffect(() => {
    socket.connect();

    socket.emit("msg", "hello monu is here");

    socket.on("recive", (data) => {
      console.log(data);
    });

    return () => {
      socket.off("connect", () => console.log("connected"));
      socket.off("disconnect", () => console.log("disconnected"));
    };
  }, []);

  return (
    <aside className="flex justify-between flex-col h-full">
      <div className="flex items-center justify-between px-2 py-2 border-b border-[#2d2d30]">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-3" />
          <span className="text-xs">TEAM CHAT</span>
        </div>
      </div>

      <div className="flex-1 ">
        <ScrollArea className="h-[740px] rounded-md p-3 ">
          {!chats.length ? (
            <div className="h-[600px] flex items-center justify-center">
              <div className="flex flex-col gap-1 items-center justify-center   ">
                <div className="rounded  animate-bounce p-2 text-white">
                  <MessageSquareCode className="size-8" />
                </div>
                <p>No Conversationes!!</p>
              </div>
            </div>
          ) : (
            <>
              {chats.map(({ id, time, content, name }) => (
                <ChatBubble
                  name={name}
                  key={id}
                  time={time}
                  content={content}
                />
              ))}
              <div ref={endRef} />
            </>
          )}
        </ScrollArea>
      </div>

      <div className="p-3 border-t border-[#2d2d30]">
        <div className="flex items-center gap-2 bg-[#2d2d30] rounded px-3 py-2 focus-within:ring-1 focus-within:ring-[#007acc] transition-all">
          <Textarea
            autoFocus
            value={msg}
            onKeyDown={(e) => e.key == "Enter" && handlePostMsg()}
            onChange={handleChange}
            className="flex-1 bg-transparent outline-none text-sm text-[#cccccc] placeholder-[#6a6a6a]  min-h-10 resize-none max-h-15 "
            rows={4}
            placeholder="Type a message..."
          />

          <button
            disabled={!msg}
            onClick={handlePostMsg}
            className="p-2 rounded hover:bg-[#007acc] disabled:opacity-30 transition-colors "
          >
            <SendIcon className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
});

export default ChatBox;
