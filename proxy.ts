import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const pathName = request.nextUrl.pathname;

  const token = cookieStore.get("better-auth.session_token")?.value;

  if (!token) {
    if (pathName === "/login") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }

  if (token && pathName === "/login") {
    return NextResponse.redirect(
      new URL("/playground", request.nextUrl.origin),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/playground/:path*", "/login"],
};
