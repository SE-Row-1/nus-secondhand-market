import { itemsCollection } from "@/utils/db";
import { Hono } from "hono";

export const itemsController = new Hono();

itemsController.get("/", async (context) => {
  const items = await itemsCollection.find().toArray();
  return context.json(items);
});
