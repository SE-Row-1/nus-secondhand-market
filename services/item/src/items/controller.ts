import { auth } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import { Hono } from "hono";
import {
  getAllQuerySchema,
  getOneParamSchema,
  publishFormSchema,
  searchQuerySchema,
  takeDownParamSchema,
} from "./schema";
import * as itemsService from "./service";

/**
 * Items related APIs.
 */
export const itemsController = new Hono();

itemsController.get("/", validator("query", getAllQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const result = await itemsService.getAll(query);
  return c.json(result, 200);
});

itemsController.get(
  "/search",
  validator("query", searchQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const result = await itemsService.search(query);
    return c.json(result, 200);
  },
);

itemsController.get(
  "/:id",
  validator("param", getOneParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const result = await itemsService.getOne({ id });
    return c.json(result, 200);
  },
);

itemsController.post(
  "/",
  auth(true),
  validator("form", publishFormSchema),
  async (c) => {
    const form = c.req.valid("form");
    const result = await itemsService.publish({ ...form, user: c.var.user });
    return c.json(result, 201);
  },
);

itemsController.delete(
  "/:id",
  auth(true),
  validator("param", takeDownParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    await itemsService.takeDown({ id, user: c.var.user });
    return c.body(null, 204);
  },
);
