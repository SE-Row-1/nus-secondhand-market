import { ItemStatus, type Item, type SingleItem } from "@/types";
import { itemsCollection } from "@/utils/db";
import type { Filter, FindOptions } from "mongodb";

/**
 * Data access layer for items.
 */
export const itemsRepository = {
  findAll,
  count,
  insertOne,
};

async function findAll(filter: Filter<Item>, options: FindOptions<Item>) {
  return await itemsCollection.find(filter, options).toArray();
}

async function count(filter: Filter<Item>) {
  return await itemsCollection.countDocuments(filter);
}

type InsertOneDto = {
  name: string;
  description: string;
  price: number;
  photo_urls: string[];
  seller: {
    id: number;
    nickname: string | null;
    avatar_url: string | null;
  };
};

async function insertOne(dto: InsertOneDto) {
  const { insertedId } = await itemsCollection.insertOne({
    ...dto,
    id: crypto.randomUUID(),
    type: "single",
    status: ItemStatus.FOR_SALE,
    created_at: new Date().toISOString(),
    deleted_at: null,
  });

  const item = await itemsCollection.findOne<SingleItem>(
    { _id: insertedId },
    { projection: { _id: 0 } },
  );

  return item;
}
