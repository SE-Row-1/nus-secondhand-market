import "@/events/consume";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { itemPacksController } from "./item-packs/controller";
import { itemsController } from "./items/controller";
import { globalErrorHandler } from "./middleware/global-error-handler";
import { globalNotFoundHandler } from "./middleware/global-not-found-handler";
import { transformCase } from "./middleware/transform-case";

// Entry point of the application.
const app = new Hono();

// These middleware are applied to all routes.
app.use(logger(), secureHeaders(), transformCase());

// Health check endpoint.
app.get("/healthz", (c) => c.text("ok"));

// Register controllers.
app.route("/items", itemsController);
app.route("/items/packs", itemPacksController);

// Register global handlers.
app.onError(globalErrorHandler);
app.notFound(globalNotFoundHandler);

export default app;
