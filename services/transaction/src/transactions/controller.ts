import { auth } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import { Hono } from "hono";
import {
  createJsonSchema,
  getAllQuerySchema,
  transitionParamSchema,
} from "./schemas";
import * as transactionsService from "./service";

export const transactionsController = new Hono();

transactionsController.get(
  "/",
  auth(true),
  validator("query", getAllQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const user = c.var.user;

    const result = await transactionsService.getAll({ ...query, user });

    return c.json(result, 200);
  },
);

transactionsController.post(
  "/",
  auth(true),
  validator("json", createJsonSchema),
  async (c) => {
    const json = c.req.valid("json");
    const user = c.var.user;

    const result = await transactionsService.create({ ...json, user });

    return c.json(result, 201);
  },
);

transactionsController.post(
  "/:id/:action",
  auth(true),
  validator("param", transitionParamSchema),
  async (c) => {
    const param = c.req.valid("param");
    const user = c.var.user;

    await transactionsService.transition({ ...param, user });

    return c.body(null, 204);
  },
);
