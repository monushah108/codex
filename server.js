import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import * as Y from "yjs";

const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handler = app.getRequestHandler();

// Store one Y.Doc per file
const docs = new Map();

function getDoc(roomId, fileId) {
  const key = `${roomId}:${fileId}`;

  if (!docs.has(key)) {
    docs.set(key, new Y.Doc());
  }

  return docs.get(key);
}

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client Connected:", socket.id);

    // ======================
    // JOIN
    // ======================
    // socket.on("yjs:join", ({ roomId, fileId }) => {
    //   const roomKey = `${roomId}:${fileId}`;

    //   socket.join(roomKey);

    //   const ydoc = getDoc(roomId, fileId);

    //   const state = Y.encodeStateAsUpdate(ydoc);

    //   socket.emit("yjs:sync", {
    //     update: Array.from(state),
    //   });

    //   console.log("Joined:", roomKey);
    // });

    let currentRoom = null;

    socket.on("yjs:join", ({ roomId, fileId }) => {
      const roomKey = `${roomId}:${fileId}`;

      // Leave previous file
      if (currentRoom && currentRoom !== roomKey) {
        socket.leave(currentRoom);
        console.log("Left:", currentRoom);
      }

      socket.join(roomKey);
      currentRoom = roomKey;

      const ydoc = getDoc(roomId, fileId);

      socket.emit("yjs:sync", {
        update: Array.from(Y.encodeStateAsUpdate(ydoc)),
      });

      console.log("Joined:", roomKey);
    });

    // ======================
    // DOCUMENT UPDATE
    // ======================
    socket.on("yjs:update", ({ roomId, fileId, update }) => {
      const roomKey = `${roomId}:${fileId}`;

      const ydoc = getDoc(roomId, fileId);

      Y.applyUpdate(ydoc, new Uint8Array(update));

      socket.to(roomKey).emit("yjs:update", {
        update,
      });
    });

    // ======================
    // AWARENESS
    // ======================
    socket.on("yjs:awareness", ({ roomId, fileId, update }) => {
      const roomKey = `${roomId}:${fileId}`;

      socket.to(roomKey).emit("yjs:awareness", {
        update,
      });
    });

    // =========================
    // UPDATE FILE
    // =========================

    socket.on("file:update", ({ roomId, fileId, update }) => {
      socket.to(roomId).emit("file:update", {
        update,
        fileId,
      });
    });

    // =========================
    // DELETE FILE
    // =========================

    socket.on("file:delete", ({ roomId, fileId }) => {
      socket.to(roomId).emit("file:delete", {
        fileId,
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });

  httpServer.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});
