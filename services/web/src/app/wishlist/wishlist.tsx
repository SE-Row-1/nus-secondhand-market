"use client";

import { ItemGrid } from "@/components/item";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useMe, useWishlist } from "@/query/browser";
import { useRef } from "react";

export function WishList() {
  const { data: me } = useMe();
  const {
    data: wishlist,
    fetchNextPage,
    hasNextPage,
  } = useWishlist(me?.id ?? 0);

  const bottomRef = useRef<HTMLDivElement>(null);
  useInfiniteScroll(bottomRef, () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  });

  return (
    <>
      <ItemGrid items={wishlist?.pages.flatMap((page) => page.items) ?? []} />
      <div ref={bottomRef}></div>
    </>
  );
}
