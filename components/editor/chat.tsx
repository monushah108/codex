"use client";

import { ResizablePanel } from "@/components/ui/resizable";
import { Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import Msg from "./ui/msg";
import { Spinner } from "../ui/spinner";
import { useLayout } from "@/context/layout-context";
import { useCodestore } from "@/lib/store/Codestore";
import { useCodeActions } from "@/lib/store/actions/useCodeAction";

export default function Chat() {
  const { panels } = useLayout();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const response = useCodestore((s) => s.response);
  console.log(response);
  const setClearResponse = useCodestore((s) => s.setClearResponse);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [response]);

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    try {
      const prompt = input.trim();

      await useCodeActions.generateCode(crypto.randomUUID(), prompt);

      setInput("");
      textareaRef.current?.style.setProperty("height", "24px");
    } catch (err) {
      console.error(err);
    }
  }, [input]);

  return (
    <ResizablePanel
      defaultSize={panels.chat ? 35 : 0}
      className="border-l border-[#2d2d30] "
    >
      <div className="flex h-full min-h-0 flex-col bg-[#1e1e1e]">
        {/* Header */}
        <div className="flex h-12  items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-4">
          <h2 className="text-sm font-medium text-zinc-200">Codex AI</h2>

          <button
            onClick={() => setClearResponse()}
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            Clear
          </button>
        </div>

        {/* Messages */}
        <ScrollArea.Root className="flex-1 overflow-hidden max-h-175">
          <ScrollArea.Viewport className="h-full">
            {/* <div className="mx-auto max-w-4xl space-y-5 p-4">
              {response.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] lg:max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "border border-[#2d2d30] bg-[#252526] text-zinc-200"
                    }`}
                  >
                    <Msg content={msg.content} />
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Spinner />
                    <span>Generating...</span>
                  </div>
                </div>
              )}
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div ref={bottomRef} />
            </div> */}
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>

        {/* Input */}
        <div className="border-t border-[#2d2d30] p-3">
          {/* Future Model Selector */}
          <div className="mb-2 flex  flex-col gap-2">
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
      </div>
    </ResizablePanel>
  );
}
