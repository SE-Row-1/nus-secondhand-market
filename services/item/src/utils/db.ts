import type { Item } from "@/types";
import { MongoClient } from "mongodb";

const client = await MongoClient.connect(process.env.MONGO_DB_URI);

const db = client.db(process.env.MONGO_DB_NAME);

export const itemsRepository = db.collection<Item>("items");