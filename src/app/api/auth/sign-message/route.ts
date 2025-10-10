import { verifyMessage } from 'viem';
import api from "@/libs/axios";
import { NextResponse } from "next/server";


export async function GET() {

  const res = await api.get("auth/sign-message");

  if (!res.status || res.status !== 200) {
    return NextResponse.json({ verified: false }, { status: 401 });
  }

  return NextResponse.json({ data: res.data }, { status: 200 });
}
