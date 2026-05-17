import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { WebSocketServer, WebSocket } from "ws";
import * as Y from "yjs";
import * as syncProtocol from "y-protocols/sync";
import * as awarenessProtocol from "y-protocols/awareness";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";

const messageSync = 0;
const messageAwareness = 1;
const messageQueryAwareness = 3;

const docs = new Map();

const getYDoc = (docName) => {
  let doc = docs.get(docName);
  if (!doc) {
    const ydoc = new Y.Doc();
    const awareness = new awarenessProtocol.Awareness(ydoc);
    awareness.setLocalState(null);
    doc = {
      ydoc,
      awareness,
      conns: new Set(),
      wsClientIDs: new Map(),
    };
    docs.set(docName, doc);
  }
  return doc;
};

const decodeAwarenessUpdate = (update) => {
  const decoder = decoding.createDecoder(update);
  const clients = [];
  const len = decoding.readVarUint(decoder);

  for (let i = 0; i < len; i += 1) {
    const clientID = decoding.readVarUint(decoder);
    const clock = decoding.readVarUint(decoder);
    const state = JSON.parse(decoding.readVarString(decoder));
    clients.push({ clientID, clock, state });
  }

  return clients;
};

const broadcast = (docState, data, origin) => {
  docState.conns.forEach((socket) => {
    if (socket !== origin && socket.readyState === WebSocket.OPEN) {
      socket.send(data);
    }
  });
};

const createAwarenessUpdate = (awareness, clients) => {
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageAwareness);
  encoding.writeVarUint8Array(
    encoder,
    awarenessProtocol.encodeAwarenessUpdate(awareness, clients),
  );
  return encoding.toUint8Array(encoder);
};

const handleYjsMessage = (docState, ws, message) => {
  const data = new Uint8Array(message);
  const decoder = decoding.createDecoder(data);
  const encoder = encoding.createEncoder();
  const messageType = decoding.readVarUint(decoder);

  switch (messageType) {
    case messageSync: {
      const syncMessageType = syncProtocol.readSyncMessage(
        decoder,
        encoder,
        docState.ydoc,
        ws,
        (error) => {
          console.error("Yjs sync error:", error);
        },
      );

      if (encoding.length(encoder) > 1) {
        ws.send(encoding.toUint8Array(encoder));
      }

      if (syncMessageType === syncProtocol.messageYjsUpdate) {
        broadcast(docState, data, ws);
      }
      break;
    }
    case messageAwareness: {
      const update = decoding.readVarUint8Array(decoder);
      const awarenessClients = decodeAwarenessUpdate(update);

      const clientIDs = docState.wsClientIDs.get(ws) ?? new Set();
      awarenessClients.forEach(({ clientID, state }) => {
        if (state === null) {
          clientIDs.delete(clientID);
        } else {
          clientIDs.add(clientID);
        }
      });
      docState.wsClientIDs.set(ws, clientIDs);
      awarenessProtocol.applyAwarenessUpdate(docState.awareness, update, ws);
      broadcast(docState, data, ws);
      break;
    }
    case messageQueryAwareness: {
      ws.send(
        createAwarenessUpdate(
          docState.awareness,
          Array.from(docState.awareness.getStates().keys()),
        ),
      );
      break;
    }
    default:
      break;
  }
};

const setupYjsConnection = (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname ?? "";
  const docName = path.replace(/^\/yjs\/?/, "");

  if (!docName) {
    ws.close();
    return;
  }

  const docState = getYDoc(docName);
  docState.conns.add(ws);
  docState.wsClientIDs.set(ws, new Set());
  ws.binaryType = "arraybuffer";

  ws.on("message", (message) => handleYjsMessage(docState, ws, message));

  ws.on("close", () => {
    const clientIDs = docState.wsClientIDs.get(ws);
    if (clientIDs && clientIDs.size > 0) {
      awarenessProtocol.removeAwarenessStates(
        docState.awareness,
        Array.from(clientIDs),
        ws,
      );
      const update = createAwarenessUpdate(
        docState.awareness,
        Array.from(clientIDs),
      );
      broadcast(docState, update, ws);
    }
    docState.conns.delete(ws);
    docState.wsClientIDs.delete(ws);
  });
};

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

  const wss = new WebSocketServer({ server: httpServer, path: "/yjs" });
  wss.on("connection", (ws, req) => {
    setupYjsConnection(ws, req);
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
