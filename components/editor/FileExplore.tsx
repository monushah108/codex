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

import debounce from "lodash/debounce";
import { useExplorerstore } from "@/lib/store/Explorerstore";

type FileItem = {
  _id: string;
  name: string;
  parentDirId: string | null;
  roomId: string;
  isEdited?: boolean;
  isDeleted?: boolean;
};

interface docProp {
  rootDir: FileItem | null;
  _id: string;
  name: string;
  isEdited?: boolean;
}

function FileExplore({ roomId }: { roomId: string }) {
  const exRef = useRef<PanelImperativeHandle>(null);
  const { panels } = useLayout();
  const [doc, setDoc] = useState<docProp | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const [creating, setCreating] = useState<{
    parentId: string | null | undefined;
    type: "file" | "folder" | null;
  }>({
    parentId: null,
    type: null,
  });

  const [error, setError] = useState("");

  const [Loading, startTransition] = useTransition();

  const { loadFolder } = useExplorerstore();

  useEffect(() => {
    getFolder();
  }, []);

  async function getFolder() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/playground/${roomId}/directory`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.status === 200) {
          setDoc(data);
        }
      } catch (err) {
        console.log(err);
        setError("Server failed to fetch explorer");
      }
    });
  }

  const handleCreateFile = () => {
    const parent = selected || doc?.rootDir?._id;

    setCreating({
      parentId: parent,
      type: "file",
    });
  };

  const handleCreateFolder = () => {
    const parent = selected || doc?.rootDir?._id;

    setCreating({
      parentId: parent,
      type: "folder",
    });
  };

  const handleRefresh = debounce(() => {
    startTransition(() => {
      loadFolder(roomId, selected || doc?.rootDir?._id, true);
    });
  }, 500);

  if (error) {
    return (
      <div className="p-2 text-red-400 text-sm">Explorer Error: {error}</div>
    );
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
            handleRefresh={handleRefresh}
            handleCreateFile={handleCreateFile}
            handleCreateFolder={handleCreateFolder}
          />

          {/* Empty State */}
          {!doc?.rootDir && <NoFolder />}

          {Loading ? (
            <div className="flex justify-center py-3">
              <Spinner className="size-5" />
            </div>
          ) : (
            doc?.rootDir && (
              <FolderItem
                item={doc.rootDir}
                roomId={roomId}
                creating={creating}
                setCreating={setCreating}
                selected={selected}
                setSelected={setSelected}
                Loading={Loading}
              />
            )
          )}
        </div>
      </Suspense>
    </ResizablePanel>
  );
}

export default FileExplore;
