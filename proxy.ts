import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const pathName = request.nextUrl.pathname;

  if (!session) {
    if (pathName.startsWith("/auth") || pathName === "/") {
      return NextResponse.next();
    }
    return NextResponse.redirect(
      new URL("/auth/signup", request.nextUrl.origin),
    );
  }

  if (session && pathName.startsWith("/auth")) {
    return NextResponse.redirect(
      new URL("/playground", request.nextUrl.origin),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/playground/:path*", "/auth/:path*", "/join/:path*"],
};
