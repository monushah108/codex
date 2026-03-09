import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { File, Folder, MoreHorizontal } from "lucide-react";

export function FileHeader({
  Isproject,
  handleCreateFile,
  handleCreateFolder,
}) {
  return (
    <div
      style={{ display: !Isproject && "none" }}
      className="flex flex-col  py-1 border-b border-[#2d2d30] text-xs text-gray-400 gap-2"
    >
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
    </div>
  );
}
