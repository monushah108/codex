import { memo, useState } from "react";

import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCodestore } from "@/lib/store/Codestore";
import SaveFile from "../Module/saveFile";

const TabBar = memo(function TabBar() {
  const [openDialog, setOpenDialog] = useState(false);
  const openFiles = useCodestore((s) => s.openFiles);
  const activeFileId = useCodestore((s) => s.activeFileId);
  const closeFile = useCodestore((s) => s.closeFile);
  const openFile = useCodestore((s) => s.openFile);
  const setEdited = useCodestore((s) => s.setFileEdited);
  const setActiveFile = useCodestore((s) => s.setActiveFile);
  const runCode = useCodestore((s) => s.runCode);

  const nextFile = openFiles.find((f) => f._id !== activeFileId);

  return (
    <div
      style={{ display: activeFileId ? "flex" : "none" }}
      className="h-8.75 bg-[#2d2d30] border-b border-[#2d2d30]  items-center justify-between px-1 "
    >
      <div className="flex items-center gap-0.5 overflow-x-auto">
        {openFiles.map((file) => {
          const isActive = file._id === activeFileId;
          return (
            <Button
              key={file._id}
              variant="none"
              className={`border-t-4  rounded-xs group ${isActive ? "bg-blue-700/20 border-blue-600" : "border-blue-600/60 bg-blue-600/10 hover:bg-[#3a3a3d]"} t`}
              onClick={() => {
                openFile(file);
              }}
            >
              {file.name}

              {file.isEdited ? (
                <SaveFile
                  onDiscard={() => {
                    setOpenDialog(false);
                    setActiveFile(nextFile);
                  }}
                  onSave={() => {
                    setOpenDialog(false);
                    setEdited(activeFileId, false);
                  }}
                />
              ) : (
                <span
                  className="group-hover:opacity-100 opacity-0 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();

                    closeFile(file._id);
                  }}
                >
                  <X />
                </span>
              )}
            </Button>
          );
        })}
      </div>
      <div className="space-x-1">
        <Button
          onClick={() => {
            runCode(activeFileId!);
          }}
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
