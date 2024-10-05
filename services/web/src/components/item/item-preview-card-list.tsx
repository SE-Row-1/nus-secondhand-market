"use client";

import type { SingleItem } from "@/types";
import { ClientRequester } from "@/utils/requester/client";
import useSWR from "swr";
import { SingleItemPreviewCard } from "./single-item-preview-card";

type Props = {
  initialItems: SingleItem[];
  initialCount: number;
};

export function ItemPreviewCardList({ initialItems, initialCount }: Props) {
  const { data } = useSWR(
    "/items",
    async () => {
      return await new ClientRequester().get<{
        items: SingleItem[];
        count: number;
      }>("/items");
    },
    {
      fallbackData: { items: initialItems, count: initialCount },
    },
  );

  return (
    <ul className="grid min-[480px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {data.items.map((item) => (
        <SingleItemPreviewCard key={item.id} item={item} />
      ))}
    </ul>
  );
}
