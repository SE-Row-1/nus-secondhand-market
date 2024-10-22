import {
  prefetchItem,
  prefetchItemTransaction,
  prefetchMe,
} from "@/prefetchers";
import { notFound, redirect } from "next/navigation";
import { ItemDetailsClient } from "./item-details.client";
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

  const identity = !me
    ? "passer-by"
    : me.id === item.seller.id
      ? "seller"
      : me.id === itemTransaction?.[0]?.buyer.id
        ? "buyer"
        : "passer-by";

  return (
    <ItemDetailsClient
      initialItem={item}
      identity={identity}
      wishlistStatistics={<WishlistStatisticsServer item={item} me={me} />}
      wishlistButton={<WishlistButtonServer item={item} />}
    />
  );
}

export async function generateMetadata({ params: { id } }: Props) {
  const { data: item } = await prefetchItem(id);

  return {
    title: item?.name,
  };
}
