"use client";
import { Collapsible, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { ChevronRight, File, Folder, X } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { CollapsibleContent } from "../ui/collapsible";
import { ScrollArea } from "../ui/scroll-area";

function FileExplore() {
  const handleCreateFile = () => {};
  const handleCreateFolder = () => {};

  return (
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
