"use client";

import { StatusBadge } from "@/components/item/status-badge";
import { Button } from "@/components/ui/button";
import { useItem } from "@/hooks/use-item";
import { ItemStatus, ItemType, type DetailedAccount, type Item } from "@/types";
import { CheckCheckIcon, CheckIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ChildrenGrid } from "./children-grid";
import { ContactSellerButton } from "./contact-seller-button";
import { DecomposePackButton } from "./decompose-pack-button";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemLink } from "./edit-item-link";
import { MarkAsSoldButton } from "./mark-as-sold-button";
import { PhotoCarousel } from "./photo-carousel";
import { Seller } from "./seller";

type Props = {
  initialItem: Item<DetailedAccount>;
  identity: "seller" | "buyer" | "passer-by";
  wishlistStatistics: ReactNode;
  wishlistButton: ReactNode;
};

export function ItemDetailsClient({
  initialItem,
  identity,
  wishlistStatistics,
  wishlistButton,
}: Props) {
  const { data: item } = useItem(initialItem.id, initialItem);

  return (
    <div className="w-full max-w-xl m-auto">
      {item.type === ItemType.Single ? (
        <PhotoCarousel photoUrls={item.photo_urls} />
      ) : (
        <ChildrenGrid items={item.children} />
      )}
      <div className="flex justify-between items-center gap-x-8 gap-y-3 flex-wrap mt-12">
        <div className="grow flex items-center gap-3 sm:gap-4">
          <h1 className="shrink-0 font-bold text-xl lg:text-2xl line-clamp-1">
            {item.name}
          </h1>
          <StatusBadge status={item.status} />
        </div>
        <span className="font-medium text-lg lg:text-xl text-primary">
          {item.price} SGD
        </span>
      </div>
      <p className="mt-4 text-muted-foreground">{item.description}</p>
      <div className="mt-6">
        <Seller seller={item.seller} />
      </div>
      <div className="mt-5">{wishlistStatistics}</div>
      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 mt-5">
        {identity === "seller" ? (
          <>
            {item.type === ItemType.Single ? (
              <>
                <EditItemLink itemId={item.id} />
                <DeleteItemButton itemId={item.id} />
              </>
            ) : (
              <DecomposePackButton itemId={item.id} />
            )}
          </>
        ) : (
          <>
            <ContactSellerButton seller={item.seller} itemName={item.name} />
            {item.status === ItemStatus.ForSale ? (
              wishlistButton
            ) : item.status === ItemStatus.Dealt && identity === "buyer" ? (
              <MarkAsSoldButton itemId={item.id} />
            ) : item.status === ItemStatus.Dealt ? (
              <Button variant="outline" disabled>
                <CheckIcon className="size-4 mr-2" />
                Dealt
              </Button>
            ) : (
              <Button variant="outline" disabled>
                <CheckCheckIcon className="size-4 mr-2" />
                Sold
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
