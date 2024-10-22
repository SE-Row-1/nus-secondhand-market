import { prefetchWishlistStatistics } from "@/prefetchers";
import { ItemStatus, type Item, type SimplifiedAccount } from "@/types";
import { WishlistStatisticsClient } from "./wishlist-statistics.client";

type Props = {
  item: Item;
  me: SimplifiedAccount | null;
};

export async function WishlistStatisticsServer({ item, me }: Props) {
  if (item.status === ItemStatus.SOLD) {
    return null;
  }

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
