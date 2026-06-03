import { db } from "@/lib/auth";

import { connectDB } from "@/lib/db";

import { getUserId } from "@/lib/getUserId";

import Member from "@/model/member";

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

  try {
    const { roomId } = await params;

    const userId = await getUserId(request);

    //
    // VALIDATE ROOM ID
    //

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

    //
    // GET ROOM
    //

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

    //
    // ROOM EXPIRED
    //

    if (
      !room.duration &&
      room.expiresAt &&
      new Date(room.expiresAt) < new Date()
    ) {
      return Response.json(
        {
          error: "Room expired",
        },
        {
          status: 410,
        },
      );
    }

    //
    // CHECK MEMBER
    //

    const isMember = await Member.findOne({
      userId,
      roomId,
    }).lean();

    //
    // MEMBERS ALWAYS ALLOWED
    //

    if (isMember) {
      return Response.json(
        {
          access: "granted",

          currentUsers: room.currentUsers,

          maxUsers: room.maxUsers,

          roomName: room.name,

          type: room.type,
        },
        {
          status: 200,
        },
      );
    }

    //
    // ROOM FULL
    //

    if (room.currentUsers >= room.maxUsers) {
      return Response.json(
        {
          access: "room_full",

          error: "Room is full",

          currentUsers: room.currentUsers,

          maxUsers: room.maxUsers,
        },
        {
          status: 403,
        },
      );
    }

    //
    // PUBLIC ROOM
    //

    if (room.type === "public") {
      return Response.json(
        {
          access: "granted",

          currentUsers: room.currentUsers,

          maxUsers: room.maxUsers,

          roomName: room.name,

          type: room.type,
        },
        {
          status: 200,
        },
      );
    }

    //
    // PRIVATE ROOM
    //

    const users = db.collection("user");

    const admin = await users.findOne({
      _id: room.adminId,
    });

    return Response.json(
      {
        access: "password_required",

        admin_name: admin?.name,

        admin_img: admin?.image,

        createdAt: room.createdAt,

        currentUsers: room.currentUsers,

        maxUsers: room.maxUsers,

        duration: room.duration,

        expiresAt: room.expiresAt,
      },
      {
        status: 403,
      },
    );
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

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const userId = await getUserId(request);

    const { name, type, password, maxUsers, duration, expiresAt } =
      await request.json();

    if (!name?.trim()) {
      return Response.json({ error: "Room name is required" }, { status: 400 });
    }

    const room = await Room.create({
      name,
      type: type || "public",
      password: password || undefined,
      adminId: userId,
      maxUsers: maxUsers || 3,
      duration: duration ?? true,
      expiresAt: duration ? null : expiresAt,
    });

    return Response.json(
      {
        success: true,
        roomId: room._id,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to create room",
      },
      {
        status: 500,
      },
    );
  }
}
