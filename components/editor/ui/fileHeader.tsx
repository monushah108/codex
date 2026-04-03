import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  File,
  FilePlus,
  Folder,
  FolderPlus,
  MoreHorizontal,
  Repeat2,
} from "lucide-react";

export function FileHeader({
  handleCreateFile,
  handleCreateFolder,
  getProjectDoc,
}) {
  return (
    <div className="flex flex-col  py-1 border-b border-[#2d2d30] text-xs text-gray-400 gap-2">
      <div className="flex items-center justify-between px-2">
        <span className="uppercase tracking-wide">Explorer</span>

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
      </div>
    </div>
  );
}
