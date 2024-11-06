import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { isValiError } from "valibot";

/**
 * Centralized error handling logic.
 *
 * For anywhere else, errors must not be returned as a response.
 * Rather, they should be thrown and end up being caught and handled here.
 */
export function globalErrorHandler(error: unknown, c: Context) {
  if (isValiError(error)) {
    return c.json({ error: error.message }, 400);
  }

  if (error instanceof HTTPException) {
    if (error.status >= 500) {
      console.error(error);
    }

    return c.json({ error: error.message }, error.status);
  }

  console.error(error);

  if (error instanceof Error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ error: "Unknown server-side error" }, 500);
}
