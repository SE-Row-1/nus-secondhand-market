import { cookies } from "next/headers";
import {
  NextResponse,
  type MiddlewareConfig,
  type NextRequest,
} from "next/server";

/**
 * Regular expressions for routes accessible only if user IS NOT authenticated.
 */
const NO_AUTH_REG_EXPS = [/^\/login$/, /^\/register$/];

/**
 * Regular expressions for routes accessible only if user IS authenticated.
 */
const AUTH_REG_EXPS = [/^\/settings/, /^\/belongings/];

export async function middleware(req: NextRequest) {
  const isAuthenticated = cookies().has("access_token");

  if (
    isAuthenticated &&
    NO_AUTH_REG_EXPS.some((regExp) => regExp.test(req.nextUrl.pathname))
  ) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  if (
    !isAuthenticated &&
    AUTH_REG_EXPS.some((regExp) => regExp.test(req.nextUrl.pathname))
  ) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  /**
   * Match all routes, except for those starting with:
   *
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - icon.svg (favicon file)
   */
  matcher: [
    "/((?!api|_next/static|_next/image|icon.svg|sitemap.xml|robots.txt).*)",
  ],
};
