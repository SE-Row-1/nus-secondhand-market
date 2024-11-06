import { camelToSnake } from "@/utils/case";
import { createMiddleware } from "hono/factory";

/**
 * Transform JSON response from camelCase to snake_case.
 */
export function transformCase() {
  return createMiddleware(async (c, next) => {
    await next();

    if (!c.res.headers.get("Content-Type")?.includes("application/json")) {
      return;
    }

    const camelCaseJson = await c.res.json();
    const snakeCaseJson = camelToSnake(camelCaseJson);

    c.res = Response.json(snakeCaseJson, c.res);
  });
}
