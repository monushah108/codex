import { createServer } from "node:http";

import next from "next";

import { Server } from "socket.io";

import * as Y from "yjs";

const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });

const handler = app.getRequestHandler();

const rooms = new Map();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    // ======================
    // JOIN
    // ======================

    socket.on("yjs:join", ({ roomId }) => {
      socket.join(roomId);
      // console.log("join room");
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Y.Doc());
      }

      const ydoc = rooms.get(roomId);

      const state = Y.encodeStateAsUpdate(ydoc);

      socket.emit("yjs:sync", {
        update: Array.from(state),
      });
    });

    // ======================
    // DOC UPDATE
    // ======================

    socket.on("yjs:update", ({ roomId, update }) => {
      const ydoc = rooms.get(roomId);
      // console.log("update yjs");
      if (!ydoc) return;

      Y.applyUpdate(ydoc, new Uint8Array(update));

      socket.to(roomId).emit("yjs:update", {
        update,
      });
    });

    // ======================
    // AWARENESS
    // ======================

    socket.on("yjs:awareness", ({ roomId, update }) => {
      // console.log("awareness yjs");
      socket.to(roomId).emit("yjs:awareness", {
        update,
      });
    });
  });

  httpServer.listen(3000, () => {
    console.log("server running");
  });
});
