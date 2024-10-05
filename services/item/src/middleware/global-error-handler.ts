import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

/**
 * Handle any error that occurs during the request.
 *
 * @param error The error to be handled.
 * @param c Hono's context object.
 */
export function globalErrorHandler(error: unknown, c: Context) {
  if (error instanceof HTTPException) {
    return c.json({ error: error.message }, error.status);
  }

  console.error(error);
  return c.json({ error: "Unknown error occurred on server side." }, 500);
}
