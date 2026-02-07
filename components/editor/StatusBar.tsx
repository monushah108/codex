import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  MessageSquare,
  Users,
  GitBranch,
  CheckCircle,
  Terminal,
} from "lucide-react";

function StatusBar({ handleChatToggle, handleTerminalToggle }) {
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
          onClick={handleTerminalToggle}
        >
          <Terminal className="size-3" />
          <span>Terminal</span>
        </button>
        <button className="flex items-center gap-1" onClick={handleChatToggle}>
          <MessageSquare className="size-3" />
          <span>Chat</span>
        </button>

        <div className="flex items-center gap-1">
          <Users className="size-3" />
          <span>3 online</span>
          <div className="flex flex-1 -space-x-2">
            <Avatar className="w-4 h-4 border-white border rounded-full">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=You`}
                alt={`Avatar You`}
                className="rounded-full"
              />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <Avatar className="w-4 h-4 border-white border rounded-full">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=You`}
                alt={`Avatar You`}
                className="rounded-full"
              />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <Avatar className="w-4 h-4 border-white border rounded-full">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=You`}
                alt={`Avatar You`}
                className="rounded-full"
              />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusBar;
