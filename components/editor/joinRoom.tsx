"use client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { PasswordInput } from "../ui/password-input";
import { Toaster } from "../ui/sonner";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatte } from "@/lib/features";

export default function JoinRoom({ owner, roomId }) {
  const [password, setPassword] = useState("12345678");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const handleStart = async () => {
    if (!password) return;

    try {
      setIsLoading(true);

      const res = await fetch(`/api/playground/join/${roomId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.status == 401) {
        toast.error(data.error || "Invalid password");
        return;
      } else if (res.status == 404) {
        toast.error(
          `${data.error} within 5 sec you will be redirect on home page`,
        );
        setTimeout(() => {
          router.push("/");
        }, 5000);
      }

      if (res.status == 201 || res.status == 409) {
        router.push(`/playground/${roomId}`);
      }
    } catch {
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex min-h-svh bg-[#1e1e1e] text-[#d4d4d4] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 bg-[#252526] p-6 rounded-xl border border-[#2d2d30] shadow-lg">
        {/* Room Info */}
        <Toaster />
        <div className="flex items-center gap-4 ">
          <Avatar className="h-12 w-12 ">
            <AvatarImage src={owner?.admin_img} />
            <AvatarFallback className="bg-sky-500 text-black font-semibold">
              CX
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {owner?.admin_name}
              <span className="text-xs px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded">
                Admin
              </span>
            </h2>

            <span className="text-xs text-gray-400">
              Created • {formatte(owner?.createdAt)}
            </span>

            <span className="text-xs text-gray-400">
              4 members already joined
            </span>
          </div>
        </div>

        {/* Password */}
        <PasswordInput
          placeholder="Enter room password"
          name="password"
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
