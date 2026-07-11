"use client";

import { memo, useMemo, useRef } from "react";
import { Editor, OnMount } from "@monaco-editor/react";

import { Code2 } from "lucide-react";

import TabBar from "./ui/TabBar";

import "./styles/monaco.css";

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
  /* TODO: handleMount inside handleMount, but never removing that listener. After opening and closing many files, those listeners will accumulate. I can show you a production-grade version of MonacoEditor that fixes that, removes the remaining memory leaks, and simplifies the */

  const updateCursorLabels = () => {
    const myId = awareness.clientID;

    for (const [clientId, state] of awareness.getStates()) {
      const cursor = document.querySelector(
        `.yRemoteSelectionHead-${clientId}`,
      ) as HTMLElement | null;

      if (!cursor) continue;

      // Hide my own collaborative cursor
      if (clientId === myId) {
        cursor.style.display = "none";

        cursor.querySelector(".cursor-name")?.remove();

        continue;
      }

      // Show remote users' cursors
      cursor.style.display = "";
      cursor.style.backgroundColor = state.user?.color ?? "#3b82f6";
      // Remove previous label
      cursor.querySelector(".cursor-name")?.remove();

      // Add new label
      const label = document.createElement("div");
      label.className = "cursor-name";
      label.innerHTML = `
<div class="cursor-badge">
    <img
        class="cursor-avatar"
        src="${state.user?.image ?? ""}"
        alt=""
    />

    <span class="cursor-text">
        ${state.user?.name ?? "Anonymous"}
    </span>

    <div class="cursor-arrow"></div>
</div>
`;
      const badge = label.querySelector(".cursor-badge") as HTMLElement;
      badge.style.backgroundColor = state.user?.color ?? "#3b82f6";

      cursor.appendChild(label);
    }
  };

  const handleMount: OnMount = async (editor, monaco) => {
    const model = editor.getModel();

    if (!model) return;

    const { MonacoBinding } = await import("y-monaco");

    new MonacoBinding(yText, model, new Set([editor]), awareness);

    // 👇 Add this here
    // editor.onDidDispose(() => {
    //   console.log("Destroying binding");
    //   binding.destroy();
    // });

    awareness.on("change", () => {
      requestAnimationFrame(updateCursorLabels);
    });

    editor.onDidChangeModelContent(() => {
      requestAnimationFrame(updateCursorLabels);
    });

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
          cursorBlinking: "smooth",
          cursorStyle: "line",
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
