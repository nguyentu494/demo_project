import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  VerifySoftwareTokenCommand,
  RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export async function POST(req: Request) {
  try {
    const { session, username, code } = await req.json();

    if (!session || !username || !code) {
      return NextResponse.json(
        { error: "Missing session, username, or code" },
        { status: 400 }
      );
    }

    const client = new CognitoIdentityProviderClient({
      region: process.env.NEXT_PUBLIC_COGNITO_REGION || "us-east-1",
    });

    // Step 1: verify code người dùng nhập (6-digit)
    const verifyResponse = await client.send(
      new VerifySoftwareTokenCommand({
        Session: session,
        UserCode: code,
      })
    );

    // Nếu xác thực MFA thành công → tiếp tục đăng nhập hoàn tất
    if (verifyResponse.Status === "SUCCESS") {
      const finalResponse = await client.send(
        new RespondToAuthChallengeCommand({
          ChallengeName: "SOFTWARE_TOKEN_MFA",
          ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
          Session: verifyResponse.Session,
          ChallengeResponses: {
            USERNAME: username,
            SOFTWARE_TOKEN_MFA_CODE: code,
          },
        })
      );

      const tokens = finalResponse.AuthenticationResult;

      if (!tokens) {
        return NextResponse.json(
          { error: "Missing AuthenticationResult after MFA verify" },
          { status: 400 }
        );
      }

      // Optionally: set cookies (access & refresh token)
      const res = NextResponse.json({ success: true, tokens });

      res.cookies.set("accessToken", tokens.AccessToken!, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      res.cookies.set("refreshToken", tokens.RefreshToken!, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      return res;
    }

    return NextResponse.json(
      { error: "Invalid or expired MFA code" },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Error verifying MFA:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify MFA" },
      { status: 500 }
    );
  }
}
