"use client";

import { ItemGrid } from "@/components/item";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useMe } from "@/query/browser";
import { clientRequester } from "@/query/requester/client";
import type { PaginatedItems } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";

export function Belongings() {
  const { data: me } = useMe();

  const {
    data: belongings,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["items", { seller_id: me?.id, limit: 10 }],
    queryFn: async ({ pageParam: cursor }) => {
      if (!me) {
        return { items: [], next_cursor: null };
      }

      const searchParams = new URLSearchParams({
        seller_id: String(me.id),
        limit: "10",
        ...(cursor && { cursor }),
      });

      return await clientRequester.get<PaginatedItems>(
        `/items?${searchParams.toString()}`,
      );
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor,
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  useInfiniteScroll(bottomRef, () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  });

  if (!me || !belongings) {
    return null;
  }

  return (
    <>
      <ItemGrid items={belongings.pages.flatMap((page) => page.items)} />
      <div ref={bottomRef}></div>
    </>
  );
}
