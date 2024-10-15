import type { Item } from "@/types";

export type ResPage = {
  items: Item[];
  next_cursor: string | null;
  next_threshold: number;
};
