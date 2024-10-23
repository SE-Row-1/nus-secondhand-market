"use client";

import { ItemGrid } from "@/components/item";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { ItemStatus, type PaginatedItems } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";

type Props = {
  firstPage: PaginatedItems;
};

export function Marketplace({ firstPage }: Props) {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["items", "marketplace"],
    queryFn: async ({ pageParam: cursor }) => {
      const searchParams = new URLSearchParams({
        status: String(ItemStatus.ForSale),
        limit: "10",
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
      <ItemGrid items={data.pages.flatMap((page) => page.items)} />
      <div ref={bottomRef}></div>
    </>
  );
}
