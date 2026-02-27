"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";
import {
  CircleX,
  CopyIcon,
  Delete,
  Edit3,
  EllipsisVertical,
  X,
} from "lucide-react";
import { Fira_Code } from "next/font/google";
import { useState } from "react";

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function ChatBubble({ name, content, time }) {
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [textValue, setTextValue] = useState(content);

  const isLong = content.length > 248;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
  };

  const handleEdit = (e) => {
    setTextValue(e.target.value);
  };

  const handleDelete = () => {};

  return (
    <div
      className={`${firaCode.className} 
        bg-slate-800 
        text-slate-200 
        px-4 py-3 
        rounded-lg 
        max-w-md 
        shadow-md 
        mt-4`}
    >
      {/* Header */}
      <div className="flex justify-between items-center text-sm font-medium">
        <span className="capitalize">{name}</span>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          {time}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded hover:bg-slate-700 transition">
                <EllipsisVertical className="size-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-slate-800 
        text-slate-200  border-slate-800 shadow-md"
            >
              <DropdownMenuItem onClick={handleCopy}>
                Copy <CopyIcon />
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleDelete} className="text-red-400">
                Delete <CircleX />
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setIsEdit(true)}>
                Edit <Edit3 />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Separator className="my-2 bg-slate-600" />

      {/* Code Content */}
      {isEdit ? (
        <div className="space-y-2">
          <textarea
            autoFocus
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            className="w-full bg-slate-900 text-slate-200 
               text-sm p-3 rounded-md 
               border border-slate-700 
               focus:outline-none focus:ring-2 focus:ring-blue-500
               resize-none"
            rows={4}
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setTextValue(content);
                setIsEdit(false);
              }}
              className="text-xs px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 transition"
            >
              Cancel
            </button>

            <button
              onClick={() => setIsEdit(false)}
              className="text-xs px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 transition"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <pre
          className={`text-sm whitespace-pre-wrap break-words transition-all duration-300 ${
            !show && isLong ? "max-h-40 overflow-hidden" : ""
          }`}
        >
          {content}
        </pre>
      )}

      {/* Expand Toggle */}
      {isLong && (
        <button
          onClick={() => setShow(!show)}
          className="text-xs text-blue-400 mt-2 hover:text-blue-300 transition"
        >
          {show ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
