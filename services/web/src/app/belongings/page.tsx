import { createPrefetcher } from "@/query/server";
import { HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Belongings } from "./belongings";
import { ComposePackDialog } from "./compose-pack-dialog";

export default async function BelongingsPage() {
  const prefetcher = createPrefetcher();

  const me = await prefetcher.prefetchMe();

  if (!me) {
    redirect("/login");
  }

  await prefetcher.prefetchBelongings(me.id);

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
