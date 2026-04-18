import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// Store Yjs docs per room
// const docs = new Map<string, Y.Doc>();

// const getYDoc = (roomId: string) => {
//   let doc = docs.get(roomId);
//   if (!doc) {
//     doc = new Y.Doc();
//     docs.set(roomId, doc);
//   }
//   return doc;
// };

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  const getRoomMembers = (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room) return [];

    return [...room].map((id) => {
      const s = io.sockets.sockets.get(id);
      return {
        sId: id,
        uId: s?.data.user,
      };
    });
  };

  io.on("connection", (socket) => {
    console.log("connected:", socket.id);

    // 🔹 JOIN ROOM
    socket.on("room:join", ({ roomId, user }) => {
      socket.join(roomId);
      socket.data.user = user;

      const members = getRoomMembers(roomId);
      io.to(roomId).emit("room:members", members);

      // // Send initial Yjs state
      // const doc = getYDoc(roomId);
      // const state = Y.encodeStateAsUpdate(doc);
      // socket.emit("yjs:init", state);
    });

    // 🔹 CHAT MESSAGE
    socket.on("chat:send", async ({ roomId, content }) => {
      const user = socket.data.user;

      const message = {
        id: crypto.randomUUID(),
        content,
        userId: user.id,
        name: user.name,
        image: user.image,
        timeStamp: Date.now(),
      };

      io.to(roomId).emit("chat:receive", message);
    });

    socket.on("chat:delete", ({ msgId, roomId }) => {
      const user = socket.data.user;

      io.to(roomId).emit("chat:delete", {
        msgId,
        userId: user.id,
      });
    });

    socket.on("chat:edit", ({ msgId, newText, roomId }) => {
      const user = socket.data.user;

      io.to(roomId).emit("chat:edit", {
        msgId,
        newText,
        userId: user.id,
      });
    });

    // 🔹 YJS SYNC (DOCUMENT UPDATES)
    // socket.on("yjs:update", ({ roomId, update }) => {
    //   const doc = getYDoc(roomId);

    //   // Apply update to server doc
    //   Y.applyUpdate(doc, new Uint8Array(update));

    //   // Broadcast to others
    //   socket.to(roomId).emit("yjs:update", update);
    // });

    // // 🔹 YJS AWARENESS (CURSOR, USER PRESENCE)
    // socket.on("yjs:awareness", ({ roomId, awareness }) => {
    //   socket.to(roomId).emit("yjs:awareness", {
    //     userId: socket.data.userId,
    //     awareness,
    //   });
    // });

    // 🔹 DISCONNECT
    socket.on("disconnecting", () => {
      for (const roomId of socket.rooms) {
        if (roomId !== socket.id) {
          const members = getRoomMembers(roomId);
          io.to(roomId).emit("room:members", members);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("disconnected:", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
