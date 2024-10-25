import { auth } from "@/middleware/auth";
import { validator } from "@/middleware/validator";
import { Hono } from "hono";
import { getAllQuerySchema } from "./schemas";
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
