import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return NextRequest.redirect(new URL("/home", request.url));
}

export const config = {
  matcher: "/api/",
};
