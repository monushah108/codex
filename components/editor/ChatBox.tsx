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
// import { socket } from "@/lib/socket";
import { ResizablePanel } from "../ui/resizable";
import { Input } from "../ui/input";

import { useLayout } from "@/context/layout-context";
import ChatBoxSkeleton from "./Skeleton/chatBoxSkeleton";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";

const ChatBox = memo(function ChatBox({ roomId }) {
  const [msgs, setMsgs] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const { isCollapse } = useLayout();

  const getMsgs = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat?roomId=${roomId}&cursor=${123}`, {
        credentials: "include",
      });

      const data = await res.json();

      setMsgs((pre) => [...pre, ...data]);
    } catch (err) {
      console.log(err);
      toast.error("something went wrong!!");
    }
  }, [roomId]);

  useEffect(() => {
    getMsgs();
  }, [getMsgs]);

  const PostMsg = async () => {
    if (!content.trim()) return;
    setContent("");

    const msgId = crypto.randomUUID();

    const tempMsg = {
      _id: msgId,
      content,
      name: "You",
      image: "",
      timeStamp: new Date().toISOString(),
    };

    setMsgs((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content, roomId, msgId }),
      });
      const msg = await res.json();

      setMsgs((prev) => prev.map((m) => (m._id === msg.msgId ? msg : m)));
    } catch (err) {
      console.log(err);
      toast.error("Message failed");
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

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
            <ScrollArea className="h-[740px] rounded-md p-3 ">
              {!msgs.length ? (
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
                  {msgs.map(({ _id, timeStamp, content, name, image }) => (
                    <ChatBubble
                      key={_id}
                      name={name}
                      id={_id}
                      timeStamp={timeStamp}
                      content={content}
                      image={image}
                      setMsgs={setMsgs}
                      getMsgs={getMsgs}
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
