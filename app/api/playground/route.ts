import { connectDB } from "@/lib/db";

import { getUserId } from "@/lib/getUserId";
import { playSchema } from "@/lib/schema/playground";
import Directory from "@/model/directory";

import Room from "@/model/room";

import mongoose, { Types } from "mongoose";

import { NextRequest } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const userId = await getUserId(request);
  const { success, data, error } = playSchema.safeParse(body);

  if (!success) {
    return Response.json(z.flattenError(error).fieldErrors, { status: 422 });
  }

  const { name, type, password, duration, expiresAt } = data;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const rootDirId = new Types.ObjectId();
    const roomId = new Types.ObjectId();

    const room = await Room.insertOne(
      {
        _id: roomId,
        adminId: userId,
        name: name,
        type: type,
        password,
        rootDirId,
        duration: duration ?? true,
        expiresAt: duration ? null : expiresAt,
      },
      { session },
    );

    await Directory.insertOne(
      {
        _id: rootDirId,
        name,
        roomId,
      },
      { session },
    );

    session.commitTransaction();

    const formated = {
      roomId: room._id,
      name: room.name,
      type: room.type,
    };

    return Response.json(formated, { status: 201 });
  } catch (err) {
    console.log(err);
    session.abortTransaction();
    return Response.json({ error: "server Error" }, { status: 500 });
  }
}
