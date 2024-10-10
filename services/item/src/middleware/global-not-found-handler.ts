import type { Context } from "hono";

/**
 * Customize 404 response for unknown endpoints.
 */
export function globalNotFoundHandler(c: Context) {
  return c.json(
    { error: `Endpoint not found: ${c.req.method} ${c.req.path}` },
    404,
  );
}
