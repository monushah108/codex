import Directory from "@/model/directory";

export async function POST(request: any, { params }) {
  const { id } = await params;
  const user = request.user;

  await Directory.create({
    userId: user._id,
    roomId: id,
    parentId: user.rootDirId,
  });

  return Response.json(null, {
    status: 201,
  });
}

export async function DELETE(request: any) {
  const id = request.json();
  const user = request.user;
}

export async function PATCH(request: any) {
  const id = request.json();
  const user = request.user;
}
