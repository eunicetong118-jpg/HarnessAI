import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "./prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) return null

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isDisabled: user.isDisabled,
          isEmailVerified: user.isEmailVerified,
          totpEnabled: user.totpEnabled,
        }
      },
    }),
  ],
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
        (session.user as any).id = token.sub
        (session.user as any).role = token.role
        (session.user as any).isDisabled = token.isDisabled
        (session.user as any).isEmailVerified = token.isEmailVerified
        (session.user as any).totpEnabled = token.totpEnabled
        (session.user as any).twoFactorVerified = token.twoFactorVerified
      }
      return session
    },
  },
})
