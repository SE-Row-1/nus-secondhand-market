"use client";

import { ItemGrid } from "@/components/item";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useMarketplace } from "@/query/browser";
import { useRef } from "react";

export function Marketplace() {
  const { data, fetchNextPage, hasNextPage } = useMarketplace();

  const bottomRef = useRef<HTMLDivElement>(null);
  useInfiniteScroll(bottomRef, () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  });

  if (!data) {
    return null;
  }

  return (
    <>
      <ItemGrid items={data.pages.flatMap((page) => page.items)} />
      <div ref={bottomRef}></div>
    </>
  );
}
