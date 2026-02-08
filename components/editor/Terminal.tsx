"use client";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import {
  ArrowBigRight,
  ChevronDown,
  TerminalIcon,
  Trash,
  X,
} from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

const Terminal = memo(function Terminal({
  handleTerminalToggle,
  output,
  setOutput,
}) {
  const [userInput, setuserInput] = useState("");
  const TerminalRef = useRef(null);

  const commands = {
    help: "Available commands: run code, help, clear",
    "run code": "Code run successful",
    clear: () => setOutput([]),
  };

  const handleExecuteCommand = (e) => {
    e.preventDefault();
    const input = userInput.trim();

    let outputType = "info";
    let outputValue = "";

    if (commands[input]) {
      if (typeof commands[input] == "function") {
        commands[input]();
        return;
      }
      outputType = "success";
      outputValue = commands[input];
    } else {
      outputType = "error";
      outputValue = "command not found";
    }

    setOutput((pre) => [
      ...pre,
      {
        id: crypto.randomUUID(),
        cmd: userInput,
        outputType,
        outputValue,
      },
    ]);

    setuserInput("");
  };

  useEffect(() => {
    TerminalRef.current?.scrollIntoView({ behavior: "smooth" });
    const input = TerminalRef.current?.querySelector("input");
    input?.focus();
  }, [output]);

  const getOutputColor = (type: string) => {
    switch (type) {
      case "error":
        return "text-[#f48771]";
      case "success":
        return "text-[#89d185]";
      case "info":
        return "text-[#75beff]";
      case "input":
        return "text-[#cccccc]";
      default:
        return "text-[#cccccc]";
    }
  };

  const prompt = () => (
    <div>
      <ArrowBigRight className="w-3 h-3" />
    </div>
  );

  return (
    <div className="relative flex flex-col">
      <div className="h-[35px] flex items-center justify-between px-3 py-1 border-b border-[#2d2d30] bg-[#252526]">
        <div className="flex flex-1 items-center gap-3 ">
          <TerminalIcon className="size-3" />
          <span className="text-xs">TERMINAL</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setOutput([])}>
            <Trash className="size-3" />
          </button>
          <button onClick={handleTerminalToggle}>
            <ChevronDown className="size-3" />
          </button>
          <button onClick={handleTerminalToggle}>
            <X className="size-3" />
          </button>
        </div>
      </div>

      <ScrollArea.Root
        className="rounded-md bg-[#1e1e1e] text-white font-mono  "
        style={{ height: "300px" }}
      >
        <ScrollArea.Viewport className="w-full h-full">
          <div className="p-3 text-sm">
            <p className="text-blue-400">Vs code like terminal </p>
            <p className="text-gray-500 text-xs">
              you can just run your code it's not so advance{" "}
            </p>
          </div>
          {/* {output.map(({ id, outputValue, outputType, cmd }) => (
            <div key={id}>
              <div className="flex gap-1 p-2 items-center">
                {prompt()}
                <input
                  className="outline-none flex-1 text-xs"
                  disabled={!!outputValue}
                  value={cmd}
                />
              </div>
              <pre className={`ml-6 text-xs ${getOutputColor(outputType)}`}>
                {outputValue}
              </pre>
            </div>
          ))} */}
          <form onSubmit={handleExecuteCommand}>
            <div
              className="flex items-center gap-1 p-2 group"
              ref={TerminalRef}
            >
              {prompt()}
              <span className="cursor-blink  group-has-[input:focus]:hidden text-xs" />
              <input
                className="outline-none flex-1 text-xs "
                value={userInput}
                onChange={(e) => setuserInput(e.target.value)}
                autoFocus
              />
            </div>
          </form>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar
          orientation="vertical"
          className="flex select-none touch-none p-0.5 bg-[#252526]"
        >
          <ScrollArea.Thumb className="flex-1 bg-[#555] rounded" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>
    </div>
  );
});

export default Terminal;
