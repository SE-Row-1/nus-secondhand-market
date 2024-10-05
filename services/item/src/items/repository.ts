import { ItemStatus, type Item, type SingleItem } from "@/types";
import { itemsCollection } from "@/utils/db";

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
  skip: number;
  sort_key: "created_at";
  sort_order: "asc" | "desc";
  type?: "single" | "pack" | undefined;
  status: ItemStatus;
};

async function findAll(dto: FindAllDto) {
  return await itemsCollection
    .find({
      ...(dto.type ? { type: dto.type } : {}),
      status: dto.status,
    })
    .sort({ [dto.sort_key]: dto.sort_order })
    .project<Item>({ _id: 0 })
    .limit(dto.limit)
    .skip(dto.skip)
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
