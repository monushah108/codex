import { MessageSquare, GitBranch, CheckCircle, Terminal } from "lucide-react";
import Membermodule from "./Module/memberModule";

function StatusBar({ setShowChat, setShowTerminal }) {
  return (
    <div className="h-[22px] bg-[#007acc] text-white flex items-center justify-between px-2 text-xs">
      <div className="flex items-center gap-4">
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
        <button
          className="flex items-center gap-1"
          onClick={() => setShowTerminal((pre) => !pre)}
        >
          <Terminal className="size-3" />
          <span>Terminal</span>
        </button>
        <button
          className="flex items-center gap-1"
          onClick={() => setShowChat((pre) => !pre)}
        >
          <MessageSquare className="size-3" />
          <span>Chat</span>
        </button>

        <Membermodule />
      </div>
    </div>
  );
}

export default StatusBar;
