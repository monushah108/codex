"use client";

import {
  ChevronRight,
  File,
  Folder,
  MoreHorizontal,
  FolderOpen,
  FilePlus,
} from "lucide-react";
import { Suspense, useRef, useState } from "react";

import { ScrollArea } from "../ui/scroll-area";
import { ResizablePanel } from "../ui/resizable";
import FileExploreSkeleton from "./Skeleton/FileExploreSkeleton";
import { PanelImperativeHandle } from "react-resizable-panels";
import { useLayout } from "@/context/layout-context";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function FileExplore() {
  const exRef = useRef<PanelImperativeHandle>(null);
  const { isCollapse } = useLayout();

  const [project, setProject] = useState<null | { name: string }>({
    name: "MyProject",
  });

  const handleCreateProject = () => {
    console.log("create project");
  };

  const handleOpenFolder = () => {
    console.log("open folder");
  };

  const handleCreateFile = () => {
    console.log("create file");
  };

  const handleCreateFolder = () => {
    console.log("create folder");
  };

  return (
    <ResizablePanel
      panelRef={exRef}
      collapsible
      collapsedSize={0}
      defaultSize={isCollapse.explorer ? 20 : 0}
      className="min-w-[220px]"
    >
      <Suspense fallback={<FileExploreSkeleton />}>
        <div className="flex flex-col h-full border-r border-[#2d2d30] bg-[#1e1e1e] text-gray-300">
          {/* Explorer Header */}
          <div className="flex flex-col  py-2 border-b border-[#2d2d30] text-xs text-gray-400 gap-2">
            <div className="flex items-center justify-between px-2">
              <span className="uppercase tracking-wide">Explorer</span>

              <button className="p-1 rounded hover:bg-[#2a2d2e]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <MoreHorizontal className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#2a2d2e] border-[#2a2d2e] ">
                    <DropdownMenuItem className=" text-center text-gray-400">
                      delete project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </button>
            </div>
            {project && (
              <>
                <Separator className=" bg-[#2d2d30]" />
                <div className="flex items-center justify-between px-2">
                  <span className="uppercase tracking-wide">codex</span>

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
              </>
            )}
          </div>

          {/* Empty State */}
          {project && (
            <div className="flex flex-col items-center justify-center mt-10 gap-4 p-4 text-center text-gray-400">
              <p className="text-sm">
                no folder opended & created in room yet !!
              </p>

              <Button
                size="sm"
                onClick={handleCreateProject}
                className="w-full bg-sky-500 hover:bg-sky-500/50"
              >
                <FilePlus />
                Create Project
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleOpenFolder}
                className="w-full"
              >
                <FolderOpen /> Open Folder
              </Button>
            </div>
          )}

          {!project && (
            <>
              <div className="flex items-center gap-2 px-2 py-2 border-b border-[#2d2d30] text-sm">
                <ChevronRight className="w-4 h-4 text-gray-400" />

                <Folder className="w-4 h-4 text-yellow-400" />

                <span className="font-medium">{project.name}</span>
              </div>

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
            </>
          )}
        </div>
      </Suspense>
    </ResizablePanel>
  );
}

export default FileExplore;
