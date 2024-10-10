import type { Item } from "@/types";
import { MongoClient } from "mongodb";

const client = await MongoClient.connect(Bun.env.MONGO_URI);

const db = client.db(Bun.env.MONGO_DB_NAME);

/**
 * The MongoDB collection that stores all items.
 *
 * This is the single source of truth for items.
 */
export const itemsCollection = db.collection<Item>("items");
