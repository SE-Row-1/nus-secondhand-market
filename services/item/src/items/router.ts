import { itemsCollection } from "@/utils/db";
import { Hono } from "hono";

export const itemsRouter = new Hono();

itemsRouter.get("/", async (context) => {
  const items = await itemsCollection.find().toArray();
  return context.json(items);
});
