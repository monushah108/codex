"use client";

import { memo, useEffect, useRef, useState } from "react";

import * as ScrollArea from "@radix-ui/react-scroll-area";

import { ArrowBigRight, TerminalIcon, Trash } from "lucide-react";

import { useCodestore } from "@/lib/store/Codestore";

const Terminal = memo(function Terminal() {
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  const { outputs, clearOutputs } = useCodestore();

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [outputs]);

  // COMMAND
  const runCommand = (e: any) => {
    e.preventDefault();

    if (!input.trim()) return;

    setInput("");
  };

  return (
    <div className="flex flex-col">
      <div className="flex h-9 items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-3">
        <div className="flex items-center gap-2 text-xs">
          <TerminalIcon className="size-3" />
          TERMINAL
        </div>

        <button onClick={clearOutputs}>
          <Trash className="size-3" />
        </button>
      </div>

      <ScrollArea.Root
        className="bg-[#1e1e1e] text-white font-mono"
        style={{
          height: 300,
        }}
      >
        <ScrollArea.Viewport className="h-full w-full p-2">
          {outputs.map(({ id, output, error }) => (
            <pre
              key={id}
              className={`mb-2 text-xs whitespace-pre-wrap ${
                error ? "text-red-500" : "text-gray-300"
              }`}
            >
              {output}
            </pre>
          ))}

          <form onSubmit={runCommand} className="flex items-center gap-2">
            <ArrowBigRight className="size-3" />

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-xs"
            />
          </form>

          <div ref={bottomRef} />
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    </div>
  );
});

export default Terminal;
