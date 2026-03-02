import { getUser } from "@/lib/getUser";
import Member from "@/model/member";
import Room from "@/model/room";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }) {
  const { roomId } = await params;
  const userId = await getUser(request);

  const isMember = await Member.findOne({
    userId,
    roomId,
    role: { $ne: ["admin", "manager", "user"] },
  });

  if (!isMember) {
    return Response.json(
      { redirectTo: `/playground/join/${roomId}` },
      { status: 401 },
    );
  }

  return Response.json(
    { redirectTo: `/playground/${roomId}` },
    { status: 201 },
  );
}
