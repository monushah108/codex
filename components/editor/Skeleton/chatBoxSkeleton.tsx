"use client";

export default function ChatBoxSkeleton() {
  return (
    <aside className="flex flex-col  animate-pulse h-[740px]">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-[#2d2d30]">
        <div className="size-4 rounded bg-[#2d2d30]" />
        <div className="h-3 w-24 rounded bg-[#2d2d30]" />
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 space-y-4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-2">
            <div className="size-7 rounded-full bg-[#2d2d30]" />
            <div className="flex flex-col gap-2 w-full">
              <div className="h-3 w-20 rounded bg-[#2d2d30]" />
              <div className="h-3 w-3/4 rounded bg-[#2d2d30]" />
              <div className="h-3 w-1/2 rounded bg-[#2d2d30]" />
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#2d2d30]">
        <div className="flex items-center gap-2 bg-[#2d2d30] rounded px-3 py-3">
          <div className="h-3 flex-1 rounded bg-[#3a3a3d]" />
          <div className="size-6 rounded bg-[#3a3a3d]" />
        </div>
      </div>
    </aside>
  );
}
