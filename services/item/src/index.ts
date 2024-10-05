import { compress } from "bun-compression";
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "hono/bun";
import { getCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { itemsController } from "./items/controller";
import { globalErrorHandler } from "./middleware/global-error-handler";

/**
 * The main entry point of the application.
 */
const app = new Hono();

// Configure middleware for all APIs.
app.use(
  // Compress the response in gzip.
  // TODO: Replace `bun-compression` with `hono/compress`,
  // once Bun has implemented `CompressionStream`. See oven-sh/bun#1723.
  compress(),

  // Enable CORS for all origins.
  // TODO: Narrow the origin to our own domain for better security.
  cors({ origin: "*", credentials: true }),

  // Log every incoming request and their corresponding response.
  // TODO: Write logs to a file for better monitoring.
  logger(),

  // Rate limit (100 req/min) based on the user's IP address.
  //
  // In most cases, IP address can be safely resolved and used as the criteria.
  //
  // However, in some marginal cases where IP address is not available,
  // the user's identity will instead be used as a fallback.
  //
  // And if the user has not yet logged in at that time,
  // he/she will be treated as an anonymous user,
  // and share one rate limit quota with all other anonymous users.
  // This is a risky move, but normally our program will not reach this far.
  rateLimiter({
    windowMs: 1000 * 60,
    limit: 100,
    keyGenerator: (c) =>
      getConnInfo(c).remote.address ??
      getCookie(c, "access_token") ??
      "anonymous",
  }),

  // Add security-related headers to the response.
  secureHeaders(),
);

// Health check endpoint.
app.get("/healthz", (c) => c.text("ok"));

// API for items.
app.route("/", itemsController);

// Global error handler.
app.onError(globalErrorHandler);

export default app;
