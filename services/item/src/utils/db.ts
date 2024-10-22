import type { Item, Transaction } from "@/types";
import { MongoClient } from "mongodb";

const client = await MongoClient.connect(Bun.env.MONGO_URL);
const db = client.db(Bun.env.MONGO_DB_NAME);

/**
 * Stores all second-hand items.
 */
export const itemsCollection = db.collection<Item>("items");

/**
 * Stores all buyer-seller transactions.
 */
export const transactionsCollection =
  db.collection<Transaction>("transactions");
