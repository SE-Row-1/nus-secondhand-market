import {
  ItemStatus,
  ItemType,
  type Item,
  type ItemPack,
  type Seller,
} from "@/types";
import { itemsCollection } from "@/utils/db";
import { ObjectId, type Document, type WithId } from "mongodb";

type FindManyDto = {
  type: ItemType | undefined;
  status: ItemStatus | undefined;
  sellerId: number | undefined;
  limit: number;
  cursor: string | undefined;
};

export async function findMany(dto: FindManyDto) {
  const withIdItems = await itemsCollection
    .find(
      {
        ...(dto.type && { type: dto.type }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.sellerId && { "seller.id": dto.sellerId }),
        ...(dto.cursor && { _id: { $lt: new ObjectId(dto.cursor) } }),
        deletedAt: null,
      },
      { sort: { _id: -1 }, limit: dto.limit },
    )
    .toArray();

  const nextCursor =
    withIdItems.length < dto.limit
      ? null
      : withIdItems[withIdItems.length - 1]!._id;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const items = withIdItems.map(({ _id, ...item }) => item);

  return { items, nextCursor };
}

export async function findManyByIds(ids: string[]) {
  return await itemsCollection
    .find({ id: { $in: ids }, deletedAt: null })
    .toArray();
}

export async function findOneById(id: string) {
  return await itemsCollection.findOne(
    { id, deletedAt: null },
    { projection: { _id: 0 } },
  );
}

export async function insertOne(item: Item) {
  // `item` is destructured here because MongoDB will try to modify the object.
  return await itemsCollection.insertOne({ ...item });
}

export async function updateOneById(id: string, update: Partial<Item>) {
  return await itemsCollection.findOneAndUpdate(
    { id, deletedAt: null },
    { $set: update },
    { projection: { _id: 0 }, returnDocument: "after" },
  );
}

export async function deleteOneById(id: string) {
  return await itemsCollection.updateOne(
    { id, deletedAt: null },
    { $set: { deletedAt: new Date() } },
  );
}

export async function updateSeller(seller: Seller) {
  return await itemsCollection.updateMany(
    { "seller.id": seller.id },
    {
      $set: {
        "seller.nickname": seller.nickname,
        "seller.avatarUrl": seller.avatarUrl,
      },
    },
  );
}

export async function deleteManyBySellerId(sellerId: number) {
  return await itemsCollection.updateMany(
    { "seller.id": sellerId, deletedAt: null },
    { $set: { deletedAt: new Date() } },
  );
}

type SearchDto = {
  q: string;
  limit: number;
  cursor: string | undefined;
  threshold: number | undefined;
};

export async function search(dto: SearchDto) {
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
