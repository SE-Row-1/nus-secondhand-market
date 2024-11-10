import type { Item } from "@/types";
import { MongoClient } from "mongodb";

const client = await MongoClient.connect(Bun.env.MONGO_URL);
const db = client.db(Bun.env.MONGO_DB_NAME);

export const itemsCollection = db.collection<Item>("items");
