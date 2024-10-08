import { validator } from "@/middleware/validator";
import { Hono } from "hono";
import * as v from "valibot";
import * as searchService from "./service";

/**
 * Items searching.
 */
export const searchController = new Hono();

searchController.get(
  "/",
  validator(
    "query",
    v.object({
      q: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
      limit: v.optional(
        v.pipe(
          v.unknown(),
          v.transform(Number),
          v.integer(),
          v.minValue(1),
          v.maxValue(100),
        ),
        8,
      ),
      cursor: v.optional(v.pipe(v.string(), v.regex(/^[0-9a-f]{24}$/))),
      threshold: v.optional(
        v.pipe(v.unknown(), v.transform(Number), v.number(), v.minValue(0)),
      ),
    }),
  ),
  async (c) => {
    const query = c.req.valid("query");
    const result = await searchService.search(query);
    return c.json(result, 200);
  },
);
