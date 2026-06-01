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
      socket.to(roomId).emit("yjs:awareness", {
        update,
      });
    });
    // TERMINAL ROOM
    socket.on("terminal:join", (roomId) => {
      socket.join(roomId);
    });

    // RUN CODE
    socket.on("code:run", async ({ roomId, code, languageId }) => {
      try {
        const res = await fetch(
          "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              source_code: code,

              language_id: languageId,
            }),
          },
        );

        const data = await res.json();

        const output =
          data.stdout || data.stderr || data.compile_output || "No output";

        // SEND ONLY TO ROOM
        io.to(roomId).emit("terminal:output", {
          output,
        });
      } catch {
        io.to(roomId).emit("terminal:output", {
          output: "Execution Error",

          error: true,
        });
      }
    });

    // TERMINAL COMMAND
    socket.on("terminal:command", ({ roomId, command }) => {
      io.to(roomId).emit("terminal:output", {
        output: `command: ${command}`,
      });
    });
  });

  httpServer.listen(3000, () => {
    console.log("server running");
  });
});
