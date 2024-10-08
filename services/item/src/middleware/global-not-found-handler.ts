import type { Context } from "hono";

/**
 * Customize 404 response if an endpoint is not found.
 */
export function globalNotFoundHandler(c: Context) {
  return c.json(
    { error: `Endpoint not found: ${c.req.method} ${c.req.path}` },
    404,
  );
}
