"use client";

import { ResizablePanel } from "@/components/ui/resizable";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const prompt = input.trim();

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    textareaRef.current?.style.setProperty("height", "24px");

    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message || "No response",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResizablePanel
      defaultSize={35}
      minSize={20}
      className="border-l border-[#2d2d30]"
    >
      <div className="flex h-full flex-col bg-[#1e1e1e]">
        {/* Header */}
        <div className="flex h-10 items-center justify-between border-b border-[#2d2d30] px-4">
          <h2 className="text-sm font-medium text-zinc-200">Codex AI</h2>

          <button
            onClick={() => setMessages([])}
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            Clear
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-[#252526] text-zinc-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-xl bg-[#252526] px-3 py-2 text-sm text-zinc-400">
                Thinking...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-[#2d2d30] p-3">
          {/* Future Model Selector */}
          <div className="mb-2 flex items-center gap-2">
            <button className="rounded-md bg-[#252526] px-2 py-1 text-xs text-zinc-300 hover:bg-[#333]">
              DeepSeek
            </button>

            <button className="rounded-md bg-[#252526] px-2 py-1 text-xs text-zinc-300 hover:bg-[#333]">
              Workspace
            </button>
          </div>

          <div
            className="
              flex
              items-end
              gap-2
              rounded-xl
              border
              border-[#3c3c3c]
              bg-[#252526]
              px-3
              py-2
              transition-colors
              focus-within:border-blue-500
            "
          >
            <textarea
              ref={textareaRef}
              value={input}
              rows={1}
              maxLength={4000}
              placeholder="Ask Codex AI..."
              className="
                flex-1
                resize-none
                bg-transparent
                text-sm
                text-zinc-100
                placeholder:text-zinc-500
                outline-none
                min-h-[24px]
                max-h-[200px]
                overflow-y-auto
              "
              onChange={(e) => {
                setInput(e.target.value);

                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                bg-blue-600
                text-white
                transition-all
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:bg-[#3c3c3c]
                disabled:text-zinc-500
              "
            >
              <Send size={15} />
            </button>
          </div>

          <div className="mt-2 flex justify-between text-[11px] text-zinc-500">
            <span>↵ Send • Shift + ↵ New line</span>
            <span>{input.length}/4000</span>
          </div>
        </div>
      </div>
    </ResizablePanel>
  );
}
