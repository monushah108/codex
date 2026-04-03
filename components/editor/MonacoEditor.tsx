import React, { useState } from "react";
import TabBar from "./ui/TabBar";
import { Code2 } from "lucide-react";
import { Editor } from "@monaco-editor/react";
import { useExplorerstore } from "@/lib/store/Explorerstore";

export default function MonacoEditor() {
  const activeFileId = useExplorerstore((s) => s.activeFileId);
  const [code, setCode] = useState("// Your code here...");
  const setEdited = useExplorerstore((s) => s.setFileEdited);

  const handleMount = (editor, monaco) => {
    editor.addAction({
      id: "save-file",
      label: "Save File",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        console.log("Saving file...");
        setEdited(activeFileId, false);
      },
    });
  };

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
            height="100%"
            width="100%"
            theme="vs-dark"
            defaultLanguage="javascript"
            value={code}
            onMount={handleMount}
            onChange={(value) => {
              setCode(value || "");
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
