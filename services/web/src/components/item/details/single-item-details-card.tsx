"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useItem } from "@/hooks/use-item";
import {
  ItemStatus,
  type DetailedAccount,
  type SingleItem,
  type WishlistStatistics,
} from "@/types";
import { EditIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "../card/status-badge";
import { FromNow } from "../from-now";
import { AddToWishListButton } from "./add-to-wishlist-button";
import { DeleteItemDialog } from "./delete-item-dialog";
import { PhotoCarousel } from "./photo-carousel";
import {
  UpdateStatusAction,
  UpdateStatusDropdownMenu,
} from "./update-status-dropdown-menu";

type Props = {
  initialItem: SingleItem<DetailedAccount>;
  wishlistStatistics: WishlistStatistics;
  me: DetailedAccount | null;
};

export function SingleItemDetails({
  initialItem,
  wishlistStatistics,
  me,
}: Props) {
  const { data: item } = useItem(initialItem.id, initialItem);

  return (
    <div>
      <div className="max-w-xl mx-auto">
        <PhotoCarousel photoUrls={item.photo_urls} />
      </div>
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center gap-x-8 gap-y-3 flex-wrap pt-12">
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
        <p className="pt-4 text-muted-foreground">{item.description}</p>
        <div className="pt-6">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage
                src={item.seller.avatar_url ?? undefined}
                alt="Seller's avatar"
              />
              <AvatarFallback>
                {item.seller.nickname ?? "Seller " + item.seller.id}
              </AvatarFallback>
            </Avatar>
            <span>{item.seller.nickname ?? "Seller " + item.seller.id}</span>
            <span className="text-muted-foreground">
              published at&nbsp;
              <FromNow date={item.created_at} />
            </span>
          </div>
        </div>
        {wishlistStatistics.count >= 3 ? (
          <p className="px-3 sm:px-4 py-2 sm:py-3 border rounded-md mt-5">
            🔥 {wishlistStatistics.count} people want this item.
          </p>
        ) : wishlistStatistics.last_wanted_at ? (
          <p className="px-3 sm:px-4 py-2 sm:py-3 border rounded-md mt-5">
            🔥 Someone wanted it&nbsp;
            <FromNow date={wishlistStatistics.last_wanted_at} />.
          </p>
        ) : null}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 pt-5">
          {me?.id === item.seller.id ? (
            <>
              {item.status === ItemStatus.FOR_SALE ? (
                <UpdateStatusDropdownMenu>
                  <UpdateStatusAction itemId={item.id} to={ItemStatus.DEALT} />
                </UpdateStatusDropdownMenu>
              ) : item.status === ItemStatus.DEALT ? (
                <UpdateStatusDropdownMenu>
                  <UpdateStatusAction
                    itemId={item.id}
                    to={ItemStatus.FOR_SALE}
                  />
                  <UpdateStatusAction itemId={item.id} to={ItemStatus.SOLD} />
                </UpdateStatusDropdownMenu>
              ) : null}
              <Button variant="secondary" asChild>
                <Link href={`/items/${item.id}/edit`}>
                  <EditIcon className="size-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <DeleteItemDialog item={item} />
            </>
          ) : (
            <>
              <AddToWishListButton item={item} initialIsInWishlist={false} />
              <div className="space-y-1">
                <Button disabled={!item.seller.phone_number} className="w-full">
                  <MailIcon className="size-4 mr-2" />
                  Contact seller
                </Button>
                {item.seller.phone_number || (
                  <p className="text-xs text-muted-foreground text-center text-balance">
                    This seller has not yet provided his contact number
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
