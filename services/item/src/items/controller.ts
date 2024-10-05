import { auth } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import { ItemStatus } from "@/types";
import { Hono } from "hono";
import { z } from "zod";
import { itemsService } from "./service";

/**
 * Controller layer for items.
 */
export const itemsController = new Hono();

itemsController.get(
  "/",
  validator(
    "query",
    z.object({
      limit: z.coerce.number().int().positive().default(20),
      skip: z.coerce.number().int().nonnegative().default(0),
      sort_key: z.enum(["created_at"]).default("created_at"),
      sort_order: z.enum(["asc", "desc"]).default("desc"),
      type: z.enum(["single", "pack"]).optional(),
      status: z.coerce
        .number()
        .transform((status) => status as ItemStatus)
        .default(ItemStatus.FOR_SALE),
    }),
  ),
  async (c) => {
    const query = c.req.valid("query");
    const result = await itemsService.getAllItems(query);
    return c.json(result, 200);
  },
);

itemsController.post(
  "/",
  auth(true),
  validator(
    "json",
    z.object({
      name: z.string().min(1).max(50),
      description: z.string().min(1).max(500),
      price: z.coerce.number().positive(),
      photo_urls: z.array(z.string().url()).max(5),
    }),
  ),
  async (c) => {
    const dto = c.req.valid("json");
    const item = await itemsService.createItem(dto, c.var.user);
    return c.json(item, 201);
  },
);
