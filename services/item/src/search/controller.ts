import { validator } from "@/middleware/validator";
import { Hono } from "hono";
import { searchQuerySchema } from "./schema";
import * as searchService from "./service";

/**
 * Items searching.
 */
export const searchController = new Hono();

searchController.get("/", validator("query", searchQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const result = await searchService.search(query);
  return c.json(result, 200);
});
