"use client";

import { useMemo } from "react";
import { GitBranch, CheckCircle2, Sparkles, Circle } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Profile from "./ui/profile";

import { useLayout } from "@/context/layout-context";
import { useExplorerstore } from "@/lib/store/Explorerstore";

function StatusBar() {
  const { toggle } = useLayout();

  const members = useExplorerstore((s) => s.members);
  const activity = useExplorerstore((s) => s.activity);

  const latestActivity = useMemo(() => {
    if (!activity.length) return null;
    return activity.at(0);
  }, [activity]);

  return (
    <div className="h-7 bg-[#007acc] text-white text-xs px-3 flex items-center justify-between">
      {/* ---------------- LEFT ---------------- */}

      <div className="flex items-center gap-4 overflow-hidden">
        <Profile />

        <div className="flex items-center gap-1 shrink-0">
          <GitBranch className="size-3" />
          <span>main</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <CheckCircle2 className="size-3" />
          <span>Ready</span>
        </div>

        <AnimatePresence mode="wait">
          {latestActivity && (
            <motion.span
              key={latestActivity.id}
              initial={{
                y: -12,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              className="truncate opacity-95"
            >
              {latestActivity.message ??
                `${latestActivity.userName} ${latestActivity.type}`}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------- RIGHT ---------------- */}

      <div className="flex items-center gap-3">
        <button
          onClick={() => toggle("chat")}
          className="flex items-center gap-1 hover:bg-white/10 px-2 py-1 rounded transition-colors"
        >
          <Sparkles className="size-3" />
          <span>AI</span>
        </button>

        <Popover>
          <PopoverTrigger asChild>
            <button className="rounded hover:bg-white/10 p-1 transition-colors">
              <AvatarGroup>
                {members.slice(0, 3).map((member) => (
                  <Avatar key={member.id} className="size-4 ml-1">
                    <AvatarImage src={member.image ?? ""} alt={member.name} />

                    <AvatarFallback>
                      {member.name
                        ?.split(" ")
                        .map((x) => x[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                ))}

                {members.length > 3 && (
                  <AvatarGroupCount>+{members.length - 3}</AvatarGroupCount>
                )}
              </AvatarGroup>
            </button>
          </PopoverTrigger>

          <PopoverContent
            side="top"
            align="end"
            className="w-72 p-0 bg-[#252526] border-[#3c3c3c]"
          >
            <div className="border-b border-[#3c3c3c] px-4 py-3">
              <h3 className="font-medium">Online Members</h3>
              <p className="text-xs text-muted-foreground">
                {members.length} connected
              </p>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[#2d2d30]"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarImage src={member.image ?? ""} alt={member.name} />

                      <AvatarFallback>
                        {member.name
                          ?.split(" ")
                          .map((x) => x[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="text-sm font-medium">{member.name}</p>

                      <p className="text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <span className="size-2 rounded-full bg-green-500" />
                </div>
              ))}

              {members.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No members online
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default StatusBar;
