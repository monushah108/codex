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
  const load = useCodestore((s) => s.code[fileId]);
  const yText = useMemo(() => getYText(roomId, fileId), [roomId, fileId]);
  const awareness = useMemo(
    () => getAwareness(roomId, fileId),
    [roomId, fileId],
  );

  const user = useCodestore((state) => state.user);

  const colors = [
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#eab308",
    "#a855f7",
    "#ec4899",
  ];

  useEffect(() => {
    if (!roomId || !user) return;

    // -------------------------
    // Join room
    // -------------------------
    socket.emit("yjs:join", { roomId, fileId });

    awareness.setLocalStateField("user", {
      name: user?.name || "Anonymous",
      image: user?.image || null,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    // -------------------------
    // Send local updates
    // -------------------------
    const handleFileSaved = ({
      roomId,
      fileId,
      content,
    }: {
      roomId: string;
      fileId: string;
      content: string;
    }) => {
      const store = useCodestore.getState();

      store.setFileEdited(fileId, false);

      const current = store.code[fileId];
      console.log("currect", current);
      if (!current) return;

      store.updateContent(fileId, content);
    };

    socket.on("file:saved", handleFileSaved);

    // -------------------------
    // Initial Sync
    // -------------------------
    const handleSync = ({ update }: { update: number[] }) => {
      Y.applyUpdate(ydoc, new Uint8Array(update));
    };

    socket.on("yjs:sync", handleSync);

    // -------------------------
    // Receive remote updates
    // -------------------------
    const handleRemoteUpdate = ({ update }: { update: number[] }) => {
      Y.applyUpdate(ydoc, new Uint8Array(update), "remote");
    };

    socket.on("yjs:update", handleRemoteUpdate);

    // -------------------------
    // Send local updates
    // -------------------------
    const handleLocalUpdate = (update: Uint8Array, origin: unknown) => {
      if (origin === "remote") return;

      const store = useCodestore.getState();
      console.log("before", useCodestore.getState().code[fileId]);
      console.log({
        client: user.name,
        origin,
        current: yText.toString(),
        saved: store.code[fileId]?.savedContent,
      });
      const current = yText.toString();
      store.updateContent(fileId, current);
      console.log("after", useCodestore.getState().code[fileId]);
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
      socket.off("file:saved", handleFileSaved);

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
