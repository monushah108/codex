import { getUser } from "@/lib/getUser";
import Chat from "@/model/chat";
import Message from "@/model/message";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { roomId, cursor } = await request.query;

  console.log(roomId, cursor);

  try {
    const chatId = await Chat.find({ roomId });
    const msg = await Message.find({
      chatId,
      _id: { $lt: cursor },
    })
      .sort({ _id: -1 })
      .limit(20);

    return Response.json(msg, { status: 200 });
  } catch {
    return Response.json({ error: "server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { content, roomId } = await request.json();
  const userId = await getUser(request);

  const session = await mongoose.startSession();

  session.startTransaction();

  const chatId = await Chat.find({ roomId });

  try {
    if (!chatId) {
      await Message.insertOne({
        chatId,
        userId,
        content,
      });

      return Response.json({ msg: "sent" }, { status: 201 });
    }

    const newChat = await Chat.insertOne(
      {
        roomId,
      },
      { session },
    );

    await Message.insertOne(
      {
        chatId: newChat._id,
        userId,
        content,
      },
      { session },
    );
    session.commitTransaction();
    return Response.json({ msg: "sent" }, { status: 201 });
  } catch {
    session.abortTransaction();
    return Response.json({ error: "server Error" }, { status: 500 });
  }
}
