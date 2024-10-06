"use client";

import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { ItemStatus, type SingleItem } from "@/types";
import { ClientRequester } from "@/utils/requester/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { SingleItemPreviewCard } from "./single-item-preview-card";

type Props = {
  initialData: {
    items: SingleItem[];
    count: number;
    nextCursor: string;
  };
};

export function ItemPreviewCardList({ initialData }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["items"],
    queryFn: ({ pageParam: cursor }) => {
      const searchParams = new URLSearchParams();
      searchParams.set("limit", "8");
      searchParams.set("status", String(ItemStatus.FOR_SALE));
      if (cursor) {
        searchParams.set("cursor", cursor);
      }

      return new ClientRequester().get<{
        items: SingleItem[];
        count: number;
        nextCursor: string;
      }>(`/items?${searchParams.toString()}`);
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: {
      pages: [initialData],
      pageParams: [undefined, initialData.nextCursor],
    },
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  useInfiniteScroll(bottomRef, () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  });

  return (
    <>
      <ul className="grid min-[480px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {data?.pages
          .flatMap((page) => page.items)
          .map((item) => <SingleItemPreviewCard key={item.id} item={item} />)}
      </ul>
      <div ref={bottomRef}></div>
      {hasNextPage || (
        <p className="my-8 text-sm text-muted-foreground text-center">
          - That&apos;s all we got for now! -
        </p>
      )}
      {isFetching && (
        <p className="my-8 text-sm text-muted-foreground text-center">
          Loading more items...
        </p>
      )}
    </>
  );
}
