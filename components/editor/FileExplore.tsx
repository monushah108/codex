"use client";
import { ChevronRight, File, Folder, X } from "lucide-react";
import { memo, Suspense, useRef } from "react";

import { ScrollArea } from "../ui/scroll-area";
import { ResizablePanel } from "../ui/resizable";
import FileExploreSkeleton from "./Skeleton/FileExploreSkeleton";
import { PanelImperativeHandle } from "react-resizable-panels";
import { useLayout } from "@/context/layout-context";

function FileExplore() {
  const handleCreateFile = () => {};
  const handleCreateFolder = () => {};
  const exRef = useRef<PanelImperativeHandle>(null);
  const { isCollapse } = useLayout();

  return (
    <ResizablePanel
      panelRef={exRef}
      collapsible
      collapsedSize={0}
      defaultSize={isCollapse.explorer ? 20 : 0}
    >
      <Suspense fallback={<FileExploreSkeleton />}>
        <div className="flex-1 h-full border-r border-[#2d2d30] bg-[#252526] overflow-hidden ">
          <div className="flex items-center px-2 py-3 justify-between border-b border-border [&>button]:cursor-pointer">
            <div className="flex-1 text-xs ">ProjectName</div>
            <button onClick={handleCreateFile}>
              <File className="w-3 h-3 ml-2" />
            </button>
            <button onClick={handleCreateFolder}>
              <Folder className="w-3 h-3 ml-2" />
            </button>
          </div>
          <div>
            <ScrollArea className="h-[550px] rounded-md  p-3 "></ScrollArea>
          </div>
        </div>
      </Suspense>
    </ResizablePanel>
  );
}

export default FileExplore;

// folder ki parentid file ki parent id ke same hogi ab folder ki id agar match kare file ki parent id se to le lo
//  {directories.map(({id , type , name}) => (
//             <Collapsible className="group/collapse-1">
//               <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md p-1  text-left">
//                 <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapse-1:rotate-90" />
//                 <Folder className="h-4 w-4" />
//                 <span className="text-sm font-medium">src</span>
//               </CollapsibleTrigger>
//               <CollapsibleContent className="ml-2 space-y-1">
//                 <Collapsible className="group/collapse-2">
//                   <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md p-1  text-left">
//                     <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapse-2:rotate-90" />
//                     <Folder className="h-4 w-4" />
//                     <span className="text-sm">components</span>
//                   </CollapsibleTrigger>
//                   <CollapsibleContent className="ml-2 space-y-1">
//                     <div className="flex items-center gap-2 rounded-md p-1">
//                       <File className="h-4 w-4 ml-4" />
//                       <span className="text-sm">Button.tsx</span>
//                     </div>
//                     <div className="flex items-center gap-2 rounded-md p-1 ">
//                       <File className="h-4 w-4 ml-4" />
//                       <span className="text-sm">Input.tsx</span>
//                     </div>
//                   </CollapsibleContent>
//                 </Collapsible>
//               </CollapsibleContent>
//             </Collapsible>
//           ))}
