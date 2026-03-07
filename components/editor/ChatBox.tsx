"use client";
import { MessageSquare, MessageSquareCode, SendIcon } from "lucide-react";
import { memo, Suspense, useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import ChatBubble from "./ui/chatBubble";
import { socket } from "@/lib/socket";
import { ResizablePanel } from "../ui/resizable";
import { Input } from "../ui/input";

import { useLayout } from "@/context/layout-context";
import ChatBoxSkeleton from "./Skeleton/chatBoxSkeleton";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";

const ChatBox = memo(function ChatBox({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [cursor, setCursor] = useState(null);
  const endRef = useRef<HTMLDivElement>(null);
  const { isCollapse } = useLayout();

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat?chatId=${roomId}&cursor=${123}`, {
        credentials: "include",
      });

      const data = res.json();

      setMessages((pre) => [...pre, ...data]);
    } catch {
      toast.error("something went wrong!!");
    }
  };

  // useEffect(() => {
  //   const observer = new IntersectionObserver((entries) => {
  //     if (entries[0].isIntersecting) {
  //       fetchMessages();
  //     }
  //   });
  //   console.log(observer);
  //   // if (loaderRef.current) observer.observe(loaderRef.current);

  //   return () => observer.disconnect();
  // }, [cursor]);

  const PostMsg = async () => {
    if (!content.trim()) return;

    await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ content, roomId }),
    });

    setContent("");
  };

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <ResizablePanel
      defaultSize={isCollapse.chat ? 20 : 0}
      minSize={0}
      collapsible
      collapsedSize={0}
    >
      <Suspense fallback={<ChatBoxSkeleton />}>
        <Toaster />
        <aside className={`flex justify-between flex-col h-full `}>
          <div className="flex items-center justify-between px-2 py-2 border-b border-[#2d2d30]">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-3" />
              <span className="text-xs">TEAM CHAT</span>
            </div>
          </div>

          <div className="flex-1 ">
            <ScrollArea className="h-[740px] rounded-md p-3 ">
              {!messages.length ? (
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
                  {messages.map(({ id, time, content, name }) => (
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
              <Input
                autoFocus
                value={content}
                onKeyDown={(e) => e.key == "Enter" && PostMsg()}
                onChange={handleChange}
                className="flex-1 bg-transparent outline-none border-none text-sm text-[#cccccc] placeholder-[#6a6a6a]  min-h-8 resize-none max-h-15 "
                placeholder="Type a message..."
              />

              <button
                disabled={!content}
                onClick={PostMsg}
                className="p-2 rounded hover:bg-[#007acc] disabled:opacity-30 transition-colors "
              >
                <SendIcon className="size-4" />
              </button>
            </div>
          </div>
        </aside>
      </Suspense>
    </ResizablePanel>
  );
});

export default ChatBox;
