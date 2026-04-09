"use client";
import { MessageSquare, MessageSquareCode, SendIcon } from "lucide-react";
import { memo, Suspense, useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import ChatBubble from "./ui/chatBubble";
// import { socket } from "@/lib/socket";
import { ResizablePanel } from "../ui/resizable";
import { Input } from "../ui/input";

import { useLayout } from "@/context/layout-context";
import ChatBoxSkeleton from "./Skeleton/chatBoxSkeleton";

import { Toaster } from "../ui/sonner";
import { useChatstore } from "@/lib/store/Chatstore";
import { Spinner } from "../ui/spinner";

const ChatBox = memo(function ChatBox({ roomId }) {
  const [content, setContent] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const { isCollapse } = useLayout();
  const addMsg = useChatstore((state) => state.addMsg);
  const loadMsg = useChatstore((state) => state.loadMsg);
  const cache = useChatstore((state) => state.cache[roomId]);
  const AllMsgs = cache?.msgs || [];
  const loading = cache?.loading;

  const PostMsg = () => {
    if (!content.trim()) return;
    setContent("");
    addMsg(roomId, content);
  };

  useEffect(() => {
    loadMsg(roomId, 0);
  }, [roomId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [AllMsgs]);

  const handleScroll = (e) => {
    console.log(e);
  };

  console.log(AllMsgs);

  // useEffect(() => {
  //   socket.connect();

  //   socket.emit("msg", "hello monu is here");

  //   socket.on("recive", (data) => {
  //     console.log(data);
  //   });

  //   return () => {
  //     socket.off("connect", () => console.log("connected"));
  //     socket.off("disconnect", () => console.log("disconnected"));
  //   };
  // }, []);

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
            <ScrollArea
              className="h-185 rounded-md p-3 "
              onScroll={handleScroll}
            >
              {!AllMsgs?.length ? (
                <div className="h-150 flex items-center justify-center">
                  <div className="flex flex-col gap-1 items-center justify-center   ">
                    <div className="rounded  animate-bounce p-2 text-white">
                      <MessageSquareCode className="size-8" />
                    </div>
                    <p>No Conversations!!</p>
                  </div>
                </div>
              ) : (
                <>
                  {AllMsgs?.map(({ _id, timeStamp, content, name, image }) => (
                    <ChatBubble
                      key={_id}
                      name={name}
                      id={_id}
                      timeStamp={timeStamp}
                      content={content}
                      image={image}
                      roomId={roomId}
                    />
                  ))}
                  <div ref={endRef} />
                  {loading && (
                    <div>
                      <Spinner />
                      <span className="italic text-gray-500 text-sm font-semibold">
                        loading msgs...
                      </span>
                    </div>
                  )}
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
                onChange={(e) => setContent(e.target.value)}
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
