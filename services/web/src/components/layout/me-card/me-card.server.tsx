import { SidebarMenuItem } from "@/components/ui/sidebar";
import { createPrefetcher } from "@/query/server";
import { HydrationBoundary } from "@tanstack/react-query";
import { MeCardClient } from "./me-card.client";

export async function MeCardServer() {
  const prefetcher = createPrefetcher();
  await prefetcher.prefetchMe();

  return (
    <SidebarMenuItem>
      <HydrationBoundary state={prefetcher.dehydrate()}>
        <MeCardClient />
      </HydrationBoundary>
    </SidebarMenuItem>
  );
}
