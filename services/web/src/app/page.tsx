import { ItemCardList } from "@/components/item";
import { PublishItemDialog } from "@/components/item/publish";
import { ItemStatus, ItemType } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace | NUS Second-Hand Market",
};

export default function Home() {
  return (
    <div>
      <div className="flex justify-between items-center flex-wrap gap-4 mt-4 md:mt-8 mb-8">
        <div className="space-y-4">
          <h1 className="font-bold text-3xl">Marketplace</h1>
          <p className="text-muted-foreground">
            We found something you might be interested in!
          </p>
        </div>
        <PublishItemDialog />
      </div>
      <ItemCardList type={ItemType.SINGLE} status={ItemStatus.FOR_SALE} />
    </div>
  );
}
