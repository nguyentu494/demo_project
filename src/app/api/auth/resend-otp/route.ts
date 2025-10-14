import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  ResendConfirmationCodeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { generateSecretHash } from "@/helper/cognitoHash";

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        { error: "Thiếu tên tài khoản (username)" },
        { status: 400 }
      );
    }

    const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

    const command = new ResendConfirmationCodeCommand({
      ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      SecretHash: generateSecretHash(username),
      Username: username,
    });

    const response = await client.send(command);

    return NextResponse.json({
      success: true,
      message:
        "Mã xác minh mới đã được gửi lại. Vui lòng kiểm tra email hoặc SMS của bạn.",
      data: {
        destination: response.CodeDeliveryDetails?.Destination,
        deliveryMedium: response.CodeDeliveryDetails?.DeliveryMedium,
      },
    });
  } catch (err: any) {
    console.error("Resend OTP failed:", err.name, err.message);

    let message = "Không thể gửi lại mã xác minh.";

    switch (err.name) {
      case "UserNotFoundException":
        message = "Tài khoản không tồn tại.";
        break;
      case "InvalidParameterException":
        message = "Tên người dùng không hợp lệ.";
        break;
      case "LimitExceededException":
        message =
          "Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau vài phút.";
        break;
      case "TooManyRequestsException":
        message = "Hệ thống đang bận, vui lòng thử lại sau.";
        break;
      case "NotAuthorizedException":
        message = "Tài khoản này đã được xác minh hoặc bị khóa.";
        break;
      default:
        message = err.message || message;
        break;
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
