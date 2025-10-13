import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { generateSecretHash } from "@/helper/cognitoHash";

export async function POST(req: Request) {
  const { username, code } = await req.json();

  const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

  try {
    const command = new ConfirmSignUpCommand({
      ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      ConfirmationCode: code,
      SecretHash: generateSecretHash(username),
      Username: username,
    });

    const response = await client.send(command);

    return NextResponse.json({
      success: true,
      message: "Xác minh thành công! Bạn có thể đăng nhập ngay.",
      data: response,
    });
  } catch (err: any) {
    console.error("Confirm failed:", err.name, err.message);
    let message = "Mã xác minh không hợp lệ hoặc đã hết hạn.";
    if (err.name === "CodeMismatchException")
      message = "Mã OTP không chính xác.";
    if (err.name === "ExpiredCodeException") message = "Mã OTP đã hết hạn.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
