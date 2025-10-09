import { NextResponse } from "next/server";
import { verifyMessage } from "viem";

export async function POST(req: Request) {
  const { address, message, signature } = await req.json();

  const ok = await verifyMessage({ address, message, signature });

  if (!ok) {
    return NextResponse.json({ verified: false }, { status: 401 });
  }

  return NextResponse.json({ verified: true });
}
