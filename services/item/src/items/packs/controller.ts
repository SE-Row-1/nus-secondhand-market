import { auth } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import { Hono } from "hono";
import { composeJsonSchema, deleteParamSchema } from "./schemas";
import * as itemPacksService from "./service";

export const itemPacksController = new Hono();

itemPacksController.post(
  "/",
  auth(true),
  validator("json", composeJsonSchema),
  async (c) => {
    const json = c.req.valid("json");
    const user = c.var.user;
    const result = await itemPacksService.compose({ ...json, user });
    return c.json(result, 201);
  },
);

itemPacksController.delete(
  "/:id",
  auth(true),
  validator("param", deleteParamSchema),
  async (c) => {
    const params = c.req.valid("param");
    const user = c.var.user;
    await itemPacksService.decompose({ ...params, user });
    return c.body(null, 204);
  },
);
