"use client";
import { Binary, LogOut } from "lucide-react";
import InviteModule from "./Module/inviteModule";
import ControllerPopover from "./Module/controllerPopover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useEffect, useState } from "react";

export default function PlayHeader() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/login");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    })();
  }, []);

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
        <Popover>
          <PopoverTrigger asChild>
            <button className="outline-none">
              <Avatar className="cursor-pointer size-6">
                <AvatarImage src="" />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-64 p-0 bg-[#1e1e1e] text-[#d4d4d4] border border-white/10 rounded-xl shadow-2xl"
          >
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-sm font-medium">Monu</p>
              <p className="text-xs text-gray-400 truncate">monu@example.com</p>
            </div>
            <div className="border-t border-white/10" />

            {/* 🔹 Logout */}
            <div className="py-1">
              <button
                // onClick={signOutUser}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-red-500/10 text-red-400"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
