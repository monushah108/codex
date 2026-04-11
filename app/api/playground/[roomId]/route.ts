import { db } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import Member from "@/model/member";
import Room from "@/model/room";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }) {
  await connectDB();

  const { roomId } = await params;
  const userId = await getUserId(request);

  try {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return Response.json({ error: "Invalid room id" }, { status: 400 });
    }

    const room = await Room.findById(roomId).lean();

    if (!room) {
      return Response.json(
        { error: "This room no longer exists" },
        { status: 404 },
      );
    }

    // check membership
    const isMember = await Member.findOne({ userId, roomId }).lean();

    if (isMember) {
      return Response.json({ access: "granted" }, { status: 200 });
    }

    const users = db.collection("user");

    // PRIVATE ROOM
    if (room.type === "private") {
      const admin = await users.findOne({ _id: room.adminId });

      return Response.json(
        {
          admin_name: admin?.name,
          admin_img: admin?.image,
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
