import { prefetchMarketplace } from "@/prefetchers";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Marketplace } from "./marketplace";

export default async function MarketplacePage() {
  const { data: page, error } = await prefetchMarketplace();

  if (error) {
    redirect(`/error?message=${error.message}`);
  }

  return <Marketplace firstPage={page} />;
}

export const metadata: Metadata = {
  title: "Marketplace | NUS Second-Hand Market",
};
