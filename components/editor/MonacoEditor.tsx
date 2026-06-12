"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Editor } from "@monaco-editor/react";
import { Code2 } from "lucide-react";

import TabBar from "./ui/TabBar";

import { socket } from "@/lib/socket";
import { getType } from "@/lib/features";
import { useCodestore } from "@/lib/store/Codestore";
import { useMonacoYjs } from "@/lib/yjs/useMonacoYjs";

import debounce from "lodash/debounce";

const COLORS = ["#ff4d4f", "#52c41a", "#1677ff", "#fa8c16"];

function MonacoEditor({ roomId, session }) {
  const {
    activeFileId,
    openFiles,
    code,
    saveFileContent,
    setFileEdited,
    updateContent,
  } = useCodestore();

  const [editor, setEditor] = useState(null);
  const savingRef = useRef(false);
  const handleSaveRef = useRef(null);

  // ACTIVE FILE
  const activeFile = useMemo(
    () => openFiles.find((f) => f._id === activeFileId),
    [openFiles, activeFileId],
  );

  // USER
  const user = useMemo(() => {
    const name = session?.user?.name || "Anonymous";
    return {
      name,
      color: COLORS[name.length % COLORS.length],
    };
  }, [session]);

  // YJS — Yjs owns the editor model, do NOT use value/onChange props
  useMonacoYjs({
    editor,
    socket,
    roomId,
    fileId: activeFileId,
    user,
  });

  // SAVE
  const handleSave = useMemo(
    () =>
      debounce(async () => {
        if (!editor || !activeFileId || savingRef.current) return;

        try {
          savingRef.current = true;

          const content = editor.getValue();

          updateContent(activeFileId, content);

          await saveFileContent(roomId, activeFileId, content);

          setFileEdited(activeFileId, false);
        } finally {
          savingRef.current = false;
        }
      }, 1000), // wait 1 second
    [
      editor,
      roomId,
      activeFileId,
      saveFileContent,
      setFileEdited,
      updateContent,
    ],
  );

  // Keep ref fresh so the keybinding never captures a stale closure
  useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);

  // MOUNT — register Ctrl+S once, call through ref
  const handleMount = useCallback((editorInstance, monaco) => {
    setEditor(editorInstance);

    editorInstance.addAction({
      id: "save-file",
      label: "Save File",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => handleSaveRef.current?.(),
    });
  }, []); // no deps — ref handles freshness

  // TRACK EDITS — show circle on user edits, skip Yjs flushes
  useEffect(() => {
    if (!editor || !activeFileId) return;

    const disposable = editor.onDidChangeModelContent((e) => {
      // isFlush = true → Yjs replaced the whole model (file switch), not a user edit
      if (!e.isFlush) {
        setFileEdited(activeFileId, true);
      }
    });

    return () => disposable.dispose();
  }, [editor, activeFileId]);

  const fileState = code[activeFileId];

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
        defaultValue={fileState?.content}
        defaultLanguage={getType(activeFile?.name)?.language}
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
