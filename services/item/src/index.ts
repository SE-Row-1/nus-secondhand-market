import { itemsController } from "@/items/controller";
import { compress } from "bun-compression";
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "hono/bun";
import { getCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono();

app.use(
  compress(),
  cors({ origin: "*", credentials: true }),
  logger(),
  rateLimiter({
    windowMs: 1000 * 60,
    limit: 100,
    keyGenerator: (context) =>
      getConnInfo(context).remote.address ??
      getCookie(context, "access_token") ??
      "anonymous",
  }),
  secureHeaders(),
);

app.get("/healthz", (context) => context.body(null));

app.route("/", itemsController);

export default app;
