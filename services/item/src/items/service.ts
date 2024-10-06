import { ItemStatus, type Account } from "@/types";
import { ObjectId } from "mongodb";
import { itemsRepository } from "./repository";

/**
 * Service layer for items.
 */
export const itemsService = {
  getAllItems,
  createItem,
};

type GetAllItemsDto = {
  limit: number;
  cursor?: string | undefined;
  type?: "single" | "pack" | undefined;
  status?: ItemStatus | undefined;
};

async function getAllItems(dto: GetAllItemsDto) {
  const filter = {
    ...(dto.cursor ? { _id: { $lt: new ObjectId(dto.cursor) } } : {}),
    ...(dto.type ? { type: dto.type } : {}),
    ...(dto.status ? { status: dto.status } : {}),
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
  photo_urls: string[];
};

async function createItem(dto: CreateItemDto, user: Account) {
  const item = await itemsRepository.insertOne({
    ...dto,
    seller: {
      id: user.id,
      nickname: user.nickname,
      avatar_url: user.avatar_url,
    },
  });

  return item;
}
