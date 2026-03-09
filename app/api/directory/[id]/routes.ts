import { getUserId } from "@/lib/getUserId";
import Directory from "@/model/directory";

export async function GET(request, { params }) {
  const { id } = await params;
  const user = await getUserId(request);

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
