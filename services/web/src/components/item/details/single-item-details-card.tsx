import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { DetailedAccount, SingleItem } from "@/types";
import { fromNow } from "@/utils/datetime";
import { EditIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { ItemStatusBadge } from "../card/item-status-badge";
import { AddToWishListButton } from "./add-to-wishlist-button";
import { DeleteItemDialog } from "./delete-item-dialog";
import { PhotoCarousel } from "./photo-carousel";

type Props = {
  item: SingleItem<DetailedAccount>;
  me: DetailedAccount | null;
};

export function SingleItemDetailsCard({ item, me }: Props) {
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
            <ItemStatusBadge status={item.status} />
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
              <time dateTime={item.created_at}>{fromNow(item.created_at)}</time>
            </span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 pt-6">
          {me?.id === item.seller.id ? (
            <>
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
