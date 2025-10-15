// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  ForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { generateSecretHash } from "@/helper/cognitoHash";

const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: "Missing username or email" },
        { status: 400 }
      );
    }

    const command = new ForgotPasswordCommand({
      ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      SecretHash: generateSecretHash(username),
      Username: username,
    });

    const result = await client.send(command);

    return NextResponse.json({
      message: "Verification code sent successfully",
      codeDeliveryDetails: result.CodeDeliveryDetails,
    });
  } catch (error: any) {
    console.error("ForgotPassword error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send verification code" },
      { status: 500 }
    );
  }
}

