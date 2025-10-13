// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { generateSecretHash } from "@/helper/cognitoHash";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const client = new CognitoIdentityProviderClient({ region: "us-east-1"});

  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: generateSecretHash(username),
      },
    });

    const response = await client.send(command);

    // if (response.ChallengeName) {
    //   return NextResponse.json({
    //     success: false,
    //     challenge: response.ChallengeName,
    //     session: response.Session,
    //     message: "MFA required or another challenge present.",
    //   });
    // }


    const res = NextResponse.json({ success: true });

    const tokens = response.AuthenticationResult!;

    res.cookies.set("accessToken", tokens?.AccessToken ?? "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    });
    res.cookies.set("idToken", tokens?.IdToken ?? "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    });
    res.cookies.set("refreshToken", tokens?.RefreshToken ?? "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("Login failed:", err);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
