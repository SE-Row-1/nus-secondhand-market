import { camelToSnake } from "@/utils/case";
import { createMiddleware } from "hono/factory";

/**
 * Transform the JSON response from camel case to snake case.
 */
export function transformCase() {
  return createMiddleware(async (c, next) => {
    await next();

    if (!c.res.headers.get("Content-Type")?.includes("application/json")) {
      return;
    }

    const camelCaseJson = (await c.res.json()) as Record<string, unknown>;
    const snakeCaseJson = camelToSnake(camelCaseJson);

    c.res = Response.json(snakeCaseJson, {
      status: c.res.status,
      statusText: c.res.statusText,
      headers: c.res.headers,
    });
  });
}
