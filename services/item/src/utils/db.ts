import { MongoClient } from "mongodb";

const client = await MongoClient.connect(process.env.MONGO_DB_URI);

const db = client.db(process.env.MONGO_DB_NAME);

export const itemsCollection = db.collection("items");
