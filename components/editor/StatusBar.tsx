"use client";
import { GitBranch, CheckCircle, Users } from "lucide-react";
import Profile from "./ui/profile";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useChatstore } from "@/lib/store/Chatstore";

function StatusBar() {
  const members = useChatstore((state) => state.members);

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
        <div className="flex items-center gap-1 cursor-pointer">
          <Users className="size-3" />
          <span>{members.length} online</span>
          <div className="flex flex-1 -space-x-2">
            {members?.slice(0, 3).map((m) => (
              <Avatar
                className="w-4 h-4 border-white border rounded-full"
                key={m.id}
              >
                <AvatarImage
                  src={m.image}
                  alt={m.name}
                  className="rounded-full"
                />
                <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusBar;
