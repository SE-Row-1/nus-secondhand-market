import { itemsRepository } from "@/utils/db";
import { Hono } from "hono";

export const itemsController = new Hono();

itemsController.get("/", async (context) => {
  const items = await itemsRepository.find().toArray();
  return context.json(items);
});
