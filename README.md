# AWS Cognito + NextAuth + MFA Integration Guide

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

<!-- IMAGE: app-client-settings -->

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

📸 _Chèn ảnh cấu hình domain ở đây:_

<!-- IMAGE: hosted-ui-domain -->

---

## 4️⃣ Bật MFA (Authenticator App)

1. Trong User Pool → **Authentication → MFA and verifications**
2. Chọn:
   - MFA: **Optional**
   - MFA types: ✅ _TOTP (Authenticator app)_
   - Software token MFA: ✅ Enable
3. Save changes

📸 _Chèn ảnh màn hình bật MFA ở đây:_

<!-- IMAGE: enable-mfa -->

Người dùng sau này sẽ có thể scan mã QR bằng Google Authenticator / Authy.

---

## 5️⃣ Thiết lập biến môi trường `.env.local`

```bash
NEXTAUTH_SECRET=superlongsecret
NEXTAUTH_URL=http://localhost:3000

NEXT_PUBLIC_COGNITO_CLIENT_ID=1dc68vagok8ogafn2da4qnvf8r
NEXT_PUBLIC_COGNITO_ISSUER=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_HeTka1C37
NEXT_PUBLIC_COGNITO_DOMAIN=us-east-1hetka1c37.auth.us-east-1.amazoncognito.com
```

---

## 6️⃣ Cấu hình NextAuth

Tạo file:  
`app/api/auth/[...nextauth]/route.ts`

```ts
import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import { cookies } from "next/headers";

const handler = NextAuth({
  providers: [
    CognitoProvider({
      clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      issuer: process.env.NEXT_PUBLIC_COGNITO_ISSUER!,
      clientSecret: "",
      authorization: {
        params: {
          scope: "openid email profile aws.cognito.signin.user.admin",
          prompt: "login",
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
      const cookieStore = cookies();
      if (token.accessToken)
        (await cookieStore).set("accessToken", token.accessToken as string, {
          httpOnly: true,
          path: "/",
        });
      if (token.refreshToken)
        (await cookieStore).set("refreshToken", token.refreshToken as string, {
          httpOnly: true,
          path: "/",
        });
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

📸 _Chèn ảnh phần cấu hình provider trong NextAuth:_

<!-- IMAGE: nextauth-config -->

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

export async function POST() {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
      const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
      await client.send(
        new RevokeTokenCommand({
          Token: refreshToken,
          ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
        })
      );
    }

    const res = NextResponse.json({ success: true });
    const expired = new Date(0);

    ["accessToken", "refreshToken", "idToken"].forEach((name) => {
      res.cookies.set(name, "", {
        httpOnly: true,
        path: "/",
        expires: expired,
      });
    });

    // Redirect xóa session Hosted UI
    res.headers.set(
      "Location",
      `https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/logout?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}&logout_uri=http://localhost:3000/login`
    );
    res.status = 302;

    return res;
  } catch (err: any) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

📸 _Chèn ảnh minh họa luồng logout:_

<!-- IMAGE: logout-flow -->

---

## 8️⃣ Bật MFA cho người dùng

1. Đăng nhập Cognito Hosted UI → Settings → MFA
2. Quét QR bằng Authenticator app
3. Xác thực mã OTP 6 chữ số

📸 _Chèn ảnh màn hình người dùng quét QR code:_

<!-- IMAGE: mfa-setup -->

---

## 9️⃣ Kiểm tra thông tin user qua Access Token

```ts
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
const res = await client.send(new GetUserCommand({ AccessToken: accessToken }));
console.log(res.UserAttributes);
```

📸 _Chèn ảnh ví dụ API GetUser trả về dữ liệu user:_

<!-- IMAGE: getuser-response -->

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
> - Nếu bật **mandatory MFA**, người dùng sẽ luôn bị yêu cầu nhập mã OTP khi login.
> - Bạn có thể chèn sơ đồ flow (sequence diagram) ở cuối file nếu muốn.

📸 _Chèn sơ đồ tổng quan luồng login/logout ở đây:_

<!-- IMAGE: final-flow -->

---

## 🎯 Kết quả cuối cùng

- ✅ Đăng nhập/đăng xuất hoạt động
- ✅ Token lưu qua cookies an toàn
- ✅ MFA qua Authenticator app
- ✅ Có thể lấy thông tin user bằng AWS SDK
- ✅ Tương thích với môi trường production (Next.js 14+)

---

**End of Document**
