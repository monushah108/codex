import { connectDB } from "@/lib/db";
import { getUser } from "@/lib/getUser";
import Member from "@/model/member";
import Room from "@/model/room";
import { playSchema } from "@/validation/playground";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import z from "zod";

export async function GET(request: NextRequest) {
  await connectDB();
  const { userId, roomId } = await request.json();

  try {
    const room = await Room.findById(roomId);

    if (!room) {
      return Response.json(
        { error: "this server has been expired" },
        { status: 404 },
      );
    }

    const memberExists = await Member.findOne({ userId });

    if (!memberExists) {
      await Member.insertOne({
        userId,
        roomId,
      });

      Response.redirect(new URL(roomId, request.nextUrl.origin));
    }
  } catch (err) {
    return Response.json({ error: "server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const userId = await getUser(request);
  const { success, data, error } = playSchema.safeParse(body);

  if (!success) {
    return Response.json(z.flattenError(error).fieldErrors, { status: 422 });
  }

  const { roomName, roomType, password } = data;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const room = await Room.insertOne(
      {
        adminId: userId,
        name: roomName,
        type: roomType,
        password,
      },
      { session },
    );

    const member = await Member.insertOne(
      {
        userId,
        roomId: room._id,
        role: "admin",
      },
      { session },
    );

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
