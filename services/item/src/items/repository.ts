import { type Item, type ItemPack } from "@/types";
import { itemsCollection } from "@/utils/db";
import type { Document, Filter, FindOptions, WithId } from "mongodb";

export async function find(filter: Filter<Item>, options?: FindOptions<Item>) {
  return await itemsCollection.find(filter, options).toArray();
}

export async function findOne(
  filter: Filter<Item>,
  options?: FindOptions<Item>,
) {
  return await itemsCollection.findOne(filter, options);
}

export async function insertOne(item: Item) {
  // `item` is destructured here because MongoDB will try to modify the object.
  return await itemsCollection.insertOne({ ...item });
}

export async function updateOne(filter: Filter<Item>, update: Partial<Item>) {
  return await itemsCollection.findOneAndUpdate(
    filter,
    { $set: update },
    { projection: { _id: 0 }, returnDocument: "after" },
  );
}

export async function deleteOne(filter: Filter<Item>) {
  return await itemsCollection.updateOne(filter, {
    $set: { deletedAt: new Date() },
  });
}

type SearchRepositoryDto = {
  q: string;
  limit: number;
  cursor?: string;
  threshold?: number;
};

export async function search(dto: SearchRepositoryDto) {
  const pipeline: Document[] = [
    {
      $match: {
        $text: { $search: dto.q },
        deletedAt: null,
      },
    },
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
        createdAt: 1,
        deletedAt: 1,
        score: { $meta: "textScore" },
      },
    },
    {
      $sort: { score: -1 },
    },
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

export async function compose(pack: ItemPack) {
  return await itemsCollection.bulkWrite([
    {
      insertOne: {
        document: { ...pack },
      },
    },
    {
      deleteMany: {
        filter: {
          id: { $in: pack.children.map((child) => child.id) },
        },
      },
    },
  ]);
}

export async function decompose(pack: ItemPack) {
  return await itemsCollection.bulkWrite([
    {
      updateOne: {
        filter: {
          id: pack.id,
        },
        update: {
          $set: {
            deletedAt: new Date(),
          },
        },
      },
    },
    ...pack.children.map((child) => ({
      insertOne: {
        document: child,
      },
    })),
  ]);
}
