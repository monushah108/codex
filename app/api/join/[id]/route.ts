import { db } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getUser } from "@/lib/getUser";
import Member from "@/model/member";
import Room from "@/model/room";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }) {
  await connectDB();

  const { id } = params;
  const userId = await getUser(request);
  const users = db.collection("user");

  console.log(users);

  try {
    const member = await Member.findOne({ userId });

    // ✅ Admin → go directly to playground
    if (member?.role === "admin") {
      return Response.json({
        redirectTo: `/playground/${id}`,
        access: "granted",
      });
    }

    const room = await Room.findById(id);

    if (!room) {
      return Response.json(
        { error: "Room expired or not found" },
        { status: 404 },
      );
    }

    // ✅ Private room → ask password
    if (room.type === "private") {
      return Response.json({
        redirectTo: `/playground/join/${id}`,
        access: "password_required",
        createdAt: room.createdAt,
      });
    }

    // ✅ Public room → allow entry
    return Response.json({
      redirectTo: `/playground/${id}`,
      access: "granted",
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }) {
  await connectDB();

  const { id: roomId } = await params;
  const body = await request.json();
  const userId = await getUser(request);
  const { password } = body;

  try {
    const room = await Room.findById(roomId);

    if (!room) {
      return Response.json({ error: "Room not found" }, { status: 404 });
    }

    const isPasswordValid = await room.comparePassword(password);

    if (!isPasswordValid) {
      return Response.json({ error: "Invalid Credentials" }, { status: 401 });
    }

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
