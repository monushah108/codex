"use client";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  Mic,
  MicOff,
  UserSquare,
  Search,
  VolumeX,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const peers = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  name: `Mohit ${i + 1}`,
  online: Math.random() > 0.3,
}));

export default function Membermodule() {
  const [search, setSearch] = useState("");
  const [muted, setMuted] = useState<number[]>([]);

  const filteredPeers = useMemo(() => {
    return peers.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const onlineCount = peers.filter((p) => p.online).length;

  const toggleMute = (id: number) => {
    setMuted((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const muteAll = () => {
    setMuted(peers.map((p) => p.id));
  };

  const unmuteAll = () => {
    setMuted([]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
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
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-[#1f1f22] text-[#e5e5e5] border border-white/10 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserSquare className="size-5 text-indigo-400" />
              <span>Peers</span>
              <span className="text-xs text-muted-foreground">
                ({onlineCount} online)
              </span>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={muted.length ? unmuteAll : muteAll}
              className="hover:bg-white/10"
            >
              <VolumeX className="size-4 mr-1" />
              {muted.length ? "Unmute All" : "Mute All"}
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search peers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#2a2a2e] border-white/10 focus-visible:ring-indigo-500"
          />
        </div>

        {/* List */}
        <ScrollArea className="h-75 mt-4 pr-2">
          <div className="space-y-2">
            {filteredPeers.map((peer) => {
              const isMuted = muted.includes(peer.id);

              return (
                <div
                  key={peer.id}
                  className="flex items-center justify-between rounded-xl px-4 py-3 bg-[#2a2a2e] hover:bg-[#333338] transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        peer.online ? "bg-green-500" : "bg-gray-500"
                      }`}
                    />
                    <span className="text-sm font-medium">{peer.name}</span>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleMute(peer.id)}
                    className="hover:bg-white/10"
                  >
                    {isMuted ? (
                      <MicOff className="size-4 text-red-400" />
                    ) : (
                      <Mic className="size-4 text-indigo-400" />
                    )}
                  </Button>
                </div>
              );
            })}

            {filteredPeers.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-10">
                No peers found 👀
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
