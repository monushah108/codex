"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { authClient, useSession } from "@/lib/auth-client";

import { LogOut, SettingsIcon } from "lucide-react";
import Link from "next/link";

export default function Profile() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="cursor-pointer size-7">
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback>{user?.name?.charAt(0) || "M"}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="
    max-w-max
    p-0
    bg-background
    text-foreground
    border
    rounded-xl
    shadow-xl
  "
      >
        <div className="px-4 py-3 border-b">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email}
          </p>
        </div>

        <div className="p-1  flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={async () => {
              await authClient.signOut();
            }}
            className="flex items-center px-4 py-2 text-sm hover:bg-red-600/10 text-red-500"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
          <Link href="/setting">
            <Button
              variant="ghost"
              className="bg-transparent  hover:rotate-180"
            >
              <SettingsIcon className="size-5" />
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
