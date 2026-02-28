import { connectDB } from "@/lib/db";
import Member from "@/model/member";
import Room from "@/model/room";
import { NextRequest } from "next/server";

export function GET(request: NextRequest) {}

export async function POST(request: NextRequest) {
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

/* user jab like pe click karega to uski id  */
