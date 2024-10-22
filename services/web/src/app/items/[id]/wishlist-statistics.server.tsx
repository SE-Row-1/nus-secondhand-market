import { prefetchWishlistStatistics } from "@/prefetchers";
import type { Item, SimplifiedAccount } from "@/types";
import { WishlistStatisticsClient } from "./wishlist-statistics.client";

type Props = {
  item: Item;
  me: SimplifiedAccount | null;
};

export async function WishlistStatisticsServer({ item, me }: Props) {
  const { data: initialWishlistStatistics, error } =
    await prefetchWishlistStatistics(item.id);

  if (error) {
    return null;
  }

  return (
    <WishlistStatisticsClient
      item={item}
      me={me}
      initialWishlistStatistics={initialWishlistStatistics}
    />
  );
}
