import * as Y from "yjs";

import {
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
} from "y-protocols/awareness";

export function setupYjsSocketSync({
  socket,
  ydoc,
  awareness,
  roomId,
  fileId,
}) {
  const yRoom = `${roomId}:${fileId}`;

  // JOIN
  socket.emit("yjs:join", {
    roomId: yRoom,
  });

  // DOC UPDATE
  const updateHandler = (update, origin) => {
    if (origin === "socket") return;

    socket.emit("yjs:update", {
      roomId: yRoom,
      update: Array.from(update),
    });
  };

  ydoc.on("update", updateHandler);

  // RECEIVE DOC
  const receiveUpdate = ({ update }) => {
    Y.applyUpdate(ydoc, new Uint8Array(update), "socket");
  };

  socket.on("yjs:update", receiveUpdate);

  // INITIAL SYNC
  socket.on("yjs:sync", receiveUpdate);

  // AWARENESS SEND
  const awarenessHandler = ({ added, updated, removed }) => {
    const changedClients = [...added, ...updated, ...removed];

    const awarenessUpdate = encodeAwarenessUpdate(awareness, changedClients);

    socket.emit("yjs:awareness", {
      roomId: yRoom,
      update: Array.from(awarenessUpdate),
    });
  };

  awareness.on("update", awarenessHandler);

  // AWARENESS RECEIVE
  const receiveAwareness = ({ update }) => {
    applyAwarenessUpdate(awareness, new Uint8Array(update), "socket");
  };

  socket.on("yjs:awareness", receiveAwareness);

  return () => {
    ydoc.off("update", updateHandler);

    awareness.off("update", awarenessHandler);

    socket.off("yjs:update", receiveUpdate);

    socket.off("yjs:sync", receiveUpdate);

    socket.off("yjs:awareness", receiveAwareness);
  };
}
