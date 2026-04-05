import Directory from "@/model/directory";
import File from "@/model/file";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

/* =========================
   GET → Lazy Load Folders
========================= */

export async function GET(request: NextRequest, { params }) {
  const { roomId } = await params;
  console.log("roomId", roomId);
  const parentId = request.nextUrl.searchParams.get("parentId");

  let parentObjectId = null;
  let rootDir = null;

  if (!parentId || parentId === "null") {
    rootDir = await Directory.findOne({
      roomId,
      parentDirId: null,
    }).lean();

    if (!rootDir) {
      return Response.json(
        { error: "root directory not found" },
        { status: 404 },
      );
    }

    parentObjectId = rootDir._id;
  } else {
    parentObjectId = new mongoose.Types.ObjectId(parentId);
  }

  try {
    const folders = await Directory.find({
      roomId,
      parentDirId: parentObjectId,
      _id: { $ne: rootDir?._id },
    }).lean();

    const files = await File.find({
      roomId,
      parentDirId: parentId || null,
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
    return Response.json({ error: "failed to fetch folders" }, { status: 500 });
  }
}

/* =========================
   POST → Create Folder
========================= */

export async function POST(request: NextRequest, { params }) {
  const { roomId } = await params;

  try {
    const body = await request.json();
    const { name, parentId } = body;

    if (!name) {
      return Response.json({ error: "name required" }, { status: 400 });
    }

    const folder = await Directory.create({
      name,
      parentDirId: parentId || null,
      roomId,
    });

    return Response.json(folder, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "failed to create folder" }, { status: 500 });
  }
}

/* =========================
   DELETE Folder
========================= */

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    await Directory.findByIdAndDelete(id);

    return Response.json({ message: "folder deleted" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "delete failed" }, { status: 500 });
  }
}

/* =========================
   PATCH → Rename Folder
========================= */

export async function PATCH(request: NextRequest) {
  try {
    const { id, name } = await request.json();

    const folder = await Directory.findByIdAndUpdate(
      id,
      { name },
      { new: true },
    );

    return Response.json(folder);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "rename failed" }, { status: 500 });
  }
}
