"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserRoundPlus, Copy, Link } from "lucide-react";
import { useParams } from "next/navigation";

export default function InviteModule() {
  const param = useParams();
  const inviteLink = `${process.env.NEXT_PUBLIC_API_URL}/join/${param.roomId}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(inviteLink);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="none" className="play-btns">
          <UserRoundPlus />
          <span>invite</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#323233] text-[#d4d4d4] border border-[#2d2d30]">
        <DialogHeader>
          <DialogTitle>invite friends</DialogTitle>
          <DialogDescription>
            invite your friends to code together
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#9e9e9e]">invite link</label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 w-full rounded-md bg-[#1e1e1e] border border-[#2d2d30] text-sm truncate">
                <Link className="size-4 shrink-0" />
                <span className="truncate">{inviteLink}</span>
              </div>
              <Button size="icon" variant="ghost" onClick={copyToClipboard}>
                <Copy className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
