import { validator } from "@/middleware/validator";
import { Hono } from "hono";
import { z } from "zod";
import * as searchService from "./service";

export const searchController = new Hono();

searchController.get(
  "/",
  validator(
    "query",
    z.object({
      q: z.string().min(1).max(100),
      limit: z.coerce.number().int().positive().default(8),
      cursor: z.string().optional(),
      threshold: z.coerce.number().optional(),
    }),
  ),
  async (c) => {
    const query = c.req.valid("query");
    const result = await searchService.search(query);
    return c.json(result, 200);
  },
);
