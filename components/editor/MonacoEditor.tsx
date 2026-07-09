"use client";

import { memo, useMemo } from "react";
import { Editor, OnMount } from "@monaco-editor/react";

import { Code2 } from "lucide-react";

import TabBar from "./ui/TabBar";

import { getType } from "@/lib/features";
import { useCodestore } from "@/lib/store/Codestore";
import { useYjs } from "@/lib/hooks/useYjs";

function MonacoEditor({ roomId }: { roomId: string }) {
  const { activeFileId, openFiles, saveFileContent } = useCodestore();

  const activeFile = useMemo(
    () => openFiles.find((file) => file._id === activeFileId),
    [openFiles, activeFileId],
  );

  const { yText, awareness } = useYjs(roomId, activeFileId ?? " ");

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

  const handleMount: OnMount = async (editor, monaco) => {
    const model = editor.getModel();

    if (!model) return;

    const { MonacoBinding } = await import("y-monaco");

    new MonacoBinding(yText, model, new Set([editor]), awareness);

    // const disposable = editor.onDidChangeModelContent((e) => {
    //   if (e.isFlush) return;

    //   setFileEdited(activeFileId, true);
    // });

    // editor.onDidDispose(() => {
    //   disposable.dispose();
    //   binding.destroy();
    // });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
      await saveFileContent(roomId, activeFileId, yText.toString());
    });
  };

  return (
    <div className="h-full">
      <TabBar roomId={roomId} />

      <Editor
        key={activeFileId}
        height="100%"
        theme="vs-dark"
        defaultLanguage={getType(activeFile?.name ?? "")?.language}
        onMount={handleMount}
        options={{
          fontSize: 14,
          fontFamily: "Fira Code, monospace",
          automaticLayout: true,
          smoothScrolling: true,
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          minimap: {
            enabled: false,
          },
        }}
      />
    </div>
  );
}

export default memo(MonacoEditor);
