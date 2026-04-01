"use client";

import {
  ChevronRight,
  File,
  FilePlus,
  Folder,
  FolderPlus,
  Repeat2,
} from "lucide-react";
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
import NoFolder from "./ui/noFolder";

import { Spinner } from "../ui/spinner";

type EntryType = "file" | "folder";
type Entryprop = {
  name: string;
  type: EntryType | null;
  ext?: string;
};

function FileExplore({ roomId }) {
  const exRef = useRef<PanelImperativeHandle>(null);
  const { isCollapse } = useLayout();
  const [Isproject, setIsproject] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState(null);
  const [Doc, setDoc] = useState({});
  const [newEntry, setNewEntry] = useState<Entryprop>({
    name: "",
    type: null,
    ext: "",
  });
  const [error, setError] = useState("");

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

        if (res.status == 201) {
          setIsproject(true);
        }

        setDoc(data);
      } catch (err) {
        console.log(err);
        setError("server failed to fetch");
      }
    });
  }

  const handleCreateFile = () => {
    setIsproject(true);
  };

  const handleCreateFolder = () => {
    setIsproject(true);
  };

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
            Isproject={Isproject}
            handleCreateFile={handleCreateFile}
            handleCreateFolder={handleCreateFolder}
          />
          {/* Empty State */}
          <NoFolder Isproject={Isproject} setIsproject={setIsproject} />

          {isPending ? (
            <Spinner className="size-5" />
          ) : (
            <Collapsible defaultOpen className="group">
              <div className="flex items-center justify-between px-2 py-1 hover:bg-[#2a2d2e] rounded">
                {/* Trigger */}
                <CollapsibleTrigger className="flex items-center gap-1 flex-1 cursor-pointer">
                  <ChevronRight className="w-4 h-4 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                  <span>{Doc.rootDir?.name}</span>
                </CollapsibleTrigger>

                {/* Buttons */}
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
                    }}
                    className="p-1 rounded hover:bg-[#3a3d3e]"
                  >
                    <Repeat2 className="size-4" />
                  </button>
                </div>
              </div>

              <CollapsibleContent>
                {/* <div className="ml-5 space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#2a2d2e] rounded cursor-pointer">
                    <File className="w-4 h-4 text-blue-400" />
                    app.tsx
                  </div>

                  <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#2a2d2e] rounded cursor-pointer">
                    <File className="w-4 h-4 text-blue-400" />
                    index.tsx
                  </div>
                </div> */}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </Suspense>
    </ResizablePanel>
  );
}

/* jab create butn pe click  ho to tab add folderName option ae  */

export default FileExplore;
