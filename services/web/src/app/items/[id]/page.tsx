import { StatusBadge } from "@/components/item/status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import {
  prefetchItem,
  prefetchItemTransaction,
  prefetchMe,
} from "@/prefetchers";
import { ItemStatus, ItemType } from "@/types";
import { CheckCheckIcon, CheckIcon } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { ChildrenGrid } from "./children-grid";
import { ContactSellerButton } from "./contact-seller-button";
import { DecomposePackButton } from "./decompose-pack-button";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemLink } from "./edit-item-link";
import { MarkAsSoldButton } from "./mark-as-sold-button";
import { PhotoCarousel } from "./photo-carousel";
import { Seller } from "./seller";
import { WishlistButtonServer } from "./wishlist-button.server";
import { WishlistStatisticsServer } from "./wishlist-statistics.server";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params: { id } }: Props) {
  const [
    { data: item, error: itemError },
    { data: me, error: meError },
    { data: itemTransaction },
  ] = await Promise.all([
    prefetchItem(id),
    prefetchMe(),
    prefetchItemTransaction(id),
  ]);

  if (itemError && itemError.status === 404) {
    notFound();
  }

  if (itemError) {
    redirect(`/error?message=${itemError.message}`);
  }

  if (meError && meError.status !== 401) {
    redirect(`/error?message=${meError.message}`);
  }

  const isSeller = me?.id === item?.seller.id;
  const isBuyer = me?.id === itemTransaction?.[0]?.buyer.id;

  return (
    <div className="w-full max-w-xl m-auto">
      {item.type === ItemType.SINGLE ? (
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
        <WishlistStatisticsServer itemId={id} />
      </div>
      <div
        className={cn(
          "grid sm:grid-cols-2 gap-x-4 gap-y-2 mt-5",
          me?.id === item.seller.id &&
            item.type === ItemType.SINGLE &&
            "lg:grid-cols-3",
        )}
      >
        {isSeller ? (
          <>
            {item.type === ItemType.SINGLE ? (
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
            {item.status === ItemStatus.FOR_SALE ? (
              <WishlistButtonServer item={item} />
            ) : item.status === ItemStatus.DEALT && isBuyer ? (
              <MarkAsSoldButton itemId={item.id} />
            ) : item.status === ItemStatus.DEALT ? (
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

export async function generateMetadata({ params: { id } }: Props) {
  const { data: item } = await prefetchItem(id);

  return {
    title: item?.name,
  };
}
