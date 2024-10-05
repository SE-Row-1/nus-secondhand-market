import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export function globalErrorHandler(error: unknown, c: Context) {
  if (error instanceof HTTPException) {
    return c.json({ error: error.message }, error.status);
  }

  console.error(error);
  return c.json({ error: "Unknown error occurred on server side." }, 500);
}
