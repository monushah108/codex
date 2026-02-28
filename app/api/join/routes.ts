import { connectDB } from "@/lib/db";
import Member from "@/model/member";
import Room from "@/model/room";
import { playSchema } from "@/validation/playground";
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
  const { success, data, error } = playSchema.safeParse({
    name,
    maxUser,
    roomType,
    password,
  });

  if (!success) {
    return Response.json(
      { error: z.flattenError(error).fieldErrors },
      { status: 422 },
    );
  }

  const { name, roomType, maxUser, password } = data;

  try {
    // const memeber = await Member.create({

    // })

    return Response.json({ request });
  } catch {
    return Response.json({ error: "server Error" }, { status: 500 });
  }
}
