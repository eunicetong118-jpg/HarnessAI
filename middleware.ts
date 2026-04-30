import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { nextUrl } = req
  const isLoggedIn = !!token
  const isProtected =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/admin")

  if (isProtected) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl))

    if (token.isDisabled)
      return NextResponse.redirect(new URL("/login?error=account_disabled", nextUrl))
    if (!token.isEmailVerified)
      return NextResponse.redirect(new URL("/login?error=email_not_verified", nextUrl))

    // 2FA check
    if (token.totpEnabled && !token.twoFactorVerified) {
      if (nextUrl.pathname !== "/auth/2fa") {
        return NextResponse.redirect(new URL("/auth/2fa", nextUrl))
      }
    }

    // Admin check
    if (nextUrl.pathname.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
