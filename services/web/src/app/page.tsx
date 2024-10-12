import { PageTitle } from "@/components/framework";
import { ItemCardList } from "@/components/item";
import { PublishItemDialog } from "@/components/item/publish";
import { ItemStatus, ItemType } from "@/types";
import type { Metadata } from "next";

export default function Home() {
  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <PageTitle
          title="Marketplace"
          description="We found something you might be interested in"
        />
        <PublishItemDialog />
      </div>
      <ItemCardList type={ItemType.SINGLE} status={ItemStatus.FOR_SALE} />
    </>
  );
}

export const metadata: Metadata = {
  title: "Marketplace | NUS Second-Hand Market",
};
