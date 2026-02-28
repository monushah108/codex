import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function getUser(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) return null;

  return session.user.id;
}
