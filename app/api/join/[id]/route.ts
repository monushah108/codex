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

    // ✅ Private room → ask password
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

    // ✅ Public room → allow entry
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

export async function POST(request: NextRequest, { params }) {
  await connectDB();

  const { id: roomId } = await params;
  const body = await request.json();
  const userId = await getUserId(request);
  const { password } = body;

  try {
    const room = await Room.findById(roomId);

    console.log(room);

    if (!room) {
      return Response.json({ error: "Room not found" }, { status: 404 });
    }

    const isPasswordValid = await room.comparePassword(password);

    if (!isPasswordValid) {
      return Response.json({ error: "Invalid Credentials" }, { status: 401 });
    }

    const isMember = await Member.findOne({ userId, roomId });
    if (isMember) {
      return Response.json({ msg: "you have alredy joined" }, { status: 409 });
    }

    console.log(isMember);

    await Member.insertOne({
      userId,
      roomId,
    });

    return Response.json({ success: true }, { status: 201 });
  } catch (err) {
    console.log(err);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
