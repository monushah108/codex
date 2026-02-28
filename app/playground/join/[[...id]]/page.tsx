"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

export default function Page() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    if (!password) return;

    try {
      setIsLoading(true);
      await new Promise((res) => setTimeout(res, 2000));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh bg-[#1e1e1e] text-[#d4d4d4] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 bg-[#252526] p-6 rounded-xl border border-[#2d2d30] shadow-lg">
        {/* Room Info */}
        <div className="flex items-center gap-4 ">
          <Avatar className="h-12 w-12 ">
            <AvatarImage src="" />
            <AvatarFallback className="bg-sky-500 text-black font-semibold">
              MS
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              Monu Shah
              <span className="text-xs px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded">
                Admin
              </span>
            </h2>

            <span className="text-xs text-gray-400">Created • 20 Feb 2026</span>

            <span className="text-xs text-gray-400">
              4 members already joined
            </span>
          </div>
        </div>

        {/* Password */}
        <PasswordInput
          placeholder="Enter room password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <Button
          onClick={handleStart}
          disabled={isLoading || !password}
          className="w-full gap-2 bg-sky-500 hover:bg-sky-600 transition-all"
        >
          {isLoading ? (
            <Spinner className="w-4 h-4" />
          ) : (
            <span className="text-sm">Start</span>
          )}
        </Button>
      </div>
    </div>
  );
}
