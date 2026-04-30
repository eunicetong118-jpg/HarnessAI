import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const isProtected = nextUrl.pathname.startsWith("/dashboard") || nextUrl.pathname.startsWith("/admin");

  if (isProtected) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
    if (session?.user?.isDisabled) return NextResponse.redirect(new URL("/login?error=account_disabled", nextUrl));
    if (!session?.user?.isEmailVerified) return NextResponse.redirect(new URL("/login?error=email_not_verified", nextUrl));

    // 2FA check
    if ((session?.user as any)?.totpEnabled && !(session?.user as any)?.twoFactorVerified) {
      if (nextUrl.pathname !== "/auth/2fa") {
        return NextResponse.redirect(new URL("/auth/2fa", nextUrl));
      }
    }
  }

  // Security Headers
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
});
