import { ItemStatus, type Account } from "@/types";
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
  skip: number;
  sort_key: "created_at";
  sort_order: "asc" | "desc";
  type?: "single" | "pack" | undefined;
  status: ItemStatus;
};

async function getAllItems(dto: GetAllItemsDto) {
  const [items, count] = await Promise.all([
    itemsRepository.findAll(dto),
    itemsRepository.count(dto),
  ]);

  return { items, count };
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
