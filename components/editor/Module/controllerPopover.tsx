"use client";
import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
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
} from "lucide-react";

const peers = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  name: `Mohit ${i + 1}`,
  online: Math.random() > 0.3,
}));

export default function ControllerPopover() {
  const [search, setSearch] = useState("");
  const [muted, setMuted] = useState<number[]>([]);

  const toggleMute = (id: number) => {
    setMuted((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const filteredPeers = peers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="none" className="play-btns flex gap-1">
          <span>controller</span>
          <ChevronDown className="size-3" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[320px] p-0 bg-[#1f1f22] text-[#e5e5e5] rounded-xl border border-white/10 shadow-2xl"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between text-sm font-semibold">
            <div className="flex items-center gap-2">
              <UserSquare className="size-4 text-indigo-400" />
              <span>Peers</span>
            </div>

            <Button size="icon" variant="ghost" className="hover:bg-white/10">
              <VolumeX className="size-4" />
            </Button>
          </div>

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
        </div>

        {/* List */}
        <ScrollArea className="h-[300px] p-3">
          <div className="space-y-2">
            {filteredPeers.map((peer) => {
              const isMuted = muted.includes(peer.id);

              return (
                <div
                  key={peer.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2 bg-[#2a2a2e] hover:bg-[#333338] transition"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        peer.online ? "bg-green-500" : "bg-gray-500"
                      }`}
                    />
                    <span className="text-sm">{peer.name}</span>
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
      </PopoverContent>
    </Popover>
  );
}
