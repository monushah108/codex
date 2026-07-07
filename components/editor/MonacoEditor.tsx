"use client";

import { memo, useMemo } from "react";

import { Editor } from "@monaco-editor/react";
import { Code2 } from "lucide-react";

import TabBar from "./ui/TabBar";

import { getType } from "@/lib/features";
import { useCodestore } from "@/lib/store/Codestore";

function MonacoEditor({ roomId }: { roomId: string }) {
  const { activeFileId, openFiles } = useCodestore();

  const activeFile = useMemo(
    () => openFiles.find((f) => f._id === activeFileId),
    [openFiles, activeFileId],
  );

  const handleMount = () => {};

  // EMPTY STATE
  if (!activeFileId) {
    return (
      <div className="h-full">
        <div className="flex h-full flex-col items-center justify-center bg-[#1e1e1e]">
          <Code2 className="h-20 w-20 text-[#007acc]/30" />
          <div className="mt-3 text-center">
            <p className="text-lg text-white">No file open</p>
            <p className="text-xs text-gray-400">Select a file from explorer</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <TabBar roomId={roomId} />

      <Editor
        key={activeFileId}
        height="100%"
        width="100%"
        theme="vs-dark"
        defaultLanguage={getType(activeFile?.name as string)?.language}
        onMount={handleMount}
        options={{
          fontSize: 14,
          fontFamily: "Fira Code, monospace",

          minimap: {
            enabled: false,
          },

          lineNumbers: "on",
          automaticLayout: true,
          smoothScrolling: true,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}

export default memo(MonacoEditor);
