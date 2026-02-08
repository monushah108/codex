import {
  Binary,
  ChevronDown,
  Mic,
  Share2,
  UserRoundPlus,
  UserSquare,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ButtonGroup } from "../ui/button-group";
import { ScrollArea } from "../ui/scroll-area";

export default function PlayHeader() {
  return (
    <div className="h-[40px] text-[#d4d4d4] col-start-1 col-end-3  shrink-0 bg-[#323233] border-b border-[#2d2d30] flex items-center justify-between px-3 py-4 ">
      <div className="flex items-center gap-3">
        <div className="group md:flex items-center gap-1 hidden hover:bg-blue-400/50 px-2 py-4">
          <Binary className="size-5 text-blue-500 group-hover:text-blue-700" />
          <span className="group-hover:flex hidden font-semibold text-blue-600 group-hover:text-blue-800  text-shadow-white">
            codex
          </span>
        </div>
        <Button variant="none" className="play-btns">
          <UserRoundPlus />
          <span>invite</span>
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="none" className="play-btns  ">
            <span>controller</span>
            <ChevronDown className="size-3" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-[#323233] text-[#d4d4d4] w-[250px] p-0">
          <ScrollArea className="h-[300px]">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex items-center justify-between text-sm gap-2 font-semibold">
                  <span>peers</span>
                  <UserSquare className="size-4" />
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {Array.from({ length: 20 }).map((_, i) => (
                <DropdownMenuItem
                  key={i}
                  className="flex items-center justify-between"
                >
                  <div>Mohit {i + 1}</div>
                  <Button size="icon" variant="ghost">
                    <Mic />
                  </Button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      <div></div>
    </div>
  );
}
