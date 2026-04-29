import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const isProtected = nextUrl.pathname.startsWith("/dashboard");

  if (isProtected) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
    // @ts-ignore - NextAuth user might not have these properties by default
    if (session?.user?.isDisabled) return NextResponse.redirect(new URL("/login?error=account_disabled", nextUrl));
    // @ts-ignore
    if (!session?.user?.isEmailVerified) return NextResponse.redirect(new URL("/login?error=email_not_verified", nextUrl));
  }
  return NextResponse.next();
});
