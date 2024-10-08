import { auth } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import { ItemStatus, ItemType } from "@/types";
import { Hono } from "hono";
import { z } from "zod";
import * as itemsService from "./service";

/**
 * Items CRUD.
 */
export const itemsController = new Hono();

itemsController.get(
  "/",
  validator(
    "query",
    z.object({
      type: z.nativeEnum(ItemType).optional(),
      status: z.coerce.number().pipe(z.nativeEnum(ItemStatus)).optional(),
      sellerId: z.coerce.number().int().positive().optional(),
      limit: z.coerce.number().int().positive().max(100).default(8),
      cursor: z.string().optional(),
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
    const seller = c.var.user;
    const result = await itemsService.publishItem({ ...form, seller });
    return c.json(result, 201);
  },
);

itemsController.delete(
  "/:id",
  auth(true),
  validator(
    "param",
    z.object({
      id: z.string().uuid(),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    await itemsService.takeDownItem(id, c.var.user);
    return c.body(null, 204);
  },
);
