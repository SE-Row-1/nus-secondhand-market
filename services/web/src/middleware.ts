import type { MiddlewareConfig, NextRequest } from "next/server";
import { AuthGuard } from "./middleware/auth-guard";
import { Logger } from "./middleware/logger";

export async function middleware(req: NextRequest) {
  const authGuard = new AuthGuard();
  authGuard.setNext(new Logger());

  return authGuard.handle(req);
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
