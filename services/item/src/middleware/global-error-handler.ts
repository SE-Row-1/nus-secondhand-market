import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

/**
 * Centralized error handling for the entire application.
 *
 * In anywhere else, errors should not be directly returned as a response.
 * Rather, they should be thrown as an `HTTPException`,
 * and then be caught and handled here.
 */
export function globalErrorHandler(error: unknown, c: Context) {
  if (error instanceof HTTPException) {
    if (error.status >= 500 && error.cause) {
      console.error(error.cause);
    }

    return c.json({ error: error.message }, error.status);
  }

  console.error(error);
  return c.json({ error: "Unknown error occurred on server side." }, 500);
}
