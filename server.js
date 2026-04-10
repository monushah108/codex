import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("create-room", ({ roomId, userId }) => {
      const serverName = roomId;
      socket.join(serverName);

      socket.data.userId = userId;

      socket
        .to(serverName)
        .emit("joined-users", { sId: socket.id, uId: userId });

      // for msgs
      socket.on(`${serverName}:msg`, ({ roomId, msg }) => {
        io.to(roomId).emit(`${serverName}:msg`, {
          user: socket.data.userId,
          msg,
        });
      });

      // for yjs buffer docs
      socket.on(`${serverName}:doc:send`, ({ roomId, Bufferdata }) => {
        io.to(roomId).emit("doc:receive", Bufferdata);
      });

      //disconnect
      socket.on("disconnect", () => {
        console.log("user dis", socket.io);
      });
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
