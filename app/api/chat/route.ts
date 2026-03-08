import { db } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getUser } from "@/lib/getUser";
import Chat from "@/model/chat";
import Message from "@/model/message";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await connectDB();
  const roomId = request.nextUrl.searchParams.get("roomId");
  const cursor = request.nextUrl.searchParams.get("cursor");

  try {
    const userColl = db.collection("user");

    const chat = await Chat.findOne({ roomId }).select("_id");

    const msg = await Message.find({
      chatId: chat?._id,
    })
      .sort({ _id: -1 })
      .limit(20);

    const userIds = msg.map((m) => m.userId);

    const users = await userColl.find({ _id: { $in: userIds } }).toArray();

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const messagesWithUser = msg.map((m) => ({
      ...m.toObject(),

      name: userMap.get(m.userId.toString())?.name,
      image: userMap.get(m.userId.toString())?.image,
    }));

    return Response.json(messagesWithUser, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json({ error: "server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await connectDB();
  const { content, roomId, msgId } = await request.json();
  const userId = await getUser(request);
  const session = await mongoose.startSession();

  session.startTransaction();

  const chat = await Chat.findOne({ roomId }).select("_id");

  try {
    if (chat) {
      const msg = await Message.insertOne({
        chatId: chat._id,
        userId,
        content,
      });

      return Response.json({ ...msg.toObject(), msgId }, { status: 201 });
    }

    const newChat = await Chat.insertOne(
      {
        roomId,
      },
      { session },
    );

    const msg = await Message.insertOne(
      {
        chatId: newChat._id,
        userId,
        content,
      },
      { session },
    );

    session.commitTransaction();
    return Response.json({ ...msg.toObject(), msgId }, { status: 201 });
  } catch (err) {
    session.abortTransaction();
    console.log(err);
    return Response.json({ error: "server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  try {
    await Message.findByIdAndDelete(id);

    return Response.json({ msg: "deleted" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return Response.json({ error: "server Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  await connectDB();
  const body = await request.json();

  const { id, editedMsg } = body;

  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { content: editedMsg },
      { new: true },
    );

    if (!updatedMessage) {
      return Response.json({ error: "Message not found" }, { status: 404 });
    }

    return Response.json(updatedMessage, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
