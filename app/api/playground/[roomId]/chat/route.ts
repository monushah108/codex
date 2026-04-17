import { db } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import Chat from "@/model/chat";
import Message from "@/model/message";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }) {
  await connectDB();
  const { roomId } = await params;
  const cursor = request.nextUrl.searchParams.get("cursor");

  try {
    const userColl = db.collection("user");

    const chat = await Chat.findOne({ roomId }).select("_id");

    const msg = await Message.find({
      chatId: chat?._id,
    })
      .sort({ _id: -1 })
      .limit(20)
      .lean();

    const userIds = msg.map((m) => m.userId);

    const users = await userColl.find({ _id: { $in: userIds } }).toArray();

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const allMsgs = msg
      .map((m) => ({
        id: m._id.toString(),
        content: m.content,
        userId: m.userId.toString(),
        timeStamp: m.timeStamp,
        name: userMap.get(m.userId.toString())?.name,
        image: userMap.get(m.userId.toString())?.image,
      }))
      .reverse();

    return Response.json(
      { msgs: allMsgs, hasMore: msg.length === 20 },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return Response.json({ error: "server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }) {
  await connectDB();
  const { roomId } = await params;
  const { content, msgId } = await request.json();
  const userId = await getUserId(request);
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
