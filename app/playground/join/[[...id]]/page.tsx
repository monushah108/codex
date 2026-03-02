"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { formatte } from "@/lib/features";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

export default function Page() {
  const [password, setPassword] = useState("12345678");
  const [isLoading, setIsLoading] = useState(false);
  const [Owner, setOwner] = useState([]);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    fetchInvite();
  }, []);

  const fetchInvite = async () => {
    try {
      const res = await fetch(`/api/join/${params.id}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (res.status == 404) {
        toast.error(data.error || "Failed to fetch room");
        router.push("/");
      } else if (res.status == 403) {
        setOwner(data);
        router.push(`/playground/join/${params.id}`);
      }

      // ✅ Single source of truth
      if (res.status == 200) {
        setIsLoading(true);
        router.push(`/playground/${params.id}`);
      }
      setIsLoading(false);
    } catch {
      toast.error("Server error");
      setIsLoading(false);
    }
  };

  // 🔹 Submit password
  const handleStart = async () => {
    if (!password) return;

    try {
      setIsLoading(true);

      const res = await fetch(`/api/join/${params.id}`, {
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

      // ✅ Always trust backend redirect
      if (res.status == 201 || res.status == 409) {
        router.push(`/playground/${params.id}`);
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
            <AvatarImage src={Owner?.admin_img} />
            <AvatarFallback className="bg-sky-500 text-black font-semibold">
              CX
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {Owner?.admin_name}
              <span className="text-xs px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded">
                Admin
              </span>
            </h2>

            <span className="text-xs text-gray-400">
              Created • {formatte(Owner?.createdAt)}
            </span>

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
