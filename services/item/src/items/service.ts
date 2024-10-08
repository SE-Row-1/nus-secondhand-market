import {
  ItemStatus,
  ItemType,
  type Account,
  type Item,
  type SingleItem,
} from "@/types";
import { photoManager } from "@/utils/photo-manager";
import { HTTPException } from "hono/http-exception";
import { ObjectId, type Filter } from "mongodb";
import * as itemsRepository from "./repository";

type GetAllItemsServiceDto = {
  type?: ItemType;
  status?: ItemStatus;
  sellerId?: number;
  limit: number;
  cursor?: string;
};

export async function getAllItems(dto: GetAllItemsServiceDto) {
  const filter: Filter<Item> = {
    ...(dto.type ? { type: dto.type } : {}),
    ...(dto.status ? { status: dto.status } : {}),
    ...(dto.sellerId ? { "seller.id": dto.sellerId } : {}),
    ...(dto.cursor ? { _id: { $lt: new ObjectId(dto.cursor) } } : {}),
    deletedAt: null,
  };

  const withIdItems = await itemsRepository.findAll(filter, {
    sort: { _id: -1 },
    limit: dto.limit,
  });

  const nextCursor =
    withIdItems.length < dto.limit
      ? null
      : withIdItems[withIdItems.length - 1]!._id;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const items = withIdItems.map(({ _id, ...item }) => item);

  return { items, nextCursor };
}

type PublishItemServiceDto = {
  name: string;
  description: string;
  price: number;
  photos: File[];
  user: Account;
};

export async function publishItem(dto: PublishItemServiceDto) {
  const photoUrls = await Promise.all(dto.photos.map(photoManager.save));

  const item: SingleItem = {
    id: crypto.randomUUID(),
    type: ItemType.SINGLE,
    name: dto.name,
    description: dto.description,
    price: dto.price,
    photoUrls,
    status: ItemStatus.FOR_SALE,
    seller: {
      id: dto.user.id,
      nickname: dto.user.nickname,
      avatarUrl: dto.user.avatarUrl,
    },
    createdAt: new Date(),
    deletedAt: null,
  };

  await itemsRepository.insertOne(item);

  return item;
}

export async function takeDownItem(id: string, user: Account) {
  const item = await itemsRepository.findOne({ id });

  if (!item) {
    throw new HTTPException(404, { message: "This item does not exist." });
  }

  if (item.seller.id !== user.id) {
    throw new HTTPException(403, {
      message: "You can't take down someone else's items.",
    });
  }

  await itemsRepository.deleteOne({ id });
}
