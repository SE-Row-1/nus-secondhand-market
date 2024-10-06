import { ItemStatus, type SingleItem } from "@/types";
import { itemsCollection } from "@/utils/db";
import { ObjectId } from "mongodb";

/**
 * Data access layer for items.
 */
export const itemsRepository = {
  findAll,
  count,
  insertOne,
};

type FindAllDto = {
  limit: number;
  cursor?: string | undefined;
  type?: "single" | "pack" | undefined;
  status: ItemStatus;
};

async function findAll(dto: FindAllDto) {
  return await itemsCollection
    .find(
      {
        ...(dto.type ? { type: dto.type } : {}),
        status: dto.status,
        ...(dto.cursor ? { _id: { $lt: new ObjectId(dto.cursor) } } : {}),
      },
      {
        sort: { _id: -1 },
        limit: dto.limit,
      },
    )
    .toArray();
}

type CountDto = {
  type?: "single" | "pack" | undefined;
  status: ItemStatus;
};

async function count(dto: CountDto) {
  return await itemsCollection.countDocuments({
    ...(dto.type ? { type: dto.type } : {}),
    status: dto.status,
  });
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
