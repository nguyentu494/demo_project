import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store");

  if (accessToken && (pathname === "/" || pathname.startsWith("/login"))) {
    const redirectUrl = new URL("/home", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // if (
  //   !accessToken &&
  //   ["/home", "/profile", "/products"].some((p) => pathname.startsWith(p))
  // ) {
  //   const redirectUrl = new URL("/login", req.url);
  //   const res = NextResponse.redirect(redirectUrl);
  //   res.headers.set("Cache-Control", "no-store");
  //   return res;
  // }

  return res;
}

export const config = {
  matcher: ["/login", "/home/:path*", "/profile/:path*", "/products/:path*"],
};
