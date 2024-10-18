import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { BaseMiddleware } from "./base";

export class AuthGuard extends BaseMiddleware {
  private static NO_AUTH_ROUTES = /^\/login|^\/register|^\/forgot-password/;

  private static AUTH_ROUTES = /^\/belongings|^\/wishlist|^\/settings/;

  public override async handle(req: NextRequest) {
    const isAuthenticated = cookies().has("access_token");

    const isAuthRoute = AuthGuard.AUTH_ROUTES.test(req.nextUrl.pathname);

    if (isAuthRoute && !isAuthenticated) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.searchParams.set("next", req.nextUrl.pathname);
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
