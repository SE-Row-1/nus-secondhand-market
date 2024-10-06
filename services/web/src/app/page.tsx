import { ItemCardList } from "@/components/item";
import { PublishItem } from "@/components/item/publish-item";
import { ItemStatus } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace | NUS Second-Hand Market",
};

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      <div className="flex justify-between items-center flex-wrap gap-4 mt-4 md:mt-8 mb-8">
        <div className="space-y-4">
          <h1 className="font-bold text-3xl">Marketplace</h1>
          <p className="text-muted-foreground">
            We found something you might be interested in!
          </p>
        </div>
        <PublishItem />
      </div>
      <ItemCardList status={ItemStatus.FOR_SALE} />
    </div>
  );
}
