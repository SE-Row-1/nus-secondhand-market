import { publishEvent } from "@/events/publish";
import {
  ItemStatus,
  ItemType,
  type Account,
  type Item,
  type Seller,
} from "@/types";
import { createPhotoStorageGateway } from "@/utils/photo-storage-gateway";
import { createRequester } from "@/utils/requester";
import { HTTPException } from "hono/http-exception";
import * as itemsRepository from "./repository";

type GetAllDto = {
  type?: ItemType;
  status?: ItemStatus;
  sellerId?: number;
  limit: number;
  cursor?: string;
};

export async function getAll(dto: GetAllDto) {
  return await itemsRepository.findMany({
    type: dto.type,
    status: dto.status,
    sellerId: dto.sellerId,
    limit: dto.limit,
    cursor: dto.cursor,
  });
}

type GetOneDto = {
  id: string;
};

export async function getOne(dto: GetOneDto) {
  const item = await itemsRepository.findOneById(dto.id);

  if (!item) {
    throw new HTTPException(404, { message: "Item not found" });
  }

  const account = await createRequester("account")<Account>(
    `/accounts/${item.seller.id}`,
  );

  return { ...item, seller: account };
}

type PublishDto = {
  name: string;
  description: string;
  price: number;
  photos: File[];
  user: Seller;
};

export async function publish(dto: PublishDto) {
  const photoStorageGateway = createPhotoStorageGateway();

  const photoUrls = await Promise.all(dto.photos.map(photoStorageGateway.save));

  const item: Item = {
    id: crypto.randomUUID(),
    type: ItemType.Single,
    seller: {
      id: dto.user.id,
      nickname: dto.user.nickname,
      avatarUrl: dto.user.avatarUrl,
    },
    name: dto.name,
    description: dto.description,
    price: dto.price,
    photoUrls,
    status: ItemStatus.ForSale,
    createdAt: new Date(),
    deletedAt: null,
  };

  await itemsRepository.insertOne(item);

  return item;
}

type UpdateDto = {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  addedPhotos: File[];
  removedPhotoUrls: string[];
  user: Seller;
};

export async function update(dto: UpdateDto) {
  const item = await itemsRepository.findOneById(dto.id);

  if (!item) {
    throw new HTTPException(404, { message: "Item not found" });
  }

  if (dto.user.id !== item.seller.id) {
    throw new HTTPException(403, {
      message: "You cannot update someone else's items",
    });
  }

  if (item.type !== ItemType.Single) {
    throw new HTTPException(422, {
      message: "This endpoint only updates single item",
    });
  }

  if (
    item.photoUrls.length +
      dto.addedPhotos.length -
      dto.removedPhotoUrls.length >
    5
  ) {
    throw new HTTPException(400, {
      message: "Only allow up to 5 images",
    });
  }

  for (const removedPhotoUrl of dto.removedPhotoUrls) {
    if (!item.photoUrls.includes(removedPhotoUrl)) {
      throw new HTTPException(400, { message: "Photo to remove not found" });
    }
  }

  const photoStorageGateway = createPhotoStorageGateway();

  await Promise.all(dto.removedPhotoUrls.map(photoStorageGateway.remove));

  const addedPhotoUrls = await Promise.all(
    dto.addedPhotos.map(photoStorageGateway.save),
  );

  const newPhotoUrls = [...item.photoUrls, ...addedPhotoUrls].filter(
    (url) => !dto.removedPhotoUrls.includes(url),
  );

  const newItem = await itemsRepository.updateOneById(dto.id, {
    ...(dto.name && { name: dto.name }),
    ...(dto.description && { description: dto.description }),
    ...(dto.price && { price: dto.price }),
    photoUrls: newPhotoUrls,
  });

  publishEvent("item", "item.updated", newItem!);

  return newItem;
}

type TakeDownDto = {
  id: string;
  user: Seller;
};

export async function takeDown(dto: TakeDownDto) {
  const item = await itemsRepository.findOneById(dto.id);

  if (!item) {
    throw new HTTPException(404, { message: "Item not found" });
  }

  if (item.type !== ItemType.Single) {
    throw new HTTPException(422, {
      message: "This endpoint only takes down single item",
    });
  }

  if (dto.user.id !== item.seller.id) {
    throw new HTTPException(403, {
      message: "You cannot take down someone else's items",
    });
  }

  await itemsRepository.deleteOneById(dto.id);

  publishEvent("item", "item.deleted", dto.id);
}

type SearchServiceDto = {
  q: string;
  limit: number;
  cursor?: string;
  threshold?: number;
};

export async function search(dto: SearchServiceDto) {
  return await itemsRepository.search({
    q: dto.q,
    limit: dto.limit,
    cursor: dto.cursor,
    threshold: dto.threshold,
  });
}
