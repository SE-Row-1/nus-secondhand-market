import { createPrefetcher } from "@/query/server";
import { HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Marketplace } from "./marketplace";

export default async function MarketplacePage() {
  const prefetcher = createPrefetcher();
  await prefetcher.prefetchMarketplace();

  return (
    <HydrationBoundary state={prefetcher.dehydrate()}>
      <Marketplace />
    </HydrationBoundary>
  );
}

export const metadata: Metadata = {
  title: "Marketplace | NUS Second-Hand Market",
};
