"use client";

import { ItemList } from "@/components/item";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { ItemStatus, type PaginatedItems } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";

type Props = {
  firstPage: PaginatedItems;
};

export function Marketplace({ firstPage }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["items"],
    queryFn: async ({ pageParam: cursor }) => {
      const searchParams = new URLSearchParams({
        status: String(ItemStatus.FOR_SALE),
        limit: "8",
        ...(cursor && { cursor }),
      });

      return await clientRequester.get<PaginatedItems>(
        `/items?${searchParams.toString()}`,
      );
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor,
    initialData: {
      pages: [firstPage],
      pageParams: [undefined, firstPage.next_cursor],
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
      <ItemList items={data.pages.flatMap((page) => page.items)} />
      <div ref={bottomRef}></div>
      {hasNextPage || (
        <p className="my-8 text-sm text-muted-foreground text-center">
          - You have come to an end :) -
        </p>
      )}
      {isFetching && (
        <p className="my-8 text-sm text-muted-foreground text-center">
          Loading more for you...
        </p>
      )}
    </>
  );
}
