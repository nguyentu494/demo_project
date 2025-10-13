import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  CognitoIdentityProviderClient,
  RevokeTokenCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export async function GET() {
  try {
    const cookieStore = cookies();
    const refreshToken = (await cookieStore).get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Missing refresh token" },
        { status: 400 }
      );
    }

    const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
    await client.send(
      new RevokeTokenCommand({
        Token: refreshToken,
        ClientSecret: process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET,
        ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      })
    );

    const res = NextResponse.json({ success: true });
    const expired = new Date(0);

    res.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expired,
    });

    res.cookies.set("idToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expired,
    });

    res.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expired,
    });

    return res;
  } catch (err: any) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
