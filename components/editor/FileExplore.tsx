"use client";

import { ChevronRight, File, Folder } from "lucide-react";
import { Suspense, useEffect, useRef, useState, useTransition } from "react";

import { ScrollArea } from "../ui/scroll-area";
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
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";

function FileExplore({ roomId }) {
  const exRef = useRef<PanelImperativeHandle>(null);
  const { isCollapse } = useLayout();
  const [Isproject, setIsproject] = useState(false);

  const [projectDocs, setProjectDocs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getProjectDoc();
  }, []);

  async function getProjectDoc() {
    try {
      const res = await fetch(`/api/directory/${roomId}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (res.status == 201) {
        setIsproject(true);
      }

      setProjectDocs(data);
    } catch (err) {
      console.log(err);
      setError("server failed to fetch");
    }
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

          {/* {(
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 px-2 py-2 border-b w-full cursor-pointer border-[#2d2d30] group text-sm">
                <Separator className=" bg-[#2d2d30]" />
                <div className="flex items-center justify-between px-2">
                  <span className="uppercase tracking-wide">
                    {RootFolderName}
                  </span>

                  <div className="space-x-1">
                    <button
                      onClick={handleCreateFile}
                      className="p-1 rounded hover:bg-[#2a2d2e]"
                    >
                      <File className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleCreateFolder}
                      className="p-1 rounded hover:bg-[#2a2d2e]"
                    >
                      <Folder className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ScrollArea className="flex-1 px-2 py-2">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#2a2d2e] rounded cursor-pointer">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <Folder className="w-4 h-4 text-yellow-400" />
                      src
                    </div>

                    <div className="flex items-center gap-2 pl-6 px-2 py-1 hover:bg-[#2a2d2e] rounded cursor-pointer">
                      <File className="w-4 h-4 text-blue-400" />
                      app.tsx
                    </div>

                    <div className="flex items-center gap-2 pl-6 px-2 py-1 hover:bg-[#2a2d2e] rounded cursor-pointer">
                      <File className="w-4 h-4 text-blue-400" />
                      index.tsx
                    </div>
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>
          )} */}
          {/* {!RootFolderName && Isproject && (
            <div className=" px-2 py-2 ">
              <Input
                className="focus:ring-sky-400 focus:ring-1 animate-pulse"
                value={RootFolderName}
                onChange={(e) => setRootFolderName(e.target.value)}
              />
            </div>
          )} */}
        </div>
      </Suspense>
    </ResizablePanel>
  );
}

/* jab create butn pe click  ho to tab add folderName option ae  */

export default FileExplore;
