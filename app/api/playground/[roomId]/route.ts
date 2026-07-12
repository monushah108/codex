import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";

import Room from "@/model/room";

import mongoose from "mongoose";

import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,

  {
    params,
  }: {
    params: Promise<{
      roomId: string;
    }>;
  },
) {
  await connectDB();
  const userId = await getUserId(request);

  try {
    const { roomId } = await params;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return Response.json(
        {
          error: "Invalid room id",
        },
        {
          status: 400,
        },
      );
    }

    const room = await Room.findById(roomId).lean();

    if (!room) {
      return Response.json(
        {
          error: "This room no longer exists",
        },
        {
          status: 404,
        },
      );
    }

    if (room.expiresAt && new Date(room.expiresAt) < new Date()) {
      return Response.json(
        {
          error: "Room expired",
        },
        {
          status: 410,
        },
      );
    }

    if (room.type === "private" && room.adminId != userId) {
      return Response.json(
        {
          error: "This is a private room",
          roomId: room._id,
          name: room.name,
          type: room.type,
          duration: room.duration,
          expiresAt: room.expiresAt,
        },
        {
          status: 403,
        },
      );
    }

    return Response.json({ msg: "granted", roomId: room._id }, { status: 201 });
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        error: "Server error",
      },
      {
        status: 500,
      },
    );
  }
}
