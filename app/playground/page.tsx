import { Binary } from "lucide-react";

import { Toaster } from "@/components/ui/sonner";
import heartSvg from "@/public/pixel-heart.gif";

import Form from "@/components/editor/form";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] flex flex-col items-center justify-center p-6">
      <Toaster />

      <div className=" mb-20 ">
        <h2 className="flex items-center justify-center gap-1 mb-2 text-lg font-semibold">
          <Binary className="size-6" /> codex.
        </h2>
        <p className="text-sm text-[#9e9e9e] flex  gap-1">
          Create a room. Invite your peers. Code together in real time.
          <Image alt="heart" src={heartSvg.src} width="20" height="20" />
        </p>
      </div>
      <Form />
    </div>
  );
}
