import { PublishItemDialog } from "@/components/item/publish";
import { PageTitle } from "@/components/layout";
import { prefetchMarketplace } from "@/prefetchers";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Marketplace } from "./marketplace";

export default async function MarketplacePage() {
  const { data: page, error } = await prefetchMarketplace();

  if (error) {
    redirect(`/error?message=${error.message}`);
  }

  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <PageTitle
          title="Marketplace"
          description="We found something you might be interested in"
        />
        <PublishItemDialog />
      </div>
      <Marketplace firstPage={page} />
    </>
  );
}

export const metadata: Metadata = {
  title: "Marketplace | NUS Second-Hand Market",
};
