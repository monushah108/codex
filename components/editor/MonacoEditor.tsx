"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Editor } from "@monaco-editor/react";
import { Code2 } from "lucide-react";

import TabBar from "./ui/TabBar";

import { socket } from "@/lib/socket";
import { getType } from "@/lib/features";
import { useCodestore } from "@/lib/store/Codestore";
import { useMonacoYjs } from "@/lib/yjs/useMonacoYjs";

const COLORS = ["#ff4d4f", "#52c41a", "#1677ff", "#fa8c16"];

function MonacoEditor({ roomId, session }) {
  const {
    activeFileId,
    openFiles,
    code,
    saveFileContent,
    setFileEdited,
    updateContent,
    generateCode,
  } = useCodestore();

  const [editor, setEditor] = useState(null);

  const generatingRef = useRef(false);

  const handleSaveRef = useRef(null);

  // ACTIVE FILE
  const activeFile = useMemo(
    () => openFiles.find((f) => f._id === activeFileId),
    [openFiles, activeFileId],
  );

  const cachedContent =
    code[activeFileId]?.content ?? "// your code is here...";

  // USER
  const user = useMemo(() => {
    const name = session?.user?.name || "Anonymous";
    return {
      name,
      color: COLORS[name.length % COLORS.length],
    };
  }, [session]);

  // YJS SYNC
  useMonacoYjs({
    editor,
    socket,
    roomId,
    fileId: activeFileId,
    user,
  });

  // SAVE LOGIC
  const handleSave = useCallback(async () => {
    if (!editor || !activeFileId) return;

    const content = editor.getValue();

    updateContent(activeFileId, content);

    await saveFileContent(roomId, activeFileId, content);

    setFileEdited(activeFileId, false);
  }, [
    editor,
    roomId,
    activeFileId,
    saveFileContent,
    setFileEdited,
    updateContent,
  ]);

  useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);

  // 🤖 AUTO AI GENERATION (MAIN FEATURE)
  useEffect(() => {
    if (!editor || !activeFileId) return;

    const disposable = editor.onDidChangeModelContent(async (e) => {
      if (e.isFlush) return;
      if (generatingRef.current) return;

      const value = editor.getValue();

      const match = value.match(/\/\/\s*generate:(.*)/i);

      if (!match) return;

      const prompt = match[1]?.trim();

      if (!prompt) return;

      generatingRef.current = true;

      try {
        await generateCode(activeFileId, prompt);

        const generated =
          useCodestore.getState().code[activeFileId]?.content || "";

        const model = editor.getModel();
        if (!model) return;

        editor.executeEdits("ai", [
          {
            range: model.getFullModelRange(),
            text: generated,
          },
        ]);

        editor.pushUndoStop();

        setFileEdited(activeFileId, true);
      } catch (err) {
        console.error("AI generation failed:", err);
      } finally {
        generatingRef.current = false;
      }
    });

    return () => disposable.dispose();
  }, [editor, activeFileId, generateCode, setFileEdited]);

  // MOUNT EDITOR
  const handleMount = useCallback((editorInstance, monaco) => {
    setEditor(editorInstance);
  }, []);

  // EDIT TRACKING
  useEffect(() => {
    if (!editor || !activeFileId) return;

    const disposable = editor.onDidChangeModelContent((e) => {
      if (!e.isFlush) {
        setFileEdited(activeFileId, true);
      }
    });

    return () => disposable.dispose();
  }, [editor, activeFileId, setFileEdited]);

  // EMPTY STATE
  if (!activeFileId) {
    return (
      <div className="h-full">
        <TabBar />

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
      <TabBar />

      <Editor
        key={activeFileId}
        height="100%"
        width="100%"
        theme="vs-dark"
        defaultValue={cachedContent}
        defaultLanguage={getType(activeFile?.name)?.language}
        onMount={handleMount}
        options={{
          fontSize: 14,
          fontFamily: "Fira Code, monospace",
          minimap: { enabled: false },
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
