import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  // 🔹 Get members in a room
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
    console.log("✅ connected:", socket.id);

    // 🔹 JOIN ROOM
    socket.on("room:join", ({ roomId, user }) => {
      if (!roomId || !user) return;

      socket.join(roomId);
      socket.data.user = user;

      console.log(`👤 ${user.name} joined ${roomId}`);

      const members = getRoomMembers(roomId);
      io.to(roomId).emit("room:members", members);
    });

    // 🔹 SEND MESSAGE (GROUP)
    socket.on("chat:send", async ({ roomId, content, msgId }) => {
      const user = socket.data.user;
      if (!user) return;

      const message = {
        id: msgId,
        content,
        userId: user.id,
        name: user.name,
        image: user.image,
        timeStamp: new Date().toLocaleDateString(),
      };

      io.to(roomId).emit("chat:receive", message);
    });

    // 🔹 DELETE MESSAGE
    socket.on("chat:delete", ({ msgId, roomId }) => {
      const user = socket.data.user;
      if (!user) return;

      io.to(roomId).emit("chat:delete", {
        msgId,
        userId: user.id,
      });
    });

    // 🔹 EDIT MESSAGE
    socket.on("chat:edit", ({ msgId, newText, roomId }) => {
      const user = socket.data.user;
      if (!user) return;

      io.to(roomId).emit("chat:edit", {
        msgId,
        newText,
        userId: user.id,
      });
    });

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
      console.log("❌ disconnected:", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`🚀 Ready on http://${hostname}:${port}`);
  });
});
