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

  const users = new Map();

  io.on("connection", (socket) => {
    console.log("Client Connected:", socket.id);

    // ======================
    // JOIN
    // ======================

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
    // JOIN EXPLORER
    // =========================
    socket.on("explorer:join", ({ roomId, user }) => {
      users.set(socket.id, {
        roomId,
        user,
      });

      socket.join(roomId);
      const members = [...users.values()]
        .filter((m) => m.roomId === roomId)
        .map((m) => m.user);
      io.to(roomId).emit("members", members);
      socket.to(roomId).emit("activity", {
        id: crypto.randomUUID(),
        userId: user.id,
        userName: user.name,
        type: "join",
        time: new Date().toLocaleTimeString(),
      });
    });

    socket.on("explorer:leave", ({ roomId, user }) => {
      socket.leave(roomId);
      users.delete(socket.id);

      const members = [...users.values()]
        .filter((m) => m.roomId === roomId)
        .map((m) => m.user);

      io.to(roomId).emit("members", members);

      socket.to(roomId).emit("activity", {
        id: crypto.randomUUID(),
        userId: user.id,
        userName: user.name,
        type: "leave",
        time: new Date().toLocaleTimeString(),
      });
    });

    // =========================
    // ACTIVIIES
    // =========================

    socket.on("activity", ({ roomId, type, msg }) => {
      socket.to(roomId).emit("activity", {
        type,
        msg,
      });
    });

    // =========================
    // AI CHAT MESSAGES
    // =========================

    socket.on("messages", ({ roomId, user, payload }) => {
      io.to(roomId).emit("messages", {
        payload,
      });
      socket.to(roomId).emit("activity", {
        id: crypto.randomUUID(),
        userId: user.id,
        userName: user.name,
        type: `${user.name} generating some response from codex-ai`,
        time: new Date().toLocaleTimeString(),
      });
    });

    // =========================
    // TERMINAL
    // =========================

    socket.on("terminal", ({ roomId, data }) => {
      console.log("terminal received:", roomId, data);

      io.to(roomId).emit("terminal", {
        data,
      });
    });

    // =========================
    // EXPLORER OPERATIONS
    // =========================

    socket.on(
      "explorer:operation",
      ({ roomId, user, type, target, payload }) => {
        socket.to(roomId).emit("explorer:operation", {
          user,
          type,
          target,
          payload,
        });

        const fileName =
          payload.file?.name ?? payload.folder?.name ?? payload.newName ?? "";
        const activity = {
          id: crypto.randomUUID(),
          userId: user.id,
          userName: user.name,
          type,
          target,
          fileName,
          time: new Date().toLocaleTimeString(),
          message: `${user.name} has ${type}  ${target}  "${fileName}"`,
        };

        socket.to(roomId).emit("activity", activity);
      },
    );

    socket.on("disconnect", () => {
      const member = users.get(socket.id);

      if (!member) return;

      users.delete(socket.id);

      const members = [...users.values()]
        .filter((m) => m.roomId === member.roomId)
        .map((m) => m.user);

      io.to(member.roomId).emit("members", members);

      io.to(member.roomId).emit("activity", {
        id: crypto.randomUUID(),
        userId: member.user.id,
        userName: member.user.name,
        type: "leave",
        time: new Date().toLocaleTimeString(),
      });
    });
  });

  httpServer.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});
