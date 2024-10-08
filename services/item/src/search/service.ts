import * as itemsRepository from "@/items/repository";

type SearchServiceDto = {
  q: string;
  limit: number;
  cursor?: string;
  threshold?: number;
};

export async function search(dto: SearchServiceDto) {
  return await itemsRepository.search(dto);
}
