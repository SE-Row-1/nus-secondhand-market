import { type Account } from "@/types";
import { itemsRepository } from "./repository";

export const itemsService = {
  getAllItems,
  createItem,
};

type GetAllItemsDto = {
  limit: number;
  skip: number;
};

async function getAllItems(dto: GetAllItemsDto) {
  const [items, total] = await Promise.all([
    itemsRepository.findAll(dto),
    itemsRepository.count(),
  ]);

  return [items, total] as const;
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
