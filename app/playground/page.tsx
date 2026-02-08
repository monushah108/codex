"use client";

import { lazy, Suspense, useState } from "react";
import EditorSkeleton from "@/components/editor/Skeleton/codeWindowSkeleton";
import FileExploreSkeleton from "@/components/editor/Skeleton/FileExploreSkeleton";
import TerminalSkeleton from "@/components/editor/Skeleton/TerminalSkeleton";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import TabBar from "@/components/editor/TabBar";
import StatusBar from "@/components/editor/StatusBar";

const CodeWindow = lazy(() => import("@/components/editor/CodeWindow"));
const FileExplore = lazy(() => import("@/components/editor/FileExplore"));
const Terminal = lazy(() => import("@/components/editor/Terminal"));
const ChatBox = lazy(() => import("@/components/editor/ChatBox"));

export default function Page() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<any[]>([]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden">
      {/* Header */}
      <div className="h-[35px] shrink-0 bg-[#323233] border-b border-[#2d2d30] flex items-center px-3">
        <div className="flex gap-1">
          <span className="bg-red-500 w-3 h-3 rounded-full" />
          <span className="bg-yellow-500 w-3 h-3 rounded-full" />
          <span className="bg-green-500 w-3 h-3 rounded-full" />
        </div>
        <h1 className="flex-1 text-center text-sm">
          Collaborative Code Editor
        </h1>
      </div>

      <TabBar setOutput={setOutput} code={code} />

      <div className="flex-1 h-full w-full">
        <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
          {/* File Explorer */}
          <ResizablePanel defaultSize={20}>
            <FileExplore />
          </ResizablePanel>

          <ResizableHandle />

          {/* Center column */}
          <ResizablePanel defaultSize={60}>
            <ResizablePanelGroup orientation="vertical" className="h-full">
              <ResizablePanel defaultSize={65}>
                <CodeWindow />
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel defaultSize={35}>
                <Terminal />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle />

          {/* Chat */}
          <ResizablePanel defaultSize={20}>
            <ChatBox />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <StatusBar />
    </div>
  );
}
