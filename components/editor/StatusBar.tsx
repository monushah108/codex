"use client";
import { GitBranch, CheckCircle, Users } from "lucide-react";
import Profile from "./ui/profile";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useChatstore } from "@/lib/store/Chatstore";

function StatusBar() {
  const members = useChatstore((s) => s.members);

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
        <div className="flex items-center gap-1 cursor-pointer">
          <Users className="size-3" />

          <span>{members.length} online</span>

          {/* AVATARS */}
          <div className="flex -space-x-2">
            {members.slice(0, 3).map((m) => {
              const name = m.name || "U";
              const image = m.image || "";

              return (
                <Avatar
                  key={m.id}
                  className="w-4 h-4 border border-white rounded-full"
                >
                  <AvatarImage src={image} alt={name} />
                  <AvatarFallback>
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              );
            })}
          </div>

          {/* EXTRA COUNT */}
          {members.length > 3 && (
            <span className="ml-1 text-[10px] opacity-80">
              +{members.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatusBar;
