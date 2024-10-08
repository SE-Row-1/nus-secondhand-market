import { auth } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import { Hono } from "hono";
import {
  getAllItemsQuerySchema,
  publishItemFormSchema,
  takeDownItemParamSchema,
} from "./schema";
import * as itemsService from "./service";

/**
 * Items CRUD.
 */
export const itemsController = new Hono();

itemsController.get(
  "/",
  validator("query", getAllItemsQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const result = await itemsService.getAllItems(query);
    return c.json(result, 200);
  },
);

itemsController.post(
  "/",
  auth(true),
  validator("form", publishItemFormSchema),
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
  validator("param", takeDownItemParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    await itemsService.takeDownItem(id, c.var.user);
    return c.body(null, 204);
  },
);
