import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "hono/bun";
import { getCookie } from "hono/cookie";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

// Entry point of the application.
const app = new Hono();

// These middleware are applied to all routes.
app.use(
  logger(),
  rateLimiter({
    windowMs: 1000 * 60,
    limit: Bun.env.NODE_ENV === "test" ? 10000 : 100,
    keyGenerator: (c) =>
      getConnInfo(c).remote.address ??
      getCookie(c, "access_token") ??
      "anonymous",
  }),
  secureHeaders(),
);

// Health check endpoint.
app.get("/healthz", (c) => c.text("ok"));

export default app;
