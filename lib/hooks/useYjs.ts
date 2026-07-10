"use client";

import { useEffect, useMemo } from "react";
import * as Y from "yjs";

import {
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
} from "y-protocols/awareness";

import { socket } from "@/lib/socket";
import { destroyAwareness, getAwareness } from "../awareness";
import { destroyYDoc, getYDoc, getYText } from "../yjs";
import { useCodestore } from "../store/Codestore";

export function useYjs(roomId: string, fileId: string) {
  // Create only once
  const ydoc = useMemo(() => getYDoc(roomId, fileId), [roomId, fileId]);

  const yText = useMemo(() => getYText(roomId, fileId), [roomId, fileId]);
  const awareness = useMemo(
    () => getAwareness(roomId, fileId),
    [roomId, fileId],
  );

  const colors = [
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#eab308",
    "#a855f7",
    "#ec4899",
  ];

  useEffect(() => {
    if (!roomId) return;

    // -------------------------
    // Join room
    // -------------------------
    socket.emit("yjs:join", { roomId, fileId });

    awareness.setLocalStateField("user", {
      name: "Monu", // Replace with logged-in user's name
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    // -------------------------
    // Initial Sync
    // -------------------------
    const handleSync = ({ update }: { update: number[] }) => {
      Y.applyUpdate(ydoc, new Uint8Array(update));
      console.log("Initial sync for file:", fileId);
    };

    socket.on("yjs:sync", handleSync);

    // -------------------------
    // Receive remote updates
    // -------------------------
    const handleRemoteUpdate = ({ update }: { update: number[] }) => {
      Y.applyUpdate(ydoc, new Uint8Array(update), "remote");
      console.log("Received remote update for file:", fileId);
    };

    socket.on("yjs:update", handleRemoteUpdate);

    // -------------------------
    // Send local updates
    // -------------------------
    const handleLocalUpdate = (update: Uint8Array, origin: unknown) => {
      console.log("Sending local update for file:", fileId);
      if (origin === "remote") return;

      const store = useCodestore.getState();

      const current = yText.toString();
      const saved = store.code[fileId]?.savedContent ?? "";

      store.setFileEdited(fileId, current !== saved);

      socket.emit("yjs:update", {
        roomId,
        fileId,
        update: Array.from(update),
      });
    };

    ydoc.on("update", handleLocalUpdate);

    // -------------------------
    // Receive awareness
    // -------------------------
    const handleAwareness = ({ update }: { update: number[] }) => {
      console.log("Received awareness update for file:", fileId);
      applyAwarenessUpdate(awareness, new Uint8Array(update), "remote");
    };

    socket.on("yjs:awareness", handleAwareness);

    // -------------------------
    // Send awareness
    // -------------------------
    const awarenessHandler = ({
      added,
      updated,
      removed,
    }: {
      added: number[];
      updated: number[];
      removed: number[];
    }) => {
      const changed = added.concat(updated).concat(removed);

      const update = encodeAwarenessUpdate(awareness, changed);

      console.log("Sending awareness update for file:", fileId);
      socket.emit("yjs:awareness", {
        roomId,
        fileId,
        update: Array.from(update),
      });
    };

    awareness.on("update", awarenessHandler);

    return () => {
      awareness.setLocalState(null);
      socket.off("yjs:sync", handleSync);
      socket.off("yjs:update", handleRemoteUpdate);
      socket.off("yjs:awareness", handleAwareness);

      ydoc.off("update", handleLocalUpdate);
      awareness.off("update", awarenessHandler);

      destroyAwareness(roomId, fileId);
      destroyYDoc(roomId, fileId);
    };
  }, [roomId, fileId, ydoc, awareness]);

  return {
    ydoc,
    yText,
    awareness,
  };
}
