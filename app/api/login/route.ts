import { connectDB } from "@/lib/db";
import Session from "@/model/session";
import User from "@/model/user";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const { email, password } = req.body;
  const cookieStore = await cookies();
  const user = await User.findOne({ email });

  if (!user) {
    return Response.json(
      { error: "Invalid Credentials" },
      {
        status: 403,
      },
    );
  }

  const allSessions = await Session.find({ userId: user._id });

  if (allSessions.length >= 2) {
    await allSessions[0].deleteOne();
  }

  const session = await Session.create({
    userId: user._id,
    rootDirId: user.rootDirId,
  });

  cookieStore.set("sid", session.id, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60,
  });

  return Response.json({ message: "logged in" }, { status: 201 });
}
