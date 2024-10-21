import type { Item, Transaction } from "@/types";
import { MongoClient } from "mongodb";

const client = await MongoClient.connect(Bun.env.MONGO_URL);
const db = client.db(Bun.env.MONGO_DB_NAME);

/**
 * The MongoDB collection that stores all items.
 *
 * This is the single source of truth for items across all microservices.
 */
export const itemsCollection = db.collection<Item>("items");

/**
 * Host all buyer-seller transactions.
 */
export const transactionsCollection =
  db.collection<Transaction>("transactions");
