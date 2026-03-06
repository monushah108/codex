import Directory from "@/model/directory";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.userId;

  const dir = await Directory.findById(userId.rootDirId);

  return Response.json(dir, {
    status: 200,
  });
}
