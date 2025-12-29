import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decodeToken } from "./lib/jwt";

const protectedRoutes = ["/studio", "/studio/*"];
const publicRoutes = ["/login", "/register"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/api/") || path.startsWith("/_next/") || path.includes(".")) {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => path === route);

  const cookie = (await cookies()).get("session_token")?.value;

  if (isProtectedRoute) {
    if (!cookie) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    const session = decodeToken(cookie);
    if (!session?.email) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    return NextResponse.next();
  }

  if (isPublicRoute) {
    if (cookie) {
      const session = decodeToken(cookie);
      if (session?.email) {
        return NextResponse.redirect(new URL("/studio", req.nextUrl));
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
