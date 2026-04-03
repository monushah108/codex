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

function FileExplore({ roomId }) {
  const exRef = useRef<PanelImperativeHandle>(null);
  const { isCollapse } = useLayout();
  const [doc, setDoc] = useState(null);
  const [selected, setSelected] = useState(null);

  const [creating, setCreating] = useState({
    parentId: null,
    type: null,
  });

  const [error, setError] = useState("");

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getProjectDoc();
  }, []);

  async function getProjectDoc() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/directory/${roomId}`, {
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
      defaultSize={isCollapse.explorer ? 20 : 0}
    >
      <Suspense fallback={<FileExploreSkeleton />}>
        <div className="flex flex-col h-full border-r border-[#2d2d30] bg-[#1e1e1e] text-gray-300">
          {/* Explorer Header */}
          <FileHeader
            getProjectDoc={getProjectDoc}
            handleCreateFile={handleCreateFile}
            handleCreateFolder={handleCreateFolder}
          />

          {/* Empty State */}
          {!doc?.rootDir && <NoFolder />}

          {isPending ? (
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
                refresh={getProjectDoc}
              />
            )
          )}
        </div>
      </Suspense>
    </ResizablePanel>
  );
}

export default FileExplore;
