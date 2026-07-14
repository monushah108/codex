// lib/hooks/useExplorerSocket.ts

import { useCallback, useEffect } from "react";

import { socket } from "../socket";
import { useCodestore } from "../store/Codestore";
import { useExplorerstore } from "../store/Explorerstore";

import { ExplorerOperation, UseExplorerSocket } from "./types";

export default function useExplorerSocket({
  roomId,
}: {
  roomId: string | null;
}): UseExplorerSocket {
  const user = useCodestore((state) => state.user);

  useEffect(() => {
    if (!roomId || !user) return;

    /* ---------------- JOIN ---------------- */

    socket.emit("explorer:join", { roomId, user });

    /* ---------------- MEMBERS ---------------- */

    socket.emit("members", { roomId });

    const handleMembers = ({ users }: { users: (typeof user)[] }) => {
      useExplorerstore.setState({
        members: users,
      });
    };

    socket.on("members", handleMembers);

    /* ---------------- ACTIVITY ---------------- */

    const handleActivity = () => {};

    socket.on("activity", handleActivity);

    /* ---------------- OPERATIONS ---------------- */

    const applyOperation = (operation: ExplorerOperation) => {
      const explorer = useExplorerstore.getState();

      switch (operation.type) {
        case "add":
          console.log("add file init", operation.payload.parentId);
          if (operation.target === "file") {
            explorer.insertFile(
              operation.payload.parentId,
              operation.payload.file,
            );
          } else {
            explorer.insertFolder(
              operation.payload.parentId,
              operation.payload.folder,
            );
          }
          break;

        case "update":
          console.log("update file ", operation.payload.id);
          if (operation.target === "file") {
            explorer.updateFile(
              operation.payload.parentId,
              operation.payload.id,
              operation.payload.newName,
            );
          } else {
            explorer.updateFolder(
              operation.payload.parentId,
              operation.payload.id,
              operation.payload.newName,
            );
          }
          break;

        case "remove":
          console.log("remove file ", operation.payload.id);
          if (operation.target === "file") {
            explorer.removeFile(
              operation.payload.parentId,
              operation.payload.id,
            );
          } else {
            explorer.removeFolder(
              operation.payload.parentId,
              operation.payload.id,
            );
          }
          break;
      }
    };

    socket.on("explorer:operation", applyOperation);

    return () => {
      socket.off("members", handleMembers);
      socket.off("activity", handleActivity);
      socket.off("explorer:operation", applyOperation);
    };
  }, [roomId, user]);

  /* -------------------------------------------------------------------------- */
  /*                                SOCKET EMITS                               */
  /* -------------------------------------------------------------------------- */

  const applyCreate: UseExplorerSocket["applyCreate"] = useCallback(
    (roomId, parentId, item, target) => {
      console.log("add file ", item);
      socket.emit("explorer:operation", {
        roomId,
        type: "add",
        target,
        payload: {
          parentId,
          ...(target === "file" ? { file: item } : { folder: item }),
        },
      });
    },
    [],
  );

  const applyUpdate: UseExplorerSocket["applyUpdate"] = useCallback(
    (roomId, parentId, id, newName, target) => {
      console.log("update file ", id);
      socket.emit("explorer:operation", {
        roomId,
        type: "update",
        target,
        payload: {
          parentId,
          id,
          newName,
        },
      });
    },
    [],
  );

  const applyRemove: UseExplorerSocket["applyRemove"] = useCallback(
    (roomId, parentId, id, target) => {
      console.log("remoe file ", id);
      socket.emit("explorer:operation", {
        roomId,
        type: "remove",
        target,
        payload: {
          parentId,
          id,
        },
      });
    },
    [],
  );

  return {
    applyCreate,
    applyUpdate,
    applyRemove,
  };
}
