import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "hono/bun";
import { getCookie } from "hono/cookie";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { itemsController } from "./items/controller";
import { globalErrorHandler } from "./middleware/global-error-handler";
import { globalNotFoundHandler } from "./middleware/global-not-found-handler";
import { transformCase } from "./middleware/transform-case";
import { itemPacksController } from "./item-packs/controller";

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
  transformCase(),
);

// Health check endpoint.
app.get("/healthz", (c) => c.text("ok"));

// Register controllers.
app.route("/items", itemsController);
app.route("/items/packs", itemPacksController);

// Register global handlers.
app.onError(globalErrorHandler);
app.notFound(globalNotFoundHandler);

export default app;
