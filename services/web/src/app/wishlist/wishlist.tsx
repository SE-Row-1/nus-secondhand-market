"use client";

import { ItemGrid } from "@/components/item";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { clientRequester } from "@/query/requester/client";
import type { DetailedAccount, PaginatedItems } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";

type Props = {
  firstPage: PaginatedItems;
  me: DetailedAccount;
};

export function WishList({ firstPage, me }: Props) {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["wishlist"],
    queryFn: async ({ pageParam: cursor }) => {
      const searchParams = new URLSearchParams({
        limit: "10",
        ...(cursor && { cursor }),
      });

      return await clientRequester.get<PaginatedItems>(
        `/wishlists/${me.id}?${searchParams.toString()}`,
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
