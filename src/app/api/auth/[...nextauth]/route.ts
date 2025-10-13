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
