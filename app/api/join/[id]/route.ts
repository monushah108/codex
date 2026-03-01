import { connectDB } from "@/lib/db";
import { getUser } from "@/lib/getUser";
import Member from "@/model/member";
import Room from "@/model/room";
import { playSchema } from "@/validation/playground";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import z from "zod";

export async function GET(request: NextRequest, { id }) {
  await connectDB();
  const roomId = await id;
  const userId = await getUser(request);

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

// export async function POST(request: NextRequest, { id }) {
//   await connectDB();
//   const roomId = await id;
//   const body = await request.json();
//   const userId = await getUser(request);

//   const { password } = body;

//   try {
//     const isPasswordValid = await Room.comparePassword(password);
//     if (!isPasswordValid) {
//       return Response.json({ error: "Invalid Credentials" }, { status: 404 });
//     }

//     await Member.insertOne({
//       userId,
//       roomId,
//     });
//   } catch (err) {
//     console.log(err);
//     return Response.json({ error: "server Error" }, { status: 500 });
//   }
// }

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
