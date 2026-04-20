import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import MicrosoftEntraId from "next-auth/providers/microsoft-entra-id";
import { findOrCreateOAuthUser } from "@/backend/db";
import { signToken } from "@/backend/auth";
import { cookies } from "next/headers";

export const { handlers, auth, signIn } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    MicrosoftEntraId({
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      issuer: "https://login.microsoftonline.com/common/v2.0",
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  basePath: "/api/oauth",
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !account) return false;

      const dbUser = findOrCreateOAuthUser(
        user.email,
        user.name || "User",
        account.provider,
        account.providerAccountId,
      );

      const token = signToken({
        userId: dbUser.id,
        email: dbUser.email,
        username: dbUser.username,
        tokenVersion: dbUser.token_version ?? 0,
      });

      const cookieStore = await cookies();
      cookieStore.set("unfilter_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return true;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
  session: { strategy: "jwt" },
});
