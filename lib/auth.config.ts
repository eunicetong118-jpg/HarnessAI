import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.isDisabled = (user as any).isDisabled;
        token.isEmailVerified = (user as any).isEmailVerified;
        token.totpEnabled = (user as any).totpEnabled;
        token.twoFactorVerified = false;
      }

      if (trigger === "update" && session?.twoFactorVerified !== undefined) {
        token.twoFactorVerified = session.twoFactorVerified;
      }

      return token
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.isDisabled = token.isDisabled;
        session.user.isEmailVerified = token.isEmailVerified;
        session.user.totpEnabled = token.totpEnabled;
        session.user.twoFactorVerified = token.twoFactorVerified;
      }
      return session
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
