"use client";

import { useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

type Props = {
  content: string;
};

export default function Msg({ content }: Props) {
  const [expanded, setExpanded] = useState(false);

  const LIMIT = 1000;
  const isLong = content.length > LIMIT;

  const preview = content.slice(0, LIMIT);

  return (
    <div className="space-y-2">
      {expanded ? (
        <ScrollArea.Root className="h-[500px] overflow-hidden rounded-lg border border-[#3c3c3c] bg-[#1a1a1a]">
          <ScrollArea.Viewport className="h-full w-full p-3">
            <pre
              className="
                whitespace-pre-wrap
                break-words
                font-mono
                text-xs
                leading-6
                text-zinc-200
              "
            >
              {content}
            </pre>
          </ScrollArea.Viewport>

          <ScrollArea.Scrollbar
            orientation="vertical"
            className="
              flex
              w-2
              touch-none
              select-none
              bg-transparent
            "
          >
            <ScrollArea.Thumb
              className="
                relative
                flex-1
                rounded-full
                bg-zinc-600
              "
            />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      ) : (
        <pre
          className="
            whitespace-pre-wrap
            break-words
            font-mono
            text-xs
            leading-6
            text-zinc-200
          "
        >
          {isLong ? `${preview}...` : content}
        </pre>
      )}

      {isLong && (
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">
            {content.length.toLocaleString()} characters
          </span>

          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="
              rounded-md
              px-2
              py-1
              text-xs
              font-medium
              text-blue-400
              transition-colors
              hover:bg-[#333]
              hover:text-blue-300
            "
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}
