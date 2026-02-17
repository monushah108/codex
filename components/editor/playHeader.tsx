import { Binary } from "lucide-react";
import InviteModule from "./Module/inviteModule";
import ControllerPopover from "./Module/controllerPopover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function PlayHeader() {
  return (
    <div className="h-10 text-[#d4d4d4] col-start-1 col-end-3  shrink-0 bg-[#323233] border-b border-[#2d2d30] flex items-center justify-between px-3 py-4 ">
      <div className="flex items-center gap-3">
        <div className="group md:flex items-center gap-1 hidden hover:bg-blue-400/50 px-2 py-4">
          <Binary className="size-5 text-blue-500 group-hover:text-blue-700" />
          <span className="group-hover:flex hidden font-semibold text-blue-600 group-hover:text-blue-800  text-shadow-white">
            codex
          </span>
        </div>
        {/* invite button  */}
        <InviteModule />
      </div>
      <div className="flex gap-4 items-center">
        <ControllerPopover />
        <Avatar className="w-7 h-7">
          <AvatarImage src="" />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
