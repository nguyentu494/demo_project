import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

export async function GET() {
  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing access token" },
        { status: 401 }
      );
    }

    const res = await client.send(
      new GetUserCommand({ AccessToken: accessToken })
    );

    const userAttributes: Record<string, string> = {};
    res.UserAttributes?.forEach((attr) => {
      if (attr.Name) {
        userAttributes[attr.Name] = attr.Value ?? "";
      }
    });

    return NextResponse.json({
      username: res.Username,
      attributes: userAttributes,
    });
  } catch (err: any) {
    console.error("GetUser error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
