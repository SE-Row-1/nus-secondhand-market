import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { isValiError } from "valibot";

/**
 * Centralized error handling for the entire application.
 *
 * In anywhere else, errors should not be directly returned as a response.
 * Rather, they should be thrown and then be caught and handled here.
 */
export function globalErrorHandler(error: unknown, c: Context) {
  if (isValiError(error)) {
    return c.json({ error: error.message }, 400);
  }

  if (error instanceof HTTPException) {
    if (error.status >= 500 && error.cause) {
      console.error(error.cause);
    }

    return c.json({ error: error.message }, error.status);
  }

  console.error(error);
  return c.json({ error: "Unknown error occurred on server side." }, 500);
}
