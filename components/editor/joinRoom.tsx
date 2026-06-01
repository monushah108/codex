"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Lock, Users, Clock3 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { Button } from "../ui/button";

import { PasswordInput } from "../ui/password-input";

import { Spinner } from "../ui/spinner";

import { Toaster } from "../ui/sonner";

import { formatte } from "@/lib/features";

interface JoinRoomProps {
  owner: {
    admin_name: string;
    admin_img: string;
    createdAt: string;
    currentUsers: number;
    maxUsers: number;
    isPermanent?: boolean;
    expiresAt?: string;
  };

  roomId: string;
}

export default function JoinRoom({ owner, roomId }: JoinRoomProps) {
  const router = useRouter();

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [roomFull, setRoomFull] = useState(
    owner.currentUsers >= owner.maxUsers,
  );

  const handleJoin = async () => {
    if (!password) {
      return toast.error("Password required");
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/playground/join/${roomId}`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          password,
        }),
      });

      const data = await res.json();

      if (res.status === 201 || res.status === 409) {
        toast.success("Joining room...");

        return router.replace(`/playground/${roomId}`);
      }

      if (res.status === 401) {
        return toast.error(data.error);
      }

      if (res.status === 403) {
        setRoomFull(true);

        return toast.error(data.error || "Room full");
      }

      if (res.status === 404 || res.status === 410) {
        toast.error(data.error);

        setTimeout(() => {
          router.replace("/");
        }, 2000);

        return;
      }

      toast.error(data.error || "Something went wrong");
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const meta = [
    {
      icon: Clock3,

      text: `Created ${formatte(owner.createdAt)}`,
    },

    {
      icon: Users,

      text: `${owner.currentUsers}/${owner.maxUsers} members`,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e] px-4 text-[#d4d4d4]">
      <Toaster />

      <div className="w-full max-w-md space-y-6 rounded-2xl border border-[#2d2d30] bg-[#252526] p-6 shadow-xl">
        {/* HEADER */}

        <div className="flex gap-4">
          <Avatar className="h-14 w-14 border border-[#3c3c3c]">
            <AvatarImage src={owner.admin_img} />

            <AvatarFallback className="bg-sky-500 text-black">
              AD
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">{owner.admin_name}</h2>

              <Badge>Admin</Badge>

              <Badge color={owner.isPermanent ? "emerald" : "orange"}>
                {owner.isPermanent ? "Permanent" : "Temporary"}
              </Badge>
            </div>

            {meta.map(({ icon: Icon, text }, i) => (
              <MetaItem key={i} icon={Icon} text={text} />
            ))}

            {!owner.isPermanent && owner.expiresAt && (
              <MetaItem
                icon={Clock3}
                text={`Expires ${formatte(owner.expiresAt)}`}
                color="text-orange-400"
              />
            )}
          </div>
        </div>

        {/* ROOM FULL */}

        {roomFull && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            Room is full
          </div>
        )}

        {/* PASSWORD */}

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <Lock className="h-4 w-4" />
            Room Password
          </label>

          <PasswordInput
            value={password}
            placeholder="Enter room password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* BUTTON */}

        <Button
          onClick={handleJoin}
          disabled={loading || roomFull || !password}
          className="w-full bg-sky-500 hover:bg-sky-600"
        >
          {loading ? <Spinner className="h-4 w-4" /> : "Join Room"}
        </Button>
      </div>
    </div>
  );
}

function MetaItem({ icon: Icon, text, color = "text-gray-400" }: any) {
  return (
    <div className={`flex items-center gap-2 text-xs ${color}`}>
      <Icon className="h-3 w-3" />

      <span>{text}</span>
    </div>
  );
}

function Badge({ children, color = "sky" }: any) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-xs bg-${color}-500/20 text-${color}-400`}
    >
      {children}
    </span>
  );
}
