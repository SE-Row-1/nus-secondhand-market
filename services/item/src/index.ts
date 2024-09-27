import { itemsRouter } from "@/items/router";
import { compress } from "bun-compression";
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "hono/bun";
import { getCookie } from "hono/cookie";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono();

app.use(compress());

app.use(logger());

app.use(
  rateLimiter({
    windowMs: 1000 * 60,
    limit: 100,
    keyGenerator: (context) =>
      getConnInfo(context).remote.address ??
      getCookie(context, "access_token") ??
      "anonymous",
  }),
);

app.use(secureHeaders());

app.get("/healthz", (context) => context.body(null));

app.route("/", itemsRouter);

export default app;
