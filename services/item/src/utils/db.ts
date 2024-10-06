import type { Item } from "@/types";
import { MongoClient } from "mongodb";

const client = await MongoClient.connect(process.env.MONGO_URI);

const db = client.db(process.env.MONGO_DB_NAME);

/**
 * The MongoDB collection that stores all items.
 *
 * This is the single source of truth for items across the whole application.
 */
export const itemsCollection = db.collection<Item>("items");
