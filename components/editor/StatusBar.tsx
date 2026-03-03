import { GitBranch, CheckCircle } from "lucide-react";
import Membermodule from "./Module/memberModule";
import Profile from "./ui/profile";

function StatusBar() {
  return (
    <div className=" bg-[#007acc] h-7 text-white flex items-center justify-between px-2 text-xs">
      <div className="flex items-center gap-4">
        <Profile />
        <div className="flex items-center gap-1">
          <GitBranch className="size-3" />
          <span>main</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="size-3" />
          <span>No issues</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Membermodule />
      </div>
    </div>
  );
}

export default StatusBar;
