// lib/hooks/useExplorerSocket
import { useEffect } from "react";
import { socket } from "../socket";
import { useCodestore } from "../store/Codestore";
import { useExplorerstore } from "../store/Explorerstore";
import { ExplorerOperation } from "./types";

export default function useExplorerSocket({
  roomId,
}: {
  roomId: string | null;
}) {
  const user = useCodestore((state) => state.user);
  useEffect(() => {
    if (!roomId || !user) return;

    // -------------------------
    //  JOIN EXPLORER
    // -------------------------
    socket.emit("explorer:join", { roomId, user });

    // -------------------------
    //  MEMBERS
    // -------------------------

    socket.emit("members", { roomId });

    const handleMembers = ({ users, roomId, socketId }) => {
      if (user.has(socketId)) {
      }
      useExplorerstore.getState().setMembers(user);
    };

    socket.on("members", handleMembers);

    // -------------------------
    // ACTIVITY
    // -------------------------

    const handleActivity = () => {};

    socket.emit("activity", handleActivity);

    // ==========================
    // EXPLORER OPERATION
    // ==========================

    function applyOperation(operation) {
      switch (operation) {
        case "add":
          useExplorerstore.setState((state) => ({
            cache: {
              ...state.cache,
              [parentId]: {
                ...state.cache[parentId],
                [target]:
                  target == "files"
                    ? [...(state.cache[parentId]?.files || []), file]
                    : [...(state.cache[parentId]?.folders || []), folder],
              },
            },
          }));
          break;
        case "remove":
      }
    }

    const handleOperation = (operation: ExplorerOperation) => {
      applyOperation(operation);
    };

    socket.on("explorer:operation", handleOperation);

    return () => {
      socket.off("explorer:operation", handleOperation);

      socket.off("activity", handleActivity);
    };
  }, [roomId]);
}
