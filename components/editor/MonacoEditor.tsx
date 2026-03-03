import React from "react";
import TabBar from "./ui/TabBar";
import { Code2 } from "lucide-react";
import { Editor } from "@monaco-editor/react";

export default function MonacoEditor() {
  return (
    <div className="h-full">
      <TabBar />
      <div className="flex flex-col justify-center items-center bg-[#1e1e1e] h-full ">
        <div className="flex items-center flex-col justify-center">
          <Code2 className="w-20 h-20 text-[#007acc]/30" />
          <div className="text-center ">
            <p className="text-lg mb-2">No file open</p>
            <p className="text-xs text-gray-300/50">
              Select a file from the explorer to start editing
            </p>
          </div>
        </div>

        {/* <Editor
          height="100%"
          width="100%"
          theme="vs-dark"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 14,
            fontFamily: "Fira Code, monospace",
            minimap: { enabled: false },
            lineNumbers: "on",
            automaticLayout: true,
          }}
        /> */}
      </div>
    </div>
  );
}
