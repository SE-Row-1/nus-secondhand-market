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
import { transformCase } from "./middleware/transform-case";
import { searchController } from "./search/controller";

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

  // Enable CORS for local development and testing.
  cors({
    origin: (origin) => (Bun.env.NODE_ENV === "production" ? null : origin),
    credentials: Bun.env.NODE_ENV === "production" ? false : true,
  }),

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
  //
  // In testing environment, the rate limit is lifted to 10000 req/min.
  rateLimiter({
    windowMs: 1000 * 60,
    limit: Bun.env.NODE_ENV === "test" ? 10000 : 100,
    keyGenerator: (c) =>
      getConnInfo(c).remote.address ??
      getCookie(c, "access_token") ??
      "anonymous",
  }),

  // Add security-related headers to the response.
  secureHeaders(),

  // Transform camel case JSON keys to snake case.
  transformCase(),
);

// Health check endpoint.
app.get("/healthz", (c) => c.text("ok"));

// API for items.
app.route("/", itemsController);

// API for searching items.
app.route("/search", searchController);

// Global error handler.
app.onError(globalErrorHandler);

export default app;
