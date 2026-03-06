import Directory from "@/model/directory";

export async function POST(request, { params }) {
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

export async function DELETE(request) {
  const id = request.json();
  const user = request.user;
}

export async function PATCH(request) {
  const id = request.json();
  const user = request.user;
}
