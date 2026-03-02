import { getUser } from "@/lib/getUser";
import Member from "@/model/member";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }) {
  const { roomId } = await params;
  const userId = await getUser(request);

  const isMember = await Member.findOne({
    userId,
    roomId,
    role: { $in: ["admin", "manager", "user"] },
  });

  if (!isMember) {
    return Response.json(
      { redirectTo: "aunthorized !! , not a memeber of this room" },
      { status: 403 },
    );
  }

  return Response.json({ redirectTo: "access granted" }, { status: 200 });
}
