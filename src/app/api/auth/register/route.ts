import { NextResponse } from "next/server";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { generateSecretHash } from "@/helper/cognitoHash";

export async function POST(req: Request) {
  const { username, password, email } = await req.json();

  const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

  

  try {
    const command = new SignUpCommand({
      ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      Username: username,
      Password: password,
      SecretHash: generateSecretHash(username),
      UserAttributes: [{ Name: "email", Value: email }],
    });

    const result = await client.send(command);

    if (process.env.NODE_ENV !== "production") {
      try {
        const confirm = new AdminConfirmSignUpCommand({
          UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
          Username: username,
        });
        await client.send(confirm);
      } catch (err) {
        console.warn("Auto-confirm failed:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      data: result,
    });
  } catch (err: any) {
    console.error("Register failed:", {
      name: err.name,
      message: err.message,
      code: err.$metadata?.httpStatusCode,
    });
    let message = "Registration failed";
    if (err.name === "UsernameExistsException")
      message = "User already exists.";
    if (err.name === "InvalidPasswordException")
      message = "Password does not meet requirements.";
    if (err.name === "InvalidParameterException")
      message = "Invalid input parameters.";

    return NextResponse.json(
      { error: message, details: err.message },
      { status: 400 }
    );
  }
}
