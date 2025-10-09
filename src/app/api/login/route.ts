import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === password && username.trim() !== "") {
    const res = NextResponse.json({ success: true });
    res.cookies.set("isLogged", "true", { path: "/" });

    return res;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
