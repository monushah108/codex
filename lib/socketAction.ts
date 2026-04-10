import { socket } from "./socket";

type user = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

type msg = {
  roomId: string;
  msg: string;
  content: string;
  name: string;
  image: string;
  timeStamp: string;
};

export const Chatsocket = {
  connect: () => {
    socket.connect();
  },

  joinRoom: (roomId: string, userId: string) => {
    socket.emit("create-room", roomId, userId);
  },

  members: (users: user[]) => {
    socket.on("joined-users", (data) => users.push(data));
  },

  sendMsg: (roomId: string, msg: string) => {
    socket.emit(`${roomId}:msg`, { roomId, msg });
  },

  getMsg: (roomId: string, msgs: msg[]) => {
    socket.on(`${roomId}:msg`, (data) => {
      msgs.push(data);
      console.log(data);
    });
  },

  deleteMsg: (roomId: string, msgId: string) => {
    socket.emit(`${roomId}:delete`, { roomId, msgId });
  },

  disconnect: () => {
    socket.disconnect();
  },
};
