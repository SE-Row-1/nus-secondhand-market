"use client";

import type { SingleItem } from "@/types";
import { ClientRequester } from "@/utils/requester/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SingleItemPreviewCard } from "./single-item-preview-card";

type Props = {
  initialData: {
    items: SingleItem[];
    count: number;
    nextCursor: string;
  };
};

export function ItemPreviewCardList({ initialData }: Props) {
  const { data } = useInfiniteQuery({
    queryKey: ["items"],
    queryFn: ({ pageParam: cursor }) => {
      const searchParams = new URLSearchParams();
      searchParams.set("limit", "8");
      if (cursor) {
        searchParams.set("cursor", cursor);
      }

      return new ClientRequester().get<{
        items: SingleItem[];
        count: number;
        nextCursor: string;
      }>(`/items?${searchParams.toString()}`);
    },
    initialPageParam: initialData.nextCursor,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: {
      pages: [initialData],
      pageParams: [initialData.nextCursor],
    },
  });

  return (
    <ul className="grid min-[480px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {data?.pages
        .flatMap((page) => page.items)
        .map((item) => <SingleItemPreviewCard key={item.id} item={item} />)}
    </ul>
  );
}
