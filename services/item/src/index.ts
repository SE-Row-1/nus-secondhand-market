import { Hono } from "hono";

const app = new Hono();

app.get("/", (context) => context.body(null));

export default app;
