"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UserRoundPlus } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "@/components/ui/sonner";
import gokuSvg from "@/public/super-saiyan-goku.gif";
import heartSvg from "@/public/pixel-heart.gif";
import { redirect } from "next/navigation";

export default function Page() {
  const [roomName, setRoomName] = useState("codex-room");
  const [roomType, setRoomType] = useState<"public" | "private">("public");
  const [password, setPassword] = useState("12345678");
  const [IsLoading, setIsLoading] = useState(false);
  const [maxUser, setMaxUser] = useState("3");

  // safer invite link
  // const baseUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin;

  // const inviteLink = `${baseUrl}/join/${name}`;

  // const copyToClipboard = async () => {
  //   await navigator.clipboard.writeText(inviteLink);
  // };

  const handleStart = async () => {
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

    // if(response.ok){
    //   route.push(`/playground/${response.id}`)
    // }

    const data = await response.json();
    console.log(response, data);

    // redirect or start socket here
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] flex flex-col items-center justify-center p-6">
      <Toaster />
      <div className="flex justify-center mb-10 ">
        <img
          src={gokuSvg.src}
          alt="Coding animation"
          width={160}
          height={160}
          className="rounded-lg"
        />
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

        <p className="text-sm text-[#9e9e9e] flex  gap-1">
          Create a room. Invite your peers. Code together in real time.
          <img src={heartSvg.src} className="size-5 " />
        </p>
      </div>
    </div>
  );
}
