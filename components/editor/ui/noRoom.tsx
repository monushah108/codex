import Link from "next/link";
import { AlertCircle, Home, Plus } from "lucide-react";

export default function NoRoom() {
  return (
    <div className="min-h-svh bg-[#1e1e1e] text-[#d4d4d4] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-[#2d2d30]">
            <AlertCircle className="h-10 w-10 text-red-400" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-2">Room Not Found</h1>

        <p className="text-[#9ca3af] mb-8">
          The room you're trying to access doesn't exist, has been deleted, or
          you don't have permission to view it.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#007acc] hover:bg-[#0e639c] transition-colors"
          >
            <Home size={16} />
            Go Home
          </Link>

          <Link
            href="/playground"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-[#3e3e42] hover:bg-[#2d2d30] transition-colors"
          >
            <Plus size={16} />
            Create Room
          </Link>
        </div>
      </div>
    </div>
  );
}
