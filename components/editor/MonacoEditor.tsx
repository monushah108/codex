"use client";

import React, { useEffect, useRef } from "react";
import TabBar from "./ui/TabBar";
import { Code2 } from "lucide-react";
import { Editor } from "@monaco-editor/react";
import { useCodestore } from "@/lib/store/Codestore";
import { getType } from "@/lib/features";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { WebsocketProvider } from "y-websocket";
import type * as MonacoNamespace from "monaco-editor";

type MonacoEditorProps = {
  roomId: string;
};

export default function MonacoEditor({ roomId }: MonacoEditorProps) {
  const activeFileId = useCodestore((s) => s.activeFileId);
  const cache = useCodestore((s) =>
    activeFileId ? s.code[activeFileId] : undefined,
  );
  const setEdited = useCodestore((s) => s.setFileEdited);
  const saveFileContent = useCodestore((s) => s.saveFileContent);
  const updateContent = useCodestore((s) => s.updateContent);
  const openFiles = useCodestore((s) => s.openFiles);

  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const editorRef = useRef<MonacoNamespace.editor.IStandaloneCodeEditor | null>(
    null,
  );

  const cleanup = () => {
    if (bindingRef.current) {
      bindingRef.current.destroy();
      bindingRef.current = null;
    }
    if (providerRef.current) {
      providerRef.current.destroy();
      providerRef.current = null;
    }
    if (ydocRef.current) {
      ydocRef.current.destroy();
      ydocRef.current = null;
    }
  };

  useEffect(() => {
    if (!activeFileId) return;

    cleanup();

    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const url = `${protocol}://${window.location.host}/yjs`;
    const docName = `${roomId}-${activeFileId}`;
    const provider = new WebsocketProvider(url, docName, ydoc);
    providerRef.current = provider;
    provider.awareness.setLocalStateField("user", {
      name: "Anonymous",
    });

    provider.on("status", ({ status }) => {
      console.log("[yjs] status", status, "doc", docName);
    });

    const yText = ydoc.getText("monaco");
    const initialValue = cache?.content || "";
    if (yText.length === 0 && initialValue) {
      yText.insert(0, initialValue);
    }

    const existingModel = editorRef.current?.getModel();
    if (editorRef.current && existingModel) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const awareness = provider.awareness as any;
      bindingRef.current = new MonacoBinding(
        yText,
        existingModel,
        new Set([editorRef.current]),
        awareness,
      );
    }

    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, activeFileId]);

  useEffect(() => {
    return () => cleanup();
  }, []);

  const handleMount = (
    editor: MonacoNamespace.editor.IStandaloneCodeEditor,
    monaco: typeof MonacoNamespace,
  ) => {
    editorRef.current = editor;

    editor.addAction({
      id: "save-file",
      label: "Save File",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: async () => {
        const content = editor.getModel()?.getValue();
        if (!activeFileId || content === undefined) return;
        await saveFileContent(roomId, activeFileId, content);
        setEdited(activeFileId, false);
      },
    });

    const ydoc = ydocRef.current;
    const provider = providerRef.current;

    const editorModel = editor.getModel();
    if (ydoc && provider && !bindingRef.current && editorModel) {
      const yText = ydoc.getText("monaco");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const awareness = provider.awareness as any;
      bindingRef.current = new MonacoBinding(
        yText,
        editorModel,
        new Set([editor]),
        awareness,
      );

      if (yText.length === 0 && cache?.content) {
        yText.insert(0, cache.content);
      }
    }
  };

  const activeFile = openFiles.find((f) => f._id === activeFileId);
  const language = getType(activeFile?.name ?? "")?.language || "javascript";

  return (
    <div className="h-full">
      <TabBar />

      <div className="flex flex-col justify-center items-center bg-[#1e1e1e] h-full">
        {!activeFileId ? (
          <div className="flex items-center flex-col justify-center">
            <Code2 className="w-20 h-20 text-[#007acc]/30" />
            <div className="text-center">
              <p className="text-lg mb-2">No file open</p>
              <p className="text-xs text-gray-300/50">
                Select a file from the explorer to start editing
              </p>
            </div>
          </div>
        ) : (
          <Editor
            key={activeFileId}
            height="100%"
            width="100%"
            theme="vs-dark"
            defaultLanguage={language}
            defaultValue={cache?.content || "// your code is here..."}
            onMount={handleMount}
            onChange={(value) => {
              if (!activeFileId) return;
              updateContent(activeFileId, value || "");
              setEdited(activeFileId, true);
            }}
            options={{
              fontSize: 14,
              fontFamily: "Fira Code, monospace",
              minimap: { enabled: false },
              lineNumbers: "on",
              automaticLayout: true,
            }}
          />
        )}
      </div>
    </div>
  );
}
