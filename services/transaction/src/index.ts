import "@/events/consume";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { globalErrorHandler } from "./middleware/global-error-handler";
import { globalNotFoundHandler } from "./middleware/global-not-found-handler";
import { transformCase } from "./middleware/transform-case";
import { transactionsController } from "./transactions/controller";

// Entry point.
const app = new Hono();

// Global middleware.
app.use(logger(), secureHeaders(), transformCase());

// Probes.
app.get("/healthz", (c) => c.text("ok"));

// Controllers.
app.route("/transactions", transactionsController);

// Global handlers.
app.onError(globalErrorHandler);
app.notFound(globalNotFoundHandler);

export default app;
