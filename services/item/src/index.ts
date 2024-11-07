import "@/events/consume";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { itemPacksController } from "./item-packs/controller";
import { itemsController } from "./items/controller";
import { globalErrorHandler } from "./middleware/global-error-handler";
import { globalNotFoundHandler } from "./middleware/global-not-found-handler";
import { transformCase } from "./middleware/transform-case";

// Entry point.
const app = new Hono();

// Global middleware.
app.use(logger(), transformCase());

// Probes.
app.get("/healthz", (c) => c.text("ok"));

// Controllers.
app.route("/items", itemsController);
app.route("/items/packs", itemPacksController);

// Global handlers.
app.onError(globalErrorHandler);
app.notFound(globalNotFoundHandler);

export default app;
