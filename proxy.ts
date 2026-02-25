import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const pathName = request.nextUrl.pathname;

  const token = cookieStore.get("better-auth.session_token")?.value;

  // 🟥 If NOT logged in
  if (!token) {
    if (pathName === "/login") {
      return NextResponse.next(); // allow login page
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🟩 If logged in
  if (token && pathName === "/login") {
    return NextResponse.redirect(new URL("/playground", request.url));
  }

  // 🟦 otherwise allow request
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/playground/:path*", "/login"],
};
