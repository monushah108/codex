"use client";
import { Suspense, useEffect, useRef, useState, useTransition } from "react";

import { ResizablePanel } from "../ui/resizable";
import FileExploreSkeleton from "./Skeleton/FileExploreSkeleton";
import { PanelImperativeHandle } from "react-resizable-panels";
import { useLayout } from "@/context/layout-context";
import { FileHeader } from "./ui/fileHeader";

import FolderItem from "./ui/folderItem";
import NoFolder from "./ui/noFolder";
import { Spinner } from "../ui/spinner";

import useExplorerSocket from "@/lib/hooks/useExplorerSocket";

import { useExplorerActions } from "@/lib/store/actions/useExplorerAction";
import { useCodestore } from "@/lib/store/Codestore";

function FileExplore({ roomId }: { roomId: string }) {
  const exRef = useRef<PanelImperativeHandle>(null);
  const { panels } = useLayout();

  const [selected, setSelected] = useState<string | null>(null);

  const [creating, setCreating] = useState<{
    parentId: string | null | undefined;
    type: "file" | "folder" | null;
  }>({
    parentId: null,
    type: null,
  });

  const explorerSync = useExplorerSocket({ roomId });

  const user = useCodestore((s) => s.user);

  const [root, setRoot] = useState("");

  useEffect(() => {
    getFolder();
  }, []);

  async function getFolder() {
    const res = await useExplorerActions.loadFolder(roomId);
    setRoot(res.rootFolder);
  }

  const handleCreateFile = () => {
    const parent = selected || root?._id;

    setCreating({
      parentId: parent,
      type: "file",
    });
  };

  const handleCreateFolder = () => {
    const parent = selected || root?._id;

    setCreating({
      parentId: parent,
      type: "folder",
    });
  };

  if (!root) {
    return <NoFolder />;
  }

  return (
    <ResizablePanel
      panelRef={exRef}
      collapsible
      collapsedSize={0}
      defaultSize={panels.explorer ? 20 : 0}
    >
      <Suspense fallback={<FileExploreSkeleton />}>
        <div className="flex flex-col h-full border-r border-[#2d2d30] bg-[#1e1e1e] text-gray-300">
          {/* Explorer Header */}
          <FileHeader
            handleCreateFile={handleCreateFile}
            handleCreateFolder={handleCreateFolder}
          />

          {root && (
            <FolderItem
              item={root}
              roomId={roomId}
              creating={creating}
              setCreating={setCreating}
              selected={selected}
              setSelected={setSelected}
              explorerSync={explorerSync}
              user={user}
            />
          )}
        </div>
      </Suspense>
    </ResizablePanel>
  );
}

export default FileExplore;
