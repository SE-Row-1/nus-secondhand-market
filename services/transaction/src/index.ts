import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "hono/bun";
import { getCookie } from "hono/cookie";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { consumeAccountDeletedEvent } from "./events/consume-account-deleted-event";
import { consumeAccountUpdatedEvent } from "./events/consume-account-updated-event";
import { consumeItemDeletedEvent } from "./events/consume-item-deleted-event";
import { consumeItemUpdatedEvent } from "./events/consume-item-updated-event";
import { consumeTransactionAutoCompletedEvent } from "./events/consume-transaction-auto-completed-event";
import { globalErrorHandler } from "./middleware/global-error-handler";
import { globalNotFoundHandler } from "./middleware/global-not-found-handler";
import { transactionsController } from "./transaction/controller";

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

// Register controllers.
app.route("/transactions", transactionsController);

// Register global handlers.
app.onError(globalErrorHandler);
app.notFound(globalNotFoundHandler);

// Consume events.
await consumeAccountUpdatedEvent();
await consumeAccountDeletedEvent();
await consumeItemUpdatedEvent();
await consumeItemDeletedEvent();
await consumeTransactionAutoCompletedEvent();

export default app;
