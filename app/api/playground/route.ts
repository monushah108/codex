import { connectDB } from "@/lib/db";
import Member from "@/model/member";
import Room from "@/model/room";
import { playSchema } from "@/lib/schema/playground";
import mongoose, { Types } from "mongoose";
import { NextRequest } from "next/server";
import z from "zod";
import { getUserId } from "@/lib/getUserId";
import Directory from "@/model/directory";

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const userId = await getUserId(request);
  const { success, data, error } = playSchema.safeParse(body);

  if (!success) {
    return Response.json(z.flattenError(error).fieldErrors, { status: 422 });
  }

  const { roomName, roomType, password } = data;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const rootDirId = new Types.ObjectId();
    const roomId = new Types.ObjectId();

    const room = await Room.insertOne(
      {
        _id: roomId,
        adminId: userId,
        name: roomName,
        type: roomType,
        password,
        rootDirId,
      },
      { session },
    );

    await Member.insertOne(
      {
        userId,
        roomId,
        role: "admin",
      },
      { session },
    );

    await Directory.insertOne(
      {
        _id: rootDirId,
        name: roomName,
        roomId,
      },
      { session },
    );

    session.commitTransaction();

    const formated = {
      id: room._id,
      name: room.name,
      type: room.type,
    };

    return Response.json({ room: formated }, { status: 201 });
  } catch (err) {
    console.log(err);
    session.abortTransaction();
    return Response.json({ error: "server Error" }, { status: 500 });
  }
}
