"use client";

import { ChevronRight, FilePlus, FolderPlus, Repeat2 } from "lucide-react";

import { Suspense, useEffect, useRef, useState, useTransition } from "react";

import { ResizablePanel } from "../ui/resizable";
import FileExploreSkeleton from "./Skeleton/FileExploreSkeleton";
import { PanelImperativeHandle } from "react-resizable-panels";
import { useLayout } from "@/context/layout-context";
import { FileHeader } from "./ui/fileHeader";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import FolderItem from "./ui/folderItem";
import NoFolder from "./ui/noFolder";
import { Spinner } from "../ui/spinner";

function FileExplore({ roomId }) {
  const exRef = useRef<PanelImperativeHandle>(null);
  const { isCollapse } = useLayout();

  const [isProject, setIsProject] = useState(false);
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

        if (res.status === 201) {
          setIsProject(true);
        }

        setDoc(data);
      } catch (err) {
        console.log(err);
        setError("Server failed to fetch explorer");
      }
    });
  }

  console.log(doc, selected);

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
            Isproject={isProject}
            handleCreateFile={handleCreateFile}
            handleCreateFolder={handleCreateFolder}
          />

          {/* Empty State */}
          {/* <NoFolder Isproject={isProject} setIsproject={setIsProject} /> */}

          {isPending ? (
            <div className="flex justify-center py-3">
              <Spinner className="size-5" />
            </div>
          ) : (
            doc?.rootDir && (
              <Collapsible defaultOpen className="group">
                {/* Root Folder Header */}
                <div className="flex items-center justify-between px-2 py-1 hover:bg-[#2a2d2e] rounded">
                  <CollapsibleTrigger
                    className="flex items-center gap-1 flex-1 cursor-pointer"
                    onClick={() => setSelected(doc.rootDir._id)}
                  >
                    <ChevronRight className="w-4 h-4 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    <span>{doc.rootDir.name}</span>
                  </CollapsibleTrigger>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateFile();
                      }}
                      className="p-1 rounded hover:bg-[#3a3d3e]"
                    >
                      <FilePlus className="size-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateFolder();
                      }}
                      className="p-1 rounded hover:bg-[#3a3d3e]"
                    >
                      <FolderPlus className="size-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        getProjectDoc();
                      }}
                      className="p-1 rounded hover:bg-[#3a3d3e]"
                    >
                      <Repeat2 className="size-4" />
                    </button>
                  </div>
                </div>

                <CollapsibleContent>
                  <FolderItem
                    item={doc.rootDir}
                    roomId={roomId}
                    creating={creating}
                    setCreating={setCreating}
                    setSelected={setSelected}
                    refresh={getProjectDoc}
                  />
                </CollapsibleContent>
              </Collapsible>
            )
          )}
        </div>
      </Suspense>
    </ResizablePanel>
  );
}

export default FileExplore;
