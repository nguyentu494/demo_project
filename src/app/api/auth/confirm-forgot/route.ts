import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  type ConfirmForgotPasswordCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { generateSecretHash } from "@/helper/cognitoHash";

const client = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
});

export async function POST(req: Request) {
  try {
    const { username, code, newPassword } = await req.json();

    if (!username || !code || !newPassword) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc (username, code, newPassword)" },
        { status: 400 }
      );
    }

    const input: ConfirmForgotPasswordCommandInput = {
      ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      Username: username,
      ConfirmationCode: code,
      Password: newPassword,
      SecretHash: generateSecretHash(username),
    };

    const command = new ConfirmForgotPasswordCommand(input);
    const result = await client.send(command);

    return NextResponse.json({
      success: true,
      message: "Mật khẩu đã được đặt lại thành công.",
      result,
    });
  } catch (error: any) {
    console.error("ConfirmForgotPassword error:", error);
    const awsMessage =
      error.name === "CodeMismatchException"
        ? "Mã xác minh không hợp lệ."
        : error.name === "ExpiredCodeException"
        ? "Mã xác minh đã hết hạn."
        : error.message || "Đã xảy ra lỗi khi xác nhận mật khẩu.";

    return NextResponse.json({ error: awsMessage }, { status: 500 });
  }
}
