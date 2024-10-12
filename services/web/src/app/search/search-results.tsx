"use client";

import { SingleItemCard } from "@/components/item/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import type { SingleItem } from "@/types";
import { clientRequester } from "@/utils/requester/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";

export function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const { data, fetchNextPage, hasNextPage, isPending, isFetching } =
    useInfiniteQuery({
      queryKey: ["search", q],
      queryFn: async ({ pageParam }) => {
        const nextSearchParams = new URLSearchParams({ q, limit: "8" });

        if (pageParam.cursor) {
          nextSearchParams.set("cursor", pageParam.cursor);
        }

        if (pageParam.threshold) {
          nextSearchParams.set("threshold", pageParam.threshold.toString());
        }

        return await clientRequester.get<{
          items: SingleItem[];
          next_cursor: string | null;
          next_threshold: number;
        }>(`/items/search?${nextSearchParams.toString()}`);
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
      <ul className="grid min-[480px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-6">
        {data?.pages
          .flatMap((page) => page.items)
          .map((item) => <SingleItemCard key={item.id} item={item} />)}
      </ul>
      <div ref={bottomRef}></div>
      {!q || hasNextPage || (
        <p className="my-8 text-sm text-muted-foreground text-center">
          - That&apos;s all we got for now! -
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
