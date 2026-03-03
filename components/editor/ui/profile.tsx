import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { authClient, useSession } from "@/lib/auth-client";
import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session } = useSession();
  const router = useRouter();

  const user = session?.user;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="cursor-pointer size-6">
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback>{user?.name?.charAt(0) || "M"}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-64 p-0 bg-[#1e1e1e] text-[#d4d4d4] border border-white/10 rounded-xl shadow-2xl"
      >
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
        </div>

        <div className="py-1">
          <button
            onClick={async () => {
              await authClient.signOut();
              router.replace("/auth/signin");
            }}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-red-500/10 text-red-400"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
