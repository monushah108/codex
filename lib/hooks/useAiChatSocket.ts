import { useEffect } from "react";

export default function useAiChatSocket({ roomId }: { roomId: string | null }) {
  useEffect(() => {
    if (!roomId) return;
  }, [roomId]);

  return {};
}
