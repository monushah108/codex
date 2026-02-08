import { lazy, Suspense } from "react";
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
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "playground",
};
export default function Page() {
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

      <TabBar />

      <div className="flex-1 w-full">
        <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
          {/* File Explorer */}
          <ResizablePanel defaultSize={20} collapsedSize={0} collapsible>
            <Suspense fallback={<FileExploreSkeleton />}>
              <FileExplore />
            </Suspense>
          </ResizablePanel>

          <ResizableHandle className="bg-[#2d2d30] hover:bg-blue-500 transition-colors duration-200" />

          {/* Center Column */}
          <ResizablePanel defaultSize={60}>
            <ResizablePanelGroup orientation="vertical" className="h-full">
              {/* Code Editor */}
              <ResizablePanel defaultSize={60}>
                <Suspense fallback={<EditorSkeleton />}>
                  <CodeWindow />
                </Suspense>
              </ResizablePanel>

              <ResizableHandle className="bg-[#2d2d30] hover:bg-blue-500 transition-colors duration-200" />

              {/* Terminal */}
              <ResizablePanel defaultSize={40} collapsedSize={0} collapsible>
                <Suspense fallback={<TerminalSkeleton />}>
                  <Terminal />
                </Suspense>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle className="bg-[#2d2d30] hover:bg-blue-500 transition-colors duration-200" />

          {/* Chat */}
          <ResizablePanel defaultSize={20} collapsedSize={0} collapsible>
            <Suspense
              fallback={<div className="p-4 text-sm">Loading chat…</div>}
            >
              <ChatBox />
            </Suspense>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <StatusBar />
    </div>
  );
}
