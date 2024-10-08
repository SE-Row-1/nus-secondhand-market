import { auth } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import { ItemStatus, ItemType } from "@/types";
import { Hono } from "hono";
import * as v from "valibot";
import * as itemsService from "./service";

/**
 * Items CRUD.
 */
export const itemsController = new Hono();

itemsController.get(
  "/",
  validator(
    "query",
    v.object({
      type: v.optional(v.enum(ItemType)),
      status: v.optional(
        v.pipe(v.unknown(), v.transform(Number), v.enum(ItemStatus)),
      ),
      sellerId: v.optional(
        v.pipe(v.unknown(), v.transform(Number), v.integer(), v.minValue(1)),
      ),
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
    }),
  ),
  async (c) => {
    const query = c.req.valid("query");
    const result = await itemsService.getAllItems(query);
    return c.json(result, 200);
  },
);

const fileSchema = v.pipe(
  v.file(),
  v.mimeType(["image/jpeg", "image/png", "image/webp", "image/avif"]),
  v.maxSize(5 * 1024 * 1024),
);

itemsController.post(
  "/",
  auth(true),
  validator(
    "form",
    v.object({
      name: v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
      description: v.pipe(v.string(), v.minLength(1), v.maxLength(500)),
      price: v.pipe(v.unknown(), v.transform(Number), v.minValue(0)),
      photos: v.optional(
        v.union([
          v.pipe(v.array(fileSchema), v.maxLength(5)),
          v.pipe(
            fileSchema,
            v.transform((file) => [file]),
          ),
        ]),
        [],
      ),
    }),
  ),
  async (c) => {
    const form = c.req.valid("form");
    const result = await itemsService.publishItem({
      ...form,
      user: c.var.user,
    });
    return c.json(result, 201);
  },
);

itemsController.delete(
  "/:id",
  auth(true),
  validator(
    "param",
    v.object({
      id: v.pipe(v.string(), v.uuid()),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    await itemsService.takeDownItem(id, c.var.user);
    return c.body(null, 204);
  },
);
