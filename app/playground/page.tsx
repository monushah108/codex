"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Binary, UserRoundPlus } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "@/components/ui/sonner";
import heartSvg from "@/public/pixel-heart.gif";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | playground",
    default: "Technical Agency",
  },
};

export default function Page() {
  const [roomName, setRoomName] = useState("codex-room");
  const [roomType, setRoomType] = useState<"public" | "private">("public");
  const [password, setPassword] = useState("12345678");
  const [IsLoading, setIsLoading] = useState(false);
  const [maxUser, setMaxUser] = useState("3");
  const route = useRouter();

  const handleStart = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          roomName,
          roomType,
          password: roomType === "private" ? password : undefined,
          maxUser,
        }),
      });
      setIsLoading(false);

      const data = await response.json();

      if (response.status == 201) {
        toast.success("room has been created !!");
        console.log(data);
        route.push(`/playground/${data.room.id}`);
      }

      if (response.status == 422) {
        toast.error(Object.values(data));
      }
    } catch (err: any) {
      toast.error("it's an server erorr");
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] flex flex-col items-center justify-center p-6">
      <Toaster />

      <div className=" mb-20 ">
        <h2 className="flex items-center justify-center gap-1 mb-2 text-lg font-semibold">
          <Binary className="size-6" /> codex.
        </h2>
        <p className="text-sm text-[#9e9e9e] flex  gap-1">
          Create a room. Invite your peers. Code together in real time.
          <img src={heartSvg.src} className="size-5 " />
        </p>
      </div>
      <div className="w-full max-w-md space-y-6">
        {/* Room Name */}
        <div className="space-y-2">
          <Label>Room Name</Label>
          <Input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="enter room name"
            className="bg-[#1e1e1e] border-[#2d2d30]"
          />
        </div>

        {/* Room Type */}
        <div className="space-y-3">
          <Label>Room Type</Label>

          <RadioGroup
            value={roomType}
            onValueChange={(value) =>
              setRoomType(value as "public" | "private")
            }
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="public"
                id="public"
                className="text-sky-500 
                 data-[state=checked]:bg-sky-500 
                 data-[state=checked]:text-white"
              />
              <Label htmlFor="public">Public</Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="private"
                id="private"
                className="text-sky-500 
                 data-[state=checked]:bg-sky-500 
                 data-[state=checked]:text-white"
              />
              <Label htmlFor="private">Private</Label>
            </div>
          </RadioGroup>

          {roomType === "private" && (
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </div>

        <Input
          type="number"
          placeholder="Max participants (e.g. 4)"
          value={maxUser}
          onChange={(e) => setMaxUser(e.target.value)}
        />

        {/* Start Button */}
        <Button
          disabled={IsLoading}
          onClick={handleStart}
          className="w-full gap-2 bg-sky-500 hover:bg-sky-600"
        >
          {IsLoading ? (
            <Spinner className="w-4 h-5" />
          ) : (
            <span className="flex gap-2 text-sm">
              <UserRoundPlus className="size-4" /> Start Playground
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
