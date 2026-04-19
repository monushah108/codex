"use client";
import { MessageSquare, MessageSquareCode, SendIcon } from "lucide-react";
import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { ScrollArea } from "../ui/scroll-area";
import ChatBubble from "./ui/chatBubble";
import { ResizablePanel } from "../ui/resizable";
import { Input } from "../ui/input";
import { Toaster } from "../ui/sonner";
import { Spinner } from "../ui/spinner";

import { useLayout } from "@/context/layout-context";
import ChatBoxSkeleton from "./Skeleton/chatBoxSkeleton";
import { useChatstore } from "@/lib/store/Chatstore";
import useChat from "@/lib/useChat";

const ChatBox = memo(function ChatBox({ roomId }) {
  const [content, setContent] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const { isCollapse } = useLayout();
  const { sendMessage } = useChat(roomId);

  const msgs = useChatstore((s) => s.cache[roomId]?.msgs);
  const loadMsg = useChatstore((s) => s.loadMsg);
  const loading = useChatstore((s) => s.cache[roomId]?.loading);

  const PostMsg = () => {
    if (!content.trim()) return;
    sendMessage(content);

    setContent("");
  };

  // 🔹 LOAD HISTORY
  useEffect(() => {
    if (!roomId) return;
    loadMsg(roomId, "");
  }, [roomId]);

  // 🔹 AUTO SCROLL
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  return (
    <ResizablePanel
      defaultSize={isCollapse.chat ? 20 : 0}
      minSize={0}
      collapsible
      collapsedSize={0}
    >
      <Suspense fallback={<ChatBoxSkeleton />}>
        <Toaster />

        <aside className="flex flex-col h-full">
          {/* HEADER */}
          <div className="flex items-center justify-between px-2 py-2 border-b border-[#2d2d30]">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-3" />
              <span className="text-xs">TEAM CHAT</span>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1">
            <ScrollArea className="h-185 p-3 flex">
              {!msgs?.length ? (
                <div className="flex h-full items-center justify-center ">
                  <div className="flex flex-col flex-1 gap-1 items-center ">
                    <div className="animate-bounce p-2">
                      <MessageSquareCode className="size-8" />
                    </div>
                    <p>No Conversations!!</p>
                  </div>
                </div>
              ) : (
                <>
                  {msgs.map((msg) => (
                    <ChatBubble
                      key={msg.id}
                      id={msg.id}
                      name={msg.name}
                      content={msg.content}
                      image={msg.image}
                      timeStamp={msg.timeStamp}
                      roomId={roomId}
                      edited={msg.edited}
                    />
                  ))}
                  <div ref={endRef} />
                </>
              )}

              {loading && (
                <div className="flex items-center justify-center gap-2">
                  <Spinner />
                  <span className="text-sm text-gray-500 italic">
                    loading msgs...
                  </span>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* INPUT */}
          <div className="p-3 border-t border-[#2d2d30]">
            <div className="flex items-center gap-2 bg-[#2d2d30] rounded px-3 py-2 focus-within:ring-1 focus-within:ring-[#007acc]">
              <Input
                autoFocus
                value={content}
                onKeyDown={(e) => e.key === "Enter" && PostMsg()}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm text-[#ccc] placeholder-[#6a6a6a]"
                placeholder="Type a message..."
              />

              <button
                disabled={!content.trim()}
                onClick={PostMsg}
                className="p-2 rounded hover:bg-[#007acc] disabled:opacity-30"
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
