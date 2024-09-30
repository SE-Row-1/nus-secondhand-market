import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "hono/bun";
import { getCookie } from "hono/cookie";

export function rateLimit() {
  return rateLimiter({
    windowMs: 1000 * 60,
    limit: 100,
    keyGenerator: (context) => {
      if (process.env.NODE_ENV !== "production") {
        return Math.random().toString();
      }

      return (
        getConnInfo(context).remote.address ??
        getCookie(context, "access_token") ??
        "anonymous"
      );
    },
  });
}
