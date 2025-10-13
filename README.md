# AWS Cognito + NextAuth + MFA Integration Guide

**NodeJS Version**: v22.17.0
**pnpm Version**: 10.12.4
**@aws-sdk/client-cognito-identity-provider**: ^3.908.0
**openid-client**: ^6.8.1,

---

## 1️⃣ Tạo User Pool

1. Truy cập [AWS Cognito Console](https://console.aws.amazon.com/cognito).
2. Chọn **Create user pool**.
3. Cấu hình cơ bản:
   - **Sign-in options:** Username hoặc Email
   - **Password policy:** đơn giản lúc đầu
   - **Self-service sign-up:** tuỳ chọn
   - **User attributes:** chọn `email`, `preferred_username`
4. Bấm **Create user pool**

📸 _Chèn ảnh màn hình tạo user pool ở đây:_

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/7df32777-b9bf-47b5-81c0-dabafeff81e5" />

**Kết quả:** bạn sẽ nhận được `User Pool ID`

> Ví dụ: `us-east-1_HeTka1C37`

---

## 2️⃣ Tạo App Client

1. Trong User Pool → **App integration → App clients → Create app client**
2. Cấu hình:
   - Name: `demo project`
   - Allowed OAuth flows: ✅ _Authorization code grant_
   - Allowed OAuth scopes: ✅ `openid`, `email`, `profile`, `aws.cognito.signin.user.admin`
   - Allowed callback URLs (url bên dưới là do nextauth có hỗ trợ callback):
     ```
     http://localhost:3000/api/auth/callback/cognito
     ```
   - Allowed sign-out URLs:
     ```
     http://localhost:3000/login
     ```
   - **Do not generate client secret** (❌)

📸 _Chèn ảnh màn hình App client settings ở đây:_

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/d53e00a0-8509-4015-b209-66937256a590" />

**Lưu lại:**

```
Client ID = 1dc68xxxxxxxxxxxxx
```

---

## 3️⃣ Cấu hình Domain Hosted UI

1. Trong **App integration → Domain name**
2. Nhập prefix domain (ví dụ `us-east-1hetka1c37`)
3. Lưu → Bạn sẽ có Hosted UI domain:
   ```
   https://us-east-1hetka1c37.auth.us-east-1.amazoncognito.com
   ```

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/e53000f3-3641-486b-9d74-5e87a8daef9c" />

---

## 4️⃣ Bật MFA (Authenticator App)

1. Trong User Pool → **Authentication → Sign In → Multi-factor authentication → Edit**
2. Chọn:
   - MFA: **Optional**
   - MFA types: ✅ _TOTP (Authenticator app)_
   - Software token MFA: ✅ Enable
   - Lưu ý: MFA bằng email hoặc sms phải cấu hình thêm Amazon SNS và Amazon SES
3. Save changes

<img width="1919" height="1071" alt="image" src="https://github.com/user-attachments/assets/098bdc9e-73de-4d31-9c5f-e5e129adbe0d" />

Người dùng sau này sẽ có thể scan mã QR bằng Google Authenticator / Authy.

---

## 5️⃣ Thiết lập biến môi trường `.env.local`

```bash
NEXT_PUBLIC_COGNITO_CLIENT_ID=1dc68vagxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_CLIENT_SECRET=196lrmrert3uxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_ISSUER=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_HeTka1C37
NEXT_PUBLIC_COGNITO_DOMAIN=https://us-east-1hetka1c37.auth.us-east-1.amazoncognito.com
NEXT_PUBLIC_LOGOUT_REDIRECT_URI=http://localhost:3000/login // logout này phải được cấu hình cho allowed logout baseurl
```

---

## 6️⃣ Cấu hình NextAuth

Tạo file:  
`app/api/auth/[...nextauth]/route.ts`

```ts
import { cookies } from "next/headers";
import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

const handler = NextAuth({
  providers: [
    CognitoProvider({
      clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET!,
      issuer: process.env.NEXT_PUBLIC_COGNITO_ISSUER!,
      authorization: {
        params: {
          scope: "openid email profile aws.cognito.signin.user.admin",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
      }
      return token;
    },

    async session({ session, token }) {
      const accessToken = token.accessToken as string;
      const refreshToken = token.refreshToken as string | undefined;
      const idToken = token.idToken as string | undefined;

      const cookieStore = cookies();

      if (accessToken) {
        (await cookieStore).set("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60,
          path: "/",
        });
      }

      if (refreshToken) {
        (await cookieStore).set("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
      }

      if (idToken) {
        (await cookieStore).set("idToken", idToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60,
          path: "/",
        });
      }

      session.accessToken = accessToken;
      session.refreshToken = refreshToken as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/0e892cfc-1118-4b2b-a77c-d65a92501ec4" />

---

## 7️⃣ API Logout (xoá token + Hosted UI session)

Tạo file:  
`app/api/auth/log-out/route.ts`

```ts
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
```

Log-out ở hàm trên chỉ xóa cookies ở client và phải gọi tới endpoint logout của Cognito để hủy session trên server

<img width="600" height="400" alt="image" src="https://github.com/user-attachments/assets/f95466f7-0af9-4e7c-afdb-657288984738" />

---

## 8️⃣ Bật MFA cho người dùng

1. Đăng nhập Cognito Hosted UI → Settings → MFA
2. Quét QR bằng Authenticator app
3. Xác thực mã OTP 6 chữ số

---

## 9️⃣ Kiểm tra thông tin user qua Access Token

```ts
// app/api/user/route.ts
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
```

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/f8d94158-cf46-42a0-9aa1-9caa793fcf22" />

---

## ✅ Tóm tắt luồng hoạt động

| Bước | Mô tả                       | Công cụ                                   |
| ---- | --------------------------- | ----------------------------------------- |
| 1    | Login (OAuth2 Code Flow)    | NextAuth + Cognito Hosted UI              |
| 2    | Lưu token (access, refresh) | NextAuth callbacks                        |
| 3    | Bật MFA (TOTP)              | Cognito Authenticator                     |
| 4    | Logout & revoke token       | `/api/auth/log-out` + Hosted UI `/logout` |
| 5    | Xác thực người dùng         | `GetUserCommand`                          |

---

> 🧩 Ghi chú:
>
> - Nếu dùng custom domain (VD: `auth.tukitoeic.app`), sửa lại biến `NEXT_PUBLIC_COGNITO_DOMAIN`.

---

## 🎯 Kết quả cuối cùng

- ✅ Đăng nhập/đăng xuất hoạt động
- ✅ Token lưu qua cookies an toàn
- ✅ MFA qua Authenticator app
- ✅ Có thể lấy thông tin user bằng AWS SDK
- ✅ Tương thích với môi trường production (Next.js 14+)

---

**End of Document**
