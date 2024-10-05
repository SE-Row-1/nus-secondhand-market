import { itemsController } from "@/items/controller";
import { compress } from "bun-compression";
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "hono/bun";
import { getCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { globalErrorHandler } from "./middleware/global-error-handler";

const app = new Hono();

app.use(
  compress(),
  cors({ origin: "*", credentials: true }),
  logger(),
  rateLimiter({
    windowMs: 1000 * 60,
    limit: 100,
    keyGenerator: (c) =>
      getConnInfo(c).remote.address ??
      getCookie(c, "access_token") ??
      "anonymous",
  }),
  secureHeaders(),
);

app.get("/healthz", (c) => c.body(null));

app.route("/", itemsController);

app.onError(globalErrorHandler);

export default app;
