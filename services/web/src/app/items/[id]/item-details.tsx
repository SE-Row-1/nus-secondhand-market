"use client";

import { StatusBadge } from "@/components/item/status-badge";
import { Button } from "@/components/ui/button";
import { useItem, useLastTransaction, useMe } from "@/query/browser";
import { ItemStatus, ItemType } from "@/types";
import { CheckCheckIcon, CheckIcon, HeartIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChildrenGrid } from "./children-grid";
import { ContactSellerButton } from "./contact-seller-button";
import { DecomposePackButton } from "./decompose-pack-button";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemLink } from "./edit-item-link";
import { MarkAsSoldButton } from "./mark-as-sold-button";
import { PhotoCarousel } from "./photo-carousel";
import { Seller } from "./seller";
import { WishlistButton } from "./wishlist-button";
import { WishlistStatistics } from "./wishlist-statistics";

export function ItemDetails() {
  const { id: itemId } = useParams<{ id: string }>();

  const { data: me } = useMe();

  const { data: item } = useItem(itemId);

  const { data: transaction } = useLastTransaction(itemId);

  const isBuyer = me && me.id === transaction?.buyer.id;
  const isSeller = me && me.id === transaction?.seller.id;
  const isAnonymous = !me;
  const isPasserBy = !isBuyer && !isSeller && !isAnonymous;

  if (!item) {
    return null;
  }

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
      <div className="mt-5">
        <WishlistStatistics />
      </div>
      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 mt-5">
        {isSeller && item.type === ItemType.Single && (
          <>
            <EditItemLink />
            <DeleteItemButton />
          </>
        )}
        {isSeller && item.type === ItemType.Pack && (
          <>
            <DecomposePackButton />
          </>
        )}
        {isBuyer && item.status === ItemStatus.Dealt && (
          <>
            <ContactSellerButton />
            <MarkAsSoldButton />
          </>
        )}
        {isBuyer && item.status === ItemStatus.Sold && (
          <>
            <ContactSellerButton />
            <Button variant="outline" disabled>
              <CheckCheckIcon className="size-4 mr-2" />
              Sold to you
            </Button>
          </>
        )}
        {isPasserBy && item.status === ItemStatus.ForSale && (
          <>
            <ContactSellerButton />
            <WishlistButton />
          </>
        )}
        {isPasserBy && item.status === ItemStatus.Dealt && (
          <>
            <ContactSellerButton />
            <Button variant="outline" disabled>
              <CheckIcon className="size-4 mr-2" />
              Dealt already
            </Button>
          </>
        )}
        {isPasserBy && item.status === ItemStatus.Sold && (
          <>
            <ContactSellerButton />
            <Button variant="outline" disabled>
              <CheckCheckIcon className="size-4 mr-2" />
              Sold already
            </Button>
          </>
        )}
        {isAnonymous && item.status === ItemStatus.ForSale && (
          <>
            <ContactSellerButton />
            <Button asChild>
              <Link href="/login">
                <HeartIcon className="size-4 mr-2" />
                Want it
              </Link>
            </Button>
          </>
        )}
        {isAnonymous && item.status === ItemStatus.Dealt && (
          <>
            <ContactSellerButton />
            <Button variant="outline" disabled>
              <CheckIcon className="size-4 mr-2" />
              Dealt already
            </Button>
          </>
        )}
        {isAnonymous && item.status === ItemStatus.Sold && (
          <>
            <ContactSellerButton />
            <Button variant="outline" disabled>
              <CheckCheckIcon className="size-4 mr-2" />
              Sold already
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
