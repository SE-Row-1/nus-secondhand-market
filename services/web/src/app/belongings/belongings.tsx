"use client";

import { ItemGrid } from "@/components/item";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import type { DetailedAccount, PaginatedItems } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";

type Props = {
  firstPage: PaginatedItems;
  me: DetailedAccount;
};

export function Belongings({ firstPage, me }: Props) {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["items", "belongings"],
    queryFn: async ({ pageParam: cursor }) => {
      const searchParams = new URLSearchParams({
        seller_id: String(me.id),
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
