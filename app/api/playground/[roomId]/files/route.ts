import File from "@/model/file";
import { NextRequest } from "next/server";

/* =========================
   GET → Fetch Files
========================= */

export async function GET(request: NextRequest, { params }) {
  const { id: roomId } = params;

  const parentId = request.nextUrl.searchParams.get("parentId");

  try {
    const files = await File.find({
      roomId,
      parentDirId: parentId || null,
    }).lean();

    return Response.json(files);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "failed to fetch files" }, { status: 500 });
  }
}

/* =========================
   POST → Create File
========================= */

export async function POST(request: NextRequest, { params }) {
  const { id: roomId } = params;

  try {
    const { name, parentId } = await request.json();

    if (!name) {
      return Response.json({ error: "name required" }, { status: 400 });
    }

    const file = await File.create({
      name,
      parentDirId: parentId || null,
      roomId,
      content: "",
    });

    return Response.json(file, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "file creation failed" }, { status: 500 });
  }
}

/* =========================
   DELETE File
========================= */

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    await File.findByIdAndDelete(id);

    return Response.json({ message: "file deleted" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "delete failed" }, { status: 500 });
  }
}

/* =========================
   PATCH → Rename File
========================= */

export async function PATCH(request: NextRequest) {
  try {
    const { id, name } = await request.json();

    const file = await File.findByIdAndUpdate(id, { name }, { new: true });

    return Response.json(file);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "rename failed" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, content } = await request.json();

    const file = await File.findByIdAndUpdate(id, { content }, { new: true });

    return Response.json(file);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "update failed" }, { status: 500 });
  }
}
