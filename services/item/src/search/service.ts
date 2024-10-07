import { itemsRepository } from "@/items/repository";

type SearchDto = {
  q: string;
  limit: number;
  cursor?: string | undefined;
  threshold?: number | undefined;
};

export async function search(dto: SearchDto) {
  return await itemsRepository.search(dto);
}
