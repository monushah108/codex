"use client";

import { memo, useEffect, useRef, useState } from "react";

import * as ScrollArea from "@radix-ui/react-scroll-area";

import { ArrowBigRight, TerminalIcon, Trash } from "lucide-react";

import { socket } from "@/lib/socket";

import { useCodestore } from "@/lib/store/Codestore";

const Terminal = memo(function Terminal({ roomId }) {
  const [userInput, setUserInput] = useState("");

  const terminalRef = useRef<HTMLDivElement>(null);

  const { outputs, activeFileId, addOutput, clearOutputs } = useCodestore();

  // JOIN ROOM
  useEffect(() => {
    socket.emit("terminal:join", roomId);
  }, [roomId]);

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

    return () => {
      socket.off("terminal:output", handleOutput);
    };
  }, [addOutput]);

  // AUTO SCROLL
  useEffect(() => {
    terminalRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [outputs]);

  // COMMAND
  const handleExecuteCommand = (e: any) => {
    e.preventDefault();

    if (!userInput.trim() || !activeFileId) return;

    socket.emit("terminal:command", {
      roomId,
      command: userInput.trim(),
    });

    setUserInput("");
  };

  const prompt = () => <ArrowBigRight className="w-3 h-3" />;

  return (
    <div className="relative flex flex-col">
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
        className="bg-[#1e1e1e] font-mono text-white"
        style={{
          height: "300px",
        }}
      >
        <ScrollArea.Viewport className="h-full w-full">
          {outputs.map(({ id, output, error }) => (
            <div key={id} className="px-2 pb-2">
              <div className="flex items-center gap-1">{prompt()}</div>

              <pre
                className={`ml-5 whitespace-pre-wrap text-xs ${
                  error ? "text-red-500" : "text-gray-300"
                }`}
              >
                {output}
              </pre>
            </div>
          ))}

          <form onSubmit={handleExecuteCommand}>
            <div className="flex items-center gap-1 p-2">
              {prompt()}

              <input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 bg-transparent text-xs outline-none"
              />
            </div>
          </form>

          <div ref={terminalRef} />
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    </div>
  );
});

export default Terminal;
