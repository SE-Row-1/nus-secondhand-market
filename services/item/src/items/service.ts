import { ItemStatus, ItemType, type Account, type SingleItem } from "@/types";
import { photoManager } from "@/utils/photo-manager";
import { createRequester } from "@/utils/requester";
import { HTTPException } from "hono/http-exception";
import { ObjectId } from "mongodb";
import * as itemsRepository from "./repository";

type GetAllServiceDto = {
  type?: ItemType;
  status?: ItemStatus;
  sellerId?: number;
  limit: number;
  cursor?: string;
};

export async function getAll(dto: GetAllServiceDto) {
  const withIdItems = await itemsRepository.find(
    {
      ...(dto.type ? { type: dto.type } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.sellerId ? { "seller.id": dto.sellerId } : {}),
      ...(dto.cursor ? { _id: { $lt: new ObjectId(dto.cursor) } } : {}),
      deletedAt: null,
    },
    {
      sort: { _id: -1 },
      limit: dto.limit,
    },
  );

  const nextCursor =
    withIdItems.length < dto.limit
      ? null
      : withIdItems[withIdItems.length - 1]!._id;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const items = withIdItems.map(({ _id, ...item }) => item);

  return { items, nextCursor };
}

type GetOneServiceDto = {
  id: string;
};

export async function getOne(dto: GetOneServiceDto) {
  const item = await itemsRepository.findOne(
    { id: dto.id, deletedAt: null },
    { projection: { _id: 0 } },
  );

  if (!item) {
    throw new HTTPException(404, { message: "This item does not exist." });
  }

  const seller = await createRequester("account")<Account>(
    `/accounts/${item.seller.id}`,
  );

  return { ...item, seller };
}

type PublishServiceDto = {
  name: string;
  description: string;
  price: number;
  photos: File[];
  user: Account;
};

export async function publish(dto: PublishServiceDto) {
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

type TakeDownServiceDto = {
  id: string;
  user: Account;
};

export async function takeDown(dto: TakeDownServiceDto) {
  const item = await itemsRepository.findOne({ id: dto.id });

  if (!item) {
    throw new HTTPException(404, { message: "This item does not exist." });
  }

  if (item.seller.id !== dto.user.id) {
    throw new HTTPException(403, {
      message: "You can't take down someone else's items.",
    });
  }

  await itemsRepository.deleteOne({ id: dto.id });
}

type SearchServiceDto = {
  q: string;
  limit: number;
  cursor?: string;
  threshold?: number;
};

export async function search(dto: SearchServiceDto) {
  return await itemsRepository.search(dto);
}
