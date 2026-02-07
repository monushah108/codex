import React from "react";
import { Spinner } from "@/components/ui/spinner"; // or Loader depending on your setup

const TerminalSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#1e1e1e] border-t border-[#2d2d30] text-[#d4d4d4]">
      <Spinner className="w-6 h-6 text-[#007acc]" />
      <p className="text-xs text-gray-400 mt-2 font-mono">
        Starting terminal...
      </p>
    </div>
  );
};

export default TerminalSkeleton;
