"use client";

import { memo, useEffect, useRef, useState } from "react";

import * as ScrollArea from "@radix-ui/react-scroll-area";

import { ArrowBigRight, TerminalIcon, Trash } from "lucide-react";

import { useCodestore } from "@/lib/store/Codestore";

const Terminal = memo(function Terminal({ roomId }: { roomId: string }) {
  const [userInput, setUserInput] = useState("");

  const terminalRef = useRef<HTMLDivElement>(null);

  const { outputs, activeFileId, runCommand, clearOutputs } = useCodestore();
  const code = useCodestore((s) => s.code);

  const running = activeFileId ? code[activeFileId]?.running : false;
  // AUTO SCROLL
  useEffect(() => {
    terminalRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [outputs]);

  // COMMAND
  const handleExecuteCommand = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userInput.trim() || !activeFileId) return;

    await runCommand(userInput.trim(), activeFileId);

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

      <div className="flex items-center gap-2 px-3 py-1 mb-5 mt-2">
        <TerminalIcon className="size-4 text-gray-300 animate-pulse" />
        <span className="text-xs text-gray-500">
          this is not so advance terminal you can see output of your code
        </span>
      </div>

      <ScrollArea.Root className="h-[300px] bg-[#1e1e1e] font-mono text-white overflow-hidden">
        <ScrollArea.Viewport className="h-full w-full">
          {outputs.map((item) => (
            <div key={item.id} className="px-2 pb-2">
              <div className="flex items-center gap-1">{prompt()}</div>

              <pre
                className={`ml-5 whitespace-pre-wrap break-words rounded-md p-2 text-xs ${
                  item.error || item.stderr
                    ? "bg-red-950/30 text-red-400"
                    : "bg-zinc-900 text-green-300"
                }`}
              >
                {item.stdout ||
                  item.stderr ||
                  item.compile_output ||
                  item.message ||
                  item.error}
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

          {running && (
            <div className="px-2 py-1">
              <div className="flex items-center gap-2 text-yellow-400 text-xs">
                <span className="animate-spin">◌</span>
                <span>Executing code...</span>
              </div>
            </div>
          )}

          <div ref={terminalRef} />
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="vertical"
          className="w-2 bg-[#252526]"
        >
          <ScrollArea.Thumb className="bg-[#555] rounded-full" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
});

export default Terminal;
