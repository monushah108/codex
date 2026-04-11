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
  const io = new Server(httpServer);

  const getRoomMembers = (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);

    if (!room) return [];

    return [...room].map((id) => {
      const s = io.sockets.sockets.get(id);

      return {
        sId: id,
        uId: s?.data.userId,
      };
    });
  };

  io.on("connection", (socket) => {
    socket.on("joinRoom", ({ roomId, userId }) => {
      socket.join(roomId);
      socket.data.userId = userId;

      const members = getRoomMembers(roomId);

      io.to(roomId).emit("members", members);

      // messages
      socket.on("send_message", ({ roomId, content }) => {
        io.to(roomId).emit("receive_message", {
          user: socket.data.userId,
          content,
        });
      });

      // yjs docs
      socket.on(`${roomId}:doc:send`, ({ roomId, Bufferdata }) => {
        io.to(roomId).emit("doc:receive", Bufferdata);
      });

      socket.on("disconnect", () => {
        console.log("disconnect", socket.id);
      });
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
