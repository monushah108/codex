"use client";
import { lazy, useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import StatusBar from "@/components/editor/StatusBar";
const CodeWindow = lazy(() => import("@/components/editor/CodeWindow"));
const FileExplore = lazy(() => import("@/components/editor/FileExplore"));
const ChatBox = lazy(() => import("@/components/editor/ChatBox"));
import PlayHeader from "@/components/editor/playHeader";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const [showExplorer, setShowExplorer] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const { roomId } = useParams();
  const router = useRouter();

  useEffect(() => {
    IsvalidUser();
  }, []);

  const IsvalidUser = async () => {
    try {
      const res = await fetch(`/api/playground/${roomId}`, {
        credentials: "include",
      });

      if (res.status == 403) {
        router.push(`/playground/join/${roomId}`);
      } else if (res.status == 400) {
      }
    } catch {
      router.push("/");
    }
  };

  return (
    <div className=" flex flex-col min-h-svh  bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden">
      {/* Header */}
      <PlayHeader />

      <div className="flex-1 w-full">
        <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
          {/* File Explorer */}

          {showExplorer && <FileExplore />}

          <ResizableHandle className="bg-[#2d2d30] hover:bg-blue-500 transition-colors duration-200" />

          {/* Center Column */}
          <CodeWindow />

          <ResizableHandle className="bg-[#2d2d30] hover:bg-blue-500 transition-colors duration-200" />

          {/* Chat */}
          {showChat && <ChatBox />}
        </ResizablePanelGroup>
      </div>

      <StatusBar />
    </div>
  );
}
