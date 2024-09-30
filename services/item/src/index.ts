import { itemsController } from "@/items/controller";
import { rateLimit } from "@/middleware/rate-limit";
import { compress } from "bun-compression";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono();

app.use(compress(), logger(), rateLimit(), secureHeaders());

app.get("/healthz", (context) => context.body(null));

app.route("/", itemsController);

export default app;
