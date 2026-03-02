"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function Error({ error, reset }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white px-6">
      <div className="bg-[#1e1e1e] border border-red-500/40 rounded-xl p-8 max-w-md w-full text-center shadow-lg">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-red-500 mb-2">
          Something went wrong
        </h2>

        {/* Error message */}
        <p className="text-sm text-gray-400 mb-6 break-words">
          {error?.message || "Unexpected error occurred."}
        </p>

        {/* Retry button */}
        <Button
          onClick={() =>
            startTransition(() => {
              router.refresh();
              reset();
            })
          }
          className="bg-red-500 hover:bg-red-600 text-white w-full"
        >
          {pending ? <Spinner className="size-5" /> : "Try Again"}
        </Button>
      </div>
    </div>
  );
}
