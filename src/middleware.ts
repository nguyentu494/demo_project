import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {

  const isLogged = req.cookies.get("isLogged")?.value;
  console.log(isLogged)

  if (!isLogged) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/products/:path*", "/home/:path*"],
};
