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
      limit: z.coerce.number().int().positive().default(8),
      cursor: z.string().optional(),
      type: z.enum(["single", "pack"]).optional(),
      status: z.coerce.number().pipe(z.nativeEnum(ItemStatus)).optional(),
      seller_id: z.coerce.number().int().positive().optional(),
    }),
  ),
  async (c) => {
    const query = c.req.valid("query");
    const result = await itemsService.getAllItems(query);
    return c.json(result, 200);
  },
);

const fileSchema = z.custom<File>((data) => {
  return (
    data instanceof File &&
    ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(
      data.type,
    ) &&
    data.size <= 5 * 1024 * 1024
  );
});

itemsController.post(
  "/",
  auth(true),
  validator(
    "form",
    z.object({
      name: z.string().min(1).max(50),
      description: z.string().min(1).max(500),
      price: z.coerce.number().positive(),
      photos: z
        .array(fileSchema)
        .max(5)
        .or(fileSchema.transform((file) => [file]))
        .default([]),
    }),
  ),
  async (c) => {
    const form = c.req.valid("form");
    const result = await itemsService.createItem(form, c.var.user);
    return c.json(result, 201);
  },
);
