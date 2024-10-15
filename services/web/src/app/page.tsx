import { PageTitle } from "@/components/framework";
import { PublishItemDialog } from "@/components/item/publish";
import type { PaginatedItems } from "@/types";
import { serverRequester } from "@/utils/requester/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Marketplace } from "./marketplace";

export default async function MarketplacePage() {
  const { data: page, error } = await serverRequester.get<PaginatedItems>(
    "/items?status=0&limit=8",
  );

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
