import { ItemStatus, type Account } from "@/types";
import { photoManager } from "@/utils/photo-manager";
import { HTTPException } from "hono/http-exception";
import { ObjectId } from "mongodb";
import { itemsRepository } from "./repository";

/**
 * Service layer for items.
 */
export const itemsService = {
  getAllItems,
  createItem,
  takeDownItem,
};

type GetAllItemsDto = {
  limit: number;
  cursor?: string | undefined;
  type?: "single" | "pack" | undefined;
  status?: ItemStatus | undefined;
  seller_id?: number | undefined;
};

async function getAllItems(dto: GetAllItemsDto) {
  const filter = {
    ...(dto.cursor ? { _id: { $lt: new ObjectId(dto.cursor) } } : {}),
    ...(dto.type ? { type: dto.type } : {}),
    ...(dto.status ? { status: dto.status } : {}),
    ...(dto.seller_id ? { "seller.id": dto.seller_id } : {}),
  };

  const [items, count] = await Promise.all([
    itemsRepository.findAll(filter, { sort: { _id: -1 }, limit: dto.limit }),
    itemsRepository.count(filter),
  ]);

  const nextCursor =
    items.length < dto.limit ? null : items[items.length - 1]!._id;

  const idStrippedItems = items.map((item) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = item;
    return { ...rest };
  });

  return { items: idStrippedItems, count, nextCursor };
}

type CreateItemDto = {
  name: string;
  description: string;
  price: number;
  photos: File[];
};

async function createItem(dto: CreateItemDto, user: Account) {
  const photoUrls = await Promise.all(dto.photos.map(photoManager.save));

  const item = await itemsRepository.insertOne({
    name: dto.name,
    description: dto.description,
    price: dto.price,
    photo_urls: photoUrls,
    seller: {
      id: user.id,
      nickname: user.nickname,
      avatar_url: user.avatar_url,
    },
  });

  return item;
}

async function takeDownItem(id: string, user: Account) {
  const item = await itemsRepository.findOne({ id });
  console.log(id, item);

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
