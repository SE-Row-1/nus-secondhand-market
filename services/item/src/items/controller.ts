import { auth } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import { Hono } from "hono";
import {
  getAllQuerySchema,
  getOneParamSchema,
  publishFormSchema,
  searchQuerySchema,
  takeDownParamSchema,
  updateFormSchema,
  updateParamSchema,
} from "./schemas";
import * as itemsService from "./service";

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
    const param = c.req.valid("param");

    const result = await itemsService.getOne(param);

    return c.json(result, 200);
  },
);

itemsController.post(
  "/",
  auth(true),
  validator("form", publishFormSchema),
  async (c) => {
    const form = c.req.valid("form");
    const user = c.var.user;

    const result = await itemsService.publish({ ...form, user });

    return c.json(result, 201);
  },
);

itemsController.patch(
  "/:id",
  auth(true),
  validator("param", updateParamSchema),
  validator("form", updateFormSchema),
  async (c) => {
    const param = c.req.valid("param");
    const form = c.req.valid("form");
    const user = c.var.user;

    const result = await itemsService.update({ ...param, ...form, user });

    return c.json(result, 200);
  },
);

itemsController.delete(
  "/:id",
  auth(true),
  validator("param", takeDownParamSchema),
  async (c) => {
    const param = c.req.valid("param");
    const user = c.var.user;

    await itemsService.takeDown({ ...param, user });

    return c.body(null, 204);
  },
);
