import Directory from "@/model/directory";

export async function GET(request: any) {
  const userId = request.userId;

  const dir = await Directory.findById(userId.rootDirId);

  return Response.json(dir, {
    status: 200,
  });
}
