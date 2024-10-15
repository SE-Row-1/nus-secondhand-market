"use client";

import { ItemList } from "@/components/item";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { ItemStatus } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import type { ResPage } from "./types";

type Props = {
  firstPage: ResPage;
};

export function MarketplaceList({ firstPage }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["items"],
    queryFn: async ({ pageParam: cursor }) => {
      const searchParams = new URLSearchParams({
        limit: "8",
        status: String(ItemStatus.FOR_SALE),
        ...(cursor && { cursor }),
      });

      return await clientRequester.get<ResPage>(
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
          - These are all we&apos;ve got for now -
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
