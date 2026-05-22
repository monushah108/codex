"use client";

import { memo, useEffect, useRef, useState } from "react";

import * as ScrollArea from "@radix-ui/react-scroll-area";

import { ArrowBigRight, TerminalIcon, Trash } from "lucide-react";

import { socket } from "@/lib/socket";

import { useCodestore } from "@/lib/store/Codestore";

const Terminal = memo(function Terminal({ roomId }) {
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  const { outputs, addOutput, clearOutputs } = useCodestore();

  // RECEIVE OUTPUT
  useEffect(() => {
    const handleOutput = (data: any) => {
      addOutput({
        id: crypto.randomUUID(),

        output: data.output,

        error: data.error,
      });
    };

    socket.on("terminal:output", handleOutput);

    return () => socket.off("terminal:output", handleOutput);
  }, [addOutput]);

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

    socket.emit("terminal:command", {
      roomId,
      command: input,
    });

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
