"use client";

import { ItemGrid } from "@/components/item";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useBelongings, useMe } from "@/query/browser";
import { useRef } from "react";

export function Belongings() {
  const { data: me } = useMe();

  const {
    data: belongings,
    fetchNextPage,
    hasNextPage,
  } = useBelongings(me?.id ?? 0);

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
