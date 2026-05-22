import { db } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";

import Member from "@/model/member";
import Room from "@/model/room";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }) {
  await connectDB();

  const { id: roomId } = await params;
  const userId = await getUserId(request);

  try {
    const isValidId = mongoose.Types.ObjectId.isValid(roomId);

    if (!isValidId) {
      return Response.json({ error: "not a valid id" }, { status: 400 });
    }

    const IsMember = await Member.findOne({ userId, roomId });

    if (IsMember) {
      return Response.json(
        {
          access: "granted",
        },
        { status: 200 },
      );
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return Response.json(
        { error: "this room no longer exists " },
        { status: 404 },
      );
    }

    const users = db.collection("user");

    const user = await users.findOne({ _id: room.adminId });

    if (room.type === "private") {
      return Response.json(
        {
          admin_name: user?.name,
          admin_img: user?.image,
          access: "password_required",
          createdAt: room.createdAt,
        },
        { status: 403 },
      );
    }

    return Response.json(
      {
        access: "granted",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const session = await mongoose.startSession();

  try {
    const { id: roomId } = await params;

    const body = await request.json();

    const { password } = body;

    const userId = await getUserId(request);

    session.startTransaction();

    const room = await Room.findById(roomId).session(session);

    if (!room) {
      await session.abortTransaction();

      return Response.json({ error: "Room not found" }, { status: 404 });
    }

    // EXPIRED ROOM
    if (!room.isPermanent && room.expiresAt && room.expiresAt < new Date()) {
      await session.abortTransaction();

      return Response.json({ error: "Room expired" }, { status: 410 });
    }

    // ROOM FULL
    if (room.currentUsers >= room.maxUsers) {
      await session.abortTransaction();

      return Response.json({ error: "Room is full" }, { status: 403 });
    }

    // PASSWORD CHECK
    if (room.type === "private") {
      const valid = await room.comparePassword(password);

      if (!valid) {
        await session.abortTransaction();

        return Response.json({ error: "Invalid password" }, { status: 401 });
      }
    }

    // ALREADY MEMBER
    const existingMember = await Member.findOne({
      userId,
      roomId,
    }).session(session);

    if (existingMember) {
      await session.abortTransaction();

      return Response.json({ error: "Already joined" }, { status: 409 });
    }

    await Member.create(
      [
        {
          userId,
          roomId,
        },
      ],
      { session },
    );

    room.currentUsers += 1;

    await room.save({ session });

    await session.commitTransaction();

    return Response.json(
      {
        success: true,
      },
      { status: 201 },
    );
  } catch (error) {
    await session.abortTransaction();

    console.error(error);

    return Response.json({ error: "Server Error" }, { status: 500 });
  } finally {
    session.endSession();
  }
}
