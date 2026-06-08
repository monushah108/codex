import { Lock } from "lucide-react";
import Link from "next/link";

export default function PrivateRoom() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-[#1e1e1e] text-white">
      <div className="max-w-md text-center space-y-4">
        <div className="flex justify-center">
          <Lock className="h-12 w-12 text-yellow-500" />
        </div>

        <h1 className="text-2xl font-bold">Private Room</h1>

        <p className="text-gray-400">
          This room is private. You don't have permission to access it.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#007acc] hover:bg-[#0e639c] transition-colors text-white "
        >
          <span>Go Back</span>
        </Link>
      </div>
    </div>
  );
}
