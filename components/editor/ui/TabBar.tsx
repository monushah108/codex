import { memo } from "react";

import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExplorerstore } from "@/lib/store/Explorerstore";

const TabBar = memo(function TabBar() {
  const openFiles = useExplorerstore((s) => s.openFiles);
  const activeFileId = useExplorerstore((s) => s.activeFileId);
  const closeFile = useExplorerstore((s) => s.closeFile);

  return (
    <div className="h-8.75 bg-[#2d2d30] border-b border-[#2d2d30] flex items-center justify-between px-1 ">
      <div className="flex items-center space-x-1 overflow-x-auto">
        {openFiles.map((file) => {
          const isActive = file._id === activeFileId;
          return (
            <Button
              key={file._id}
              variant="none"
              className={`border-t-4 ${isActive ? "bg-blue-700/20 border-blue-600" : "border-transparent"}`}
            >
              {file.name}
              <span onClick={() => closeFile(file._id)}>
                <X />
              </span>
            </Button>
          );
        })}
      </div>
      <div className="space-x-1">
        <Button
          variant="none"
          size="xs"
          className="hover:bg-[#3a3a3d] text-[#d4d4d4]"
        >
          <Play className="size-4 " />
          Run Code
        </Button>
      </div>
    </div>
  );
});

export default TabBar;
