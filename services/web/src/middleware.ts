import { cookies } from "next/headers";
import {
  NextResponse,
  type MiddlewareConfig,
  type NextRequest,
} from "next/server";

const NO_AUTH_REG_EXPS = [/^\/login$/, /^\/register$/];
const AUTH_REG_EXPS = [/^\/settings/, /^\/belongings/];

export async function middleware(request: NextRequest) {
  const isAuthenticated = cookies().has("access_token");

  if (
    isAuthenticated &&
    NO_AUTH_REG_EXPS.some((regExp) => regExp.test(request.nextUrl.pathname))
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  if (
    !isAuthenticated &&
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
    "/((?!api|_next/static|_next/image|icon.svg|sitemap.xml|robots.txt).*)",
  ],
};
