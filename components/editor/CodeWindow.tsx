"use client";

import React, { lazy, Suspense, useRef } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import EditorSkeleton from "./Skeleton/codeWindowSkeleton";
import TerminalSkeleton from "./Skeleton/TerminalSkeleton";
import { PanelImperativeHandle } from "react-resizable-panels";
import { useLayout } from "@/context/layout-context";

const Terminal = lazy(() => import("./Terminal"));
const MonacoEditor = lazy(() => import("./MonacoEditor"));

const CodeWindow = React.memo(function CodeWindow() {
  const terminalRef = useRef<PanelImperativeHandle>(null);
  const { isCollapse } = useLayout();
  return (
    <ResizablePanel defaultSize={60}>
      <ResizablePanelGroup orientation="vertical" className="h-full">
        {/* Code Editor */}
        <ResizablePanel defaultSize={60}>
          <Suspense fallback={<EditorSkeleton />}>
            <MonacoEditor />
          </Suspense>
        </ResizablePanel>

        <ResizableHandle className="bg-[#2d2d30] hover:bg-blue-500 transition-colors duration-200" />

        {/* Terminal */}
        <ResizablePanel
          panelRef={terminalRef}
          defaultSize={isCollapse.terminal ? 40 : 0}
          minSize={0}
          collapsible
          collapsedSize={0}
        >
          <Suspense fallback={<TerminalSkeleton />}>
            <Terminal />
          </Suspense>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
});

export default CodeWindow;
