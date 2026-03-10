import { getUserId } from "@/lib/getUserId";
import Directory from "@/model/directory";
import File from "@/model/file";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }) {
  const { id: roomId } = await params;
  const userId = await getUserId(request);

  const hasRootDir = await Directory.findOne({
    roomId,
    parentId: null,
  });

  try {
    if (!hasRootDir) {
      return Response.json(
        { error: "no root directory found !!" },
        { status: 404 },
      );
    }

    const directories = await Directory.find({
      roomId,
      parentId: userId,
    }).lean();

    const files = await File.find({
      roomId,
      parentId: userId,
    }).lean();

    return Response.json(
      { directories, files },
      {
        status: 201,
      },
    );
  } catch {
    return Response.json({ error: "server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }) {
  const { id: roomId } = await params;
  const userId = await getUserId(request);
  const docId = request.nextUrl.searchParams.get("d");
}

export async function DELETE(request) {
  const id = request.json();
  const user = request.user;
}

export async function PATCH(request) {
  const id = request.json();
  const user = request.user;
}
