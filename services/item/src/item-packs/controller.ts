import { auth } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import { Hono } from "hono";
import { composeJsonSchema, decomposeParamSchema } from "./schemas";
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
  validator("param", decomposeParamSchema),
  async (c) => {
    const param = c.req.valid("param");
    const user = c.var.user;

    await itemPacksService.decompose({ ...param, user });

    return c.body(null, 204);
  },
);
