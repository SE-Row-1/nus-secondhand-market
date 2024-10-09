import { auth } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import { Hono } from "hono";
import {
  getAllItemsQuerySchema,
  publishItemFormSchema,
  searchItemQuerySchema,
  takeDownItemParamSchema,
} from "./schema";
import * as itemsService from "./service";

/**
 * Items related APIs.
 */
export const itemsController = new Hono();

itemsController.get(
  "/",
  validator("query", getAllItemsQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const result = await itemsService.getAll(query);
    return c.json(result, 200);
  },
);

itemsController.post(
  "/",
  auth(true),
  validator("form", publishItemFormSchema),
  async (c) => {
    const form = c.req.valid("form");
    const result = await itemsService.publish({ ...form, user: c.var.user });
    return c.json(result, 201);
  },
);

itemsController.delete(
  "/:id",
  auth(true),
  validator("param", takeDownItemParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    await itemsService.takeDown({ id, user: c.var.user });
    return c.body(null, 204);
  },
);

itemsController.get(
  "/search",
  validator("query", searchItemQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const result = await itemsService.search(query);
    return c.json(result, 200);
  },
);
