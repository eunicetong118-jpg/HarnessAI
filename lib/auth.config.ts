import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role
        token.isDisabled = (user as any).isDisabled
        token.isEmailVerified = (user as any).isEmailVerified
        token.totpEnabled = (user as any).totpEnabled
        token.twoFactorVerified = false
      }

      if (trigger === "update" && session?.twoFactorVerified !== undefined) {
        token.twoFactorVerified = session.twoFactorVerified
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub as string
        (session.user as any).role = token.role
        (session.user as any).isDisabled = token.isDisabled
        (session.user as any).isEmailVerified = token.isEmailVerified
        (session.user as any).totpEnabled = token.totpEnabled
        (session.user as any).twoFactorVerified = token.twoFactorVerified
      }
      return session
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
