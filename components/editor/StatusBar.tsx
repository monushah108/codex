"use client";
import { GitBranch, CheckCircle, Users, Sparkles } from "lucide-react";
import Profile from "./ui/profile";

function StatusBar() {
  return (
    <div className="bg-[#007acc] h-7 text-white flex items-center justify-between px-2 text-xs">
      {/* LEFT */}
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

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer">
          <Sparkles className="size-3" />
          <Users className="size-3" />
        </div>
      </div>
    </div>
  );
}

export default StatusBar;
