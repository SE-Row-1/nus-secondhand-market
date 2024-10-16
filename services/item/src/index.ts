import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { getCookie } from "hono/cookie";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { itemsController } from "./items/controller";
import { globalErrorHandler } from "./middleware/global-error-handler";
import { globalNotFoundHandler } from "./middleware/global-not-found-handler";
import { transformCase } from "./middleware/transform-case";

const compress =
  process.env.NODE_ENV === "test"
    ? await import("bun-compression").then((m) => m.compress)
    : await import("hono/compress").then((m) => m.compress);

const getConnInfo =
  process.env.NODE_ENV === "test"
    ? await import("hono/bun").then((m) => m.getConnInfo)
    : await import("@hono/node-server/conninfo").then((m) => m.getConnInfo);

// Entry point of the application.
const app = new Hono();

// These middleware are applied to all routes.
app.use(
  // Compress the response in gzip.
  //
  // TODO: Replace `bun-compression` with `hono/compress`,
  // once Bun has implemented `CompressionStream`. See oven-sh/bun#1723.
  compress(),

  // Log incoming requests and their corresponding responses.
  //
  // TODO: Persist logs into files for better monitoring.
  logger(),

  // Rate limit based on IP address. (100 req/min)
  //
  // In most cases, the user's IP address is available and used as the criteria.
  //
  // However, in some marginal cases where IP address cannot be resolved,
  // the user's identity (indicated by JWT) will instead be used as a fallback.
  //
  // And if the user has not yet logged in at that time,
  // he/she will be considered as an anonymous user,
  // and share one rate limit quota with all other anonymous users.
  // This is a risky move, but normally our program will not reach this far.
  //
  // In testing environment, the rate limit is lifted to 10000 req/min.
  rateLimiter({
    windowMs: 1000 * 60,
    limit: process.env.NODE_ENV === "test" ? 10000 : 100,
    keyGenerator: (c) =>
      getConnInfo(c).remote.address ??
      getCookie(c, "access_token") ??
      "anonymous",
  }),

  // Add security-related headers to the response.
  secureHeaders(),

  // Transform the JSON response from camel case to snake case.
  transformCase(),
);

// Health check endpoint.
app.get("/healthz", (c) => c.text("ok"));

// Register API controllers.
app.route("/items", itemsController);

// Register global handlers.
app.onError(globalErrorHandler);
app.notFound(globalNotFoundHandler);

if (process.env.NODE_ENV !== "test") {
  const serve = await import("@hono/node-server").then((m) => m.serve);

  serve({
    fetch: app.fetch,
    port: process.env.PORT ?? 3000,
  });
}

export default app;
