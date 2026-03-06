"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { authClient, useSession } from "@/lib/auth-client";
import { LogOut, Settings, SettingsIcon } from "lucide-react";
import Link from "next/link";

export default function Profile() {
  const { data: session } = useSession();

  const user = session?.user;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="cursor-pointer size-5">
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback>{user?.name?.charAt(0) || "M"}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="max-w-max p-0 bg-[#1e1e1e] text-[#d4d4d4] border border-white/10 rounded-xl shadow-2xl"
      >
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
        </div>

        <div className="p-1  flex items-center justify-between">
          <Button
            variant="none"
            onClick={async () => {
              await authClient.signOut();
              router.replace("/auth/signin");
            }}
            className="flex items-center px-4 py-2 text-sm hover:bg-red-500/10 text-red-400"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
          <Link href="/setting">
            <Button
              variant="none"
              className="bg-transparent text-[#d4d4d4] hover:rotate-180"
            >
              <SettingsIcon className="size-5" />
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
