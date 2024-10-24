import { createPrefetcher } from "@/query/server";
import type { DetailedAccount } from "@/types";
import { HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Belongings } from "./belongings";
import { ComposePackDialog } from "./compose-pack-dialog";

export default async function BelongingsPage() {
  const prefetcher = createPrefetcher();
  await prefetcher.prefetchMe();
  const me = prefetcher.getData<DetailedAccount>(["auth", "me"]);
  await prefetcher.prefetchBelongings(me?.id ?? 0);

  return (
    <HydrationBoundary state={prefetcher.dehydrate()}>
      <div className="mb-8">
        <ComposePackDialog />
      </div>
      <Belongings />
    </HydrationBoundary>
  );
}

export const metadata: Metadata = {
  title: "My Belongings",
};
