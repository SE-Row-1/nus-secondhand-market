import type { SingleItem } from "@/types";

export type ItemListResponse = {
  items: SingleItem[];
  count: number;
  nextCursor: string;
};
