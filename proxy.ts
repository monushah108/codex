import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1];
  const pathName = request.nextUrl.pathname;

  if (pathName == "/" && !token) {
    return Response.redirect(new URL("/login", request.nextUrl.origin));
  } else if (pathName == "/playground" && !token) {
    return Response.redirect(new URL("/login", request.nextUrl.origin));
  } else {
    return Response.redirect(new URL("/playground", request.nextUrl.origin));
  }
}

export const config = {
  matcher: ["/", "/playground/:path*", "/login"],
};
