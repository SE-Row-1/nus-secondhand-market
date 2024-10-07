import { ItemStatus, type Item, type SingleItem } from "@/types";
import { itemsCollection } from "@/utils/db";
import {
  UUID,
  type Document,
  type Filter,
  type FindOptions,
  type WithId,
} from "mongodb";

/**
 * Data access layer for items.
 */
export const itemsRepository = {
  findAll,
  findOne,
  count,
  insertOne,
  deleteOne,
  search,
};

async function findAll(filter: Filter<Item>, options?: FindOptions<Item>) {
  return await itemsCollection.find(filter, options).toArray();
}

async function findOne(filter: Filter<Item>, options?: FindOptions<Item>) {
  return await itemsCollection.findOne(filter, options);
}

async function count(filter: Filter<Item>) {
  return await itemsCollection.countDocuments(filter);
}

type InsertOneDto = {
  name: string;
  description: string;
  price: number;
  photoUrls: string[];
  seller: {
    id: number;
    nickname: string | null;
    avatarUrl: string | null;
  };
};

async function insertOne(dto: InsertOneDto) {
  const { insertedId } = await itemsCollection.insertOne({
    ...dto,
    id: new UUID().toString(),
    type: "single",
    status: ItemStatus.FOR_SALE,
    createdAt: new Date(),
    deletedAt: null,
  });

  const item = await itemsCollection.findOne<SingleItem>(
    { _id: insertedId },
    { projection: { _id: 0 } },
  );

  return item;
}

async function deleteOne(filter: Filter<Item>) {
  await itemsCollection.updateOne(filter, {
    $set: { deletedAt: new Date() },
  });
}

type SearchDto = {
  q: string;
  limit: number;
  cursor?: string | undefined;
  threshold?: number | undefined;
};

async function search(dto: SearchDto) {
  const pipeline: Document[] = [
    { $match: { $text: { $search: dto.q } } },
    {
      $project: {
        id: 1,
        type: 1,
        name: 1,
        description: 1,
        price: 1,
        photoUrls: 1,
        status: 1,
        seller: 1,
        created_at: 1,
        deleted_at: 1,
        score: { $meta: "textScore" },
      },
    },
    { $sort: { score: -1 } },
  ];

  if (dto.cursor && dto.threshold) {
    pipeline.push({
      $match: {
        $or: [
          { score: { $lt: dto.threshold } },
          { score: { $eq: dto.threshold }, _id: { $gt: dto.cursor } },
        ],
      },
    });
  }

  pipeline.push({ $limit: dto.limit });

  const withIdItems = await itemsCollection
    .aggregate<WithId<Item & { score: number }>>(pipeline)
    .toArray();

  const nextThreshold =
    withIdItems.length < dto.limit
      ? 0
      : withIdItems[withIdItems.length - 1]!.score;

  const nextCursor =
    withIdItems.length < dto.limit
      ? null
      : withIdItems[withIdItems.length - 1]!._id;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const items = withIdItems.map(({ _id, score, ...item }) => item);

  return { items, nextThreshold, nextCursor };
}
