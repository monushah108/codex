import { getUserId } from "@/lib/getUserId";
import Directory from "@/model/directory";
import File from "@/model/file";
import { NextRequest } from "next/server";

/* =========================
   GET  → Lazy Load Children
========================= */

export async function GET(request: NextRequest, { params }) {
  const { id: roomId } = await params;

  const parentId = request.nextUrl.searchParams.get("parentId");

  const rootDir = await Directory.findOne({
    roomId,
    parentDirId: null,
  }).lean();

  if (!rootDir) {
    return Response.json(
      { error: "root directory not found" },
      { status: 404 },
    );
  }

  try {
    const folders = await Directory.find({
      roomId,
      parentDirId: parentId === "null" ? null : parentId,
    }).lean();

    const files = await File.find({
      roomId,
      parentDirId: parentId === "null" ? null : parentId,
    }).lean();

    return Response.json(
      {
        rootDir,
        folders,
        files,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);

    return Response.json(
      { error: "failed to fetch directory" },
      { status: 500 },
    );
  }
}

/* =========================
   POST → Create File/Folder
========================= */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, parentId, type, roomId } = body;

    const userId = await getUserId(request);

    if (!name || !type) {
      return Response.json(
        { error: "missing required fields" },
        { status: 400 },
      );
    }

    if (type === "folder") {
      const folder = await Directory.create({
        name,
        parentDirId: parentId || null,
        roomId,
      });

      return Response.json(folder, { status: 201 });
    }

    if (type === "file") {
      const file = await File.create({
        name,
        parentDirId: parentId || null,
        roomId,
      });

      return Response.json(file, { status: 201 });
    }

    return Response.json({ error: "invalid type" }, { status: 400 });
  } catch (err) {
    console.error(err);

    return Response.json({ error: "failed to create entry" }, { status: 500 });
  }
}

/* =========================
   DELETE → Remove File/Folder
========================= */

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    const { id, type } = body;

    if (!id || !type) {
      return Response.json({ error: "missing id or type" }, { status: 400 });
    }

    if (type === "folder") {
      await Directory.findByIdAndDelete(id);
    }

    if (type === "file") {
      await File.findByIdAndDelete(id);
    }

    return Response.json({ message: "deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);

    return Response.json({ error: "delete failed" }, { status: 500 });
  }
}

/* =========================
   PATCH → Rename File/Folder
========================= */

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const { id, name, type } = body;

    if (!id || !name || !type) {
      return Response.json({ error: "missing fields" }, { status: 400 });
    }

    if (type === "folder") {
      const folder = await Directory.findByIdAndUpdate(
        id,
        { name },
        { new: true },
      );

      return Response.json(folder);
    }

    if (type === "file") {
      const file = await File.findByIdAndUpdate(id, { name }, { new: true });

      return Response.json(file);
    }

    return Response.json({ error: "invalid type" }, { status: 400 });
  } catch (err) {
    console.error(err);

    return Response.json({ error: "rename failed" }, { status: 500 });
  }
}
