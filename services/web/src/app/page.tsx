import { ItemPreviewCardList } from "@/components/item/item-preview-card-list";
import type { SingleItem } from "@/types";
import { ServerRequester } from "@/utils/requester/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace | NUS Second-Hand Market",
};

export default async function Home() {
  const { items, count } = await new ServerRequester().get<{
    items: SingleItem[];
    count: number;
  }>("/items");

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <div className="space-y-4 mt-4 md:mt-8 mb-8">
        <h1 className="font-bold text-3xl">Marketplace</h1>
        <p className="text-muted-foreground">
          We found something you might be interested in!
        </p>
      </div>
      <ItemPreviewCardList initialItems={items} initialCount={count} />
    </div>
  );
}
