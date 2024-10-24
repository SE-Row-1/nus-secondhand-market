"use client";

import { ItemGrid } from "@/components/item";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { clientRequester } from "@/query/requester/client";
import type { PaginatedItems } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";

export function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const { data, fetchNextPage, hasNextPage, isPending } = useInfiniteQuery({
    queryKey: ["search", q],
    queryFn: async ({ pageParam: { cursor, threshold } }) => {
      const searchParams = new URLSearchParams({
        q,
        limit: "10",
        ...(cursor && { cursor }),
        ...(threshold && { threshold: String(threshold) }),
      });

      return await clientRequester.get<
        PaginatedItems & { next_threshold: number }
      >(`/items/search?${searchParams.toString()}`);
    },
    initialPageParam: {} as { cursor?: string | null; threshold?: number },
    getNextPageParam: (lastPage) => {
      const { next_cursor, next_threshold } = lastPage;

      if (next_cursor === null || next_threshold === 0) {
        return null;
      }

      return { cursor: next_cursor, threshold: next_threshold };
    },
    enabled: !!q,
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  useInfiniteScroll(bottomRef, () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  });

  if (!!q && isPending) {
    return (
      <ul className="grid min-[480px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-6">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="aspect-[3/4]" />
        ))}
      </ul>
    );
  }

  return (
    <>
      <ItemGrid items={data?.pages.flatMap((page) => page.items) ?? []} />
      <div ref={bottomRef}></div>
    </>
  );
}
