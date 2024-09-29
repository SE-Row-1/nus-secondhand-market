import type { MiddlewareConfig, NextRequest } from "next/server";
import { NextResponse } from "next/server";

const NO_AUTH_REG_EXPS = [/^\/login$/, /^\/register$/];
const AUTH_REG_EXPS = [/^\/settings/];

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token");

  if (
    accessToken &&
    NO_AUTH_REG_EXPS.some((regExp) => regExp.test(request.nextUrl.pathname))
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  if (
    !accessToken &&
    AUTH_REG_EXPS.some((regExp) => regExp.test(request.nextUrl.pathname))
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
