import { ItemStatus, ItemType, type Account, type SingleItem } from "@/types";
import { publishItemEvent } from "@/utils/mq";
import { photoManager } from "@/utils/photo-manager";
import { createRequester } from "@/utils/requester";
import { HTTPException } from "hono/http-exception";
import { ObjectId } from "mongodb";
import * as itemsRepository from "./repository";
import { StatefulItem } from "./states";

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

type UpdateServiceDto = {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  addedPhotos: File[];
  removedPhotoUrls: string[];
  user: Account;
};

export async function update(dto: UpdateServiceDto) {
  const item = await itemsRepository.findOne({ id: dto.id, deletedAt: null });

  if (!item) {
    throw new HTTPException(404, { message: "This item does not exist." });
  }

  if (item.seller.id !== dto.user.id) {
    throw new HTTPException(403, {
      message: "You can't update someone else's items.",
    });
  }

  if (item.type !== ItemType.SINGLE) {
    throw new HTTPException(422, {
      message: "This endpoint only updates single item.",
    });
  }

  if (
    item.photoUrls.length +
      dto.addedPhotos.length -
      dto.removedPhotoUrls.length >
    5
  ) {
    throw new HTTPException(400, { message: "Only allow up to 5 photos." });
  }

  for (const removedPhotoUrl of dto.removedPhotoUrls) {
    if (!item.photoUrls.includes(removedPhotoUrl)) {
      throw new HTTPException(400, {
        message: "The photo you want to remove does not exist.",
      });
    }
  }

  await Promise.all(dto.removedPhotoUrls.map(photoManager.remove));

  const addedPhotoUrls = await Promise.all(
    dto.addedPhotos.map(photoManager.save),
  );

  const newPhotoUrls = [...item.photoUrls, ...addedPhotoUrls].filter(
    (url) => !dto.removedPhotoUrls.includes(url),
  );

  const newItem = await itemsRepository.updateOne(
    { id: dto.id },
    {
      ...(dto.name ? { name: dto.name } : {}),
      ...(dto.description ? { description: dto.description } : {}),
      ...(dto.price ? { price: dto.price } : {}),
      photoUrls: newPhotoUrls,
    },
  );

  publishItemEvent("updated", newItem!);

  return newItem;
}

type UpdateStatusServiceDto = {
  id: string;
  status: ItemStatus;
  user: Account;
};

export async function updateStatus(dto: UpdateStatusServiceDto) {
  const item = await itemsRepository.findOne({ id: dto.id, deletedAt: null });

  if (!item) {
    throw new HTTPException(404, { message: "This item does not exist." });
  }

  const statefulItem = new StatefulItem(item);
  statefulItem.transitionTo(dto.status, dto.user);
  const newStatefulItem = statefulItem.getRepresentation();

  const newItem = await itemsRepository.updateOne(
    { id: dto.id },
    { status: newStatefulItem.status },
  );

  publishItemEvent("updated", newItem!);

  return newItem;
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

  publishItemEvent("deleted", dto.id);
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
