import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { Middleware } from "./base";

/**
 * Protect certain routes based on the user's authentication status.
 */
export class AuthGuard extends Middleware {
  /**
   * These routes are accessible only if the user IS authenticated.
   */
  private static AUTH_ROUTES = /^\/belongings|^\/wishlist|^\/settings/;

  /**
   * These routes are accessible only if the user IS NOT authenticated.
   */
  private static NO_AUTH_ROUTES = /^\/login|^\/register|^\/forgot-password/;

  public override async handle(req: NextRequest) {
    const isAuthenticated = cookies().has("access_token");

    const isAuthRoute = AuthGuard.AUTH_ROUTES.test(req.nextUrl.pathname);

    if (isAuthRoute && !isAuthenticated) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }

    const isNoAuthRoute = AuthGuard.NO_AUTH_ROUTES.test(req.nextUrl.pathname);

    if (isNoAuthRoute && isAuthenticated) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }

    return await super.handle(req);
  }
}
