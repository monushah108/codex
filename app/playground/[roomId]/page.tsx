import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import StatusBar from "@/components/editor/StatusBar";

import PlayHeader from "@/components/editor/playHeader";

import CodeWindow from "@/components/editor/CodeWindow";

import FileExplore from "@/components/editor/FileExplore";

import { cookies } from "next/headers";
import Chat from "@/components/editor/chat";
import NoRoom from "@/components/editor/ui/noRoom";
import PrivateRoom from "@/components/editor/ui/privateRoom";

export default async function Page({
  params,
}: {
  params: Promise<{
    roomId: string;
  }>;
}) {
  const { roomId } = await params;

  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/playground/${roomId}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },

      cache: "no-store",
    },
  );
  console.log(res.status);
  if (res.status === 400 || res.status === 404) {
    return <NoRoom />;
  } else if (res.status === 403) {
    return <PrivateRoom />;
  }

  return (
    <div className=" flex flex-col min-h-svh  bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden">
      {/* Header */}
      <PlayHeader />

      <ResizablePanelGroup orientation="horizontal" className="flex-1 w-full">
        {/* File Explorer */}

        <FileExplore roomId={roomId} />

        <ResizableHandle className="bg-[#2d2d30] hover:bg-blue-500 transition-colors duration-200" />

        {/* Center Column */}
        <CodeWindow roomId={roomId} />

        <ResizableHandle className="bg-[#2d2d30] hover:bg-blue-500 transition-colors duration-200" />

        <Chat />
      </ResizablePanelGroup>

      <StatusBar roomId={roomId} />
    </div>
  );
}
